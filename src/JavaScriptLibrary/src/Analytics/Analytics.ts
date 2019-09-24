import { EventEmitter } from "../EventEmitter";

import * as Jabra from "../core";
import { AnalyticsEvent, createAnalyticsEvent } from "./AnalyticsEvent";
import {
  AnalyticsEventList,
  AnalyticsEventListFilter
} from "./AnalyticsEventList";

/**
 * The speech status type represents whether there is silence (neither
 * transmitter or receiver)
 */
export type SpeechStatus = {
  isSilent: boolean;
  isCrosstalking: boolean;
  isTXSpeaking: boolean;
  isRXSpeaking: boolean;
};

export type SpeechTime = {
  totalTime: number;
  txSpeechTime: number;
  txSpeechTimePct: number;
  rxSpeechTime: number;
  rxSpeechTimePct: number;
  crosstalkTime: number;
  crosstalkTimePct: number;
  silenceTime: number;
  silenceTimePct: number;
};

/**
 * The Analytics will collect AnalyticsEvents and allow you to query data such
 * as speech status, speech time, and much more. To use the class, initialize an
 * instance of the class and use the start method to start collecting. The class
 * is an event emitter, so you can use addEventListener to listen to specific
 * AnalyticEvents. If you have multiple jabra devices connected and only want to
 * collect events from one of the devices supply a deviceID in the class
 * constructor.
 *
 * @export
 * @class Analytics
 * @extends {EventEmitter}
 */
export class Analytics extends EventEmitter {
  /**
   * The event log containing all the events happening when analytics start
   *
   * @private
   * @memberof Analytics
   */
  private events = new AnalyticsEventList();

  /**
   * The timestamp of when analytics was started
   *
   * @type {(number | undefined)}
   * @memberof Analytics
   */
  public startTime: number | undefined;

  /**
   * The timestamp of when the analytics was stopped
   *
   * @type {(number | undefined)}
   * @memberof Analytics
   */
  public stopTime: number | undefined;

  constructor(deviceID: number | null = null) {
    super();

    Jabra.addEventListener("devlog", (devlogEvent: Jabra.DevLogEvent) => {
      // opt out if not running
      if (!this.startTime || this.stopTime) return;

      // If an deviceID is defined, and it doesn't match the one in the
      // devlogEvent, opt out
      if (deviceID && deviceID !== devlogEvent.data.deviceID) return;

      // Since devlog events can be recieved out of order, add event to the
      // event log, which will maintain an ordered list of events.
      const event = createAnalyticsEvent(devlogEvent);

      if (event) {
        this.events.add(event);
        this.emit(event.type, event);
      }
    });
  }

  /**
   * Starts the analytics module
   *
   * @memberof Analytics
   */
  public start() {
    this.clear();
    this.startTime = Date.now();
    this.stopTime = undefined;
  }

  /**
   * Stops the analytics module
   *
   * @memberof Analytics
   */
  public stop() {
    this.stopTime = Date.now();
  }

  /**
   * Clears the event history of the analytics module
   *
   * @memberof Analytics
   */
  public clear() {
    this.events.clear();
  }

  /**
   * Get whether the transmitter or receiver is talking, and whether there's
   * crosstalk or silence
   *
   * @returns {SpeechStatus}
   * @memberof Analytics
   */
  public getSpeechStatus(): SpeechStatus {
    const txspeech = this.events.newest("txspeech");
    const rxspeech = this.events.newest("rxspeech");
    const isTXSpeaking = txspeech ? txspeech.value : false;
    const isRXSpeaking = rxspeech ? rxspeech.value : false;
    const isCrosstalking = isTXSpeaking && isRXSpeaking;
    const isSilent = !isTXSpeaking && !isRXSpeaking;

    return {
      isSilent,
      isCrosstalking,
      isTXSpeaking: isCrosstalking ? false : isTXSpeaking,
      isRXSpeaking: isCrosstalking ? false : isRXSpeaking
    };
  }

  /**
   * Get time the transmitter or reciver has talked, and how long there's
   * been crosstalk or silence
   *
   * @param {number} [fromTime]
   * @param {number} [toTime]
   * @returns {SpeechTime}
   * @memberof Analytics
   */
  public getSpeechTime(fromTime?: number, toTime?: number) {
    const query: {
      eventType: string;
      interval?: AnalyticsEventListFilter["interval"];
    } = { eventType: "txspeech rxspeech" };

    if (fromTime && toTime) {
      query.interval = { start: fromTime, end: toTime };
    }

    let events = this.events.find(query);
    const startTime = fromTime || this.startTime || 0;
    const endTime = toTime || this.stopTime || Date.now();

    let txDuration = 0;
    let txStartEvent: AnalyticsEvent | undefined;

    let rxDuration = 0;
    let rxStartEvent: AnalyticsEvent | undefined;

    let crosstalkDuration = 0;
    let crosstalkStartEvent: AnalyticsEvent | undefined;

    if (fromTime && toTime) {
      const firstTXEventBeforeInterval = this.events.find({
        eventType: "txspeech",
        limitEvent: events[0],
        limit: -1
      })[0];
      const firstRXEventBeforeInterval = this.events.find({
        eventType: "rxspeech",
        limitEvent: events[0],
        limit: -1
      })[0];

      // if tx was speaking before interval, we assume they are still speaking,
      // and add an event to the event list with the timestamp being the
      // startTime of the interval
      if (
        firstTXEventBeforeInterval &&
        firstTXEventBeforeInterval.value === true
      ) {
        events.unshift(new AnalyticsEvent("txspeech", true, startTime));
      }

      // if rx was speaking before interval, we assume they are still speaking,
      // and add an event to the event list with the timestamp being the
      // startTime of the interval
      if (
        firstRXEventBeforeInterval &&
        firstRXEventBeforeInterval.value === true
      ) {
        events.unshift(new AnalyticsEvent("rxspeech", true, startTime));
      }

      // to ensure correct calculations we pad stopping events, to the end of
      // the events list
      events.push(
        new AnalyticsEvent("txspeech", false, endTime),
        new AnalyticsEvent("rxspeech", false, endTime)
      );
    }

    for (let event of events) {
      const isTXEvent = event.type === "txspeech";
      const isRXEvent = event.type === "rxspeech";

      // if tx starts talking, and isn't already talking, mark start event
      if (isTXEvent && event.value === true && !txStartEvent) {
        txStartEvent = event;
      }

      // if rx starts talking, and isn't already talking, mark start event
      if (isRXEvent && event.value === true && !rxStartEvent) {
        rxStartEvent = event;
      }

      // if tx stops talking, and has been talking
      if (isTXEvent && event.value === false && txStartEvent) {
        // if has been crosstalking, add to crosstalk duration
        if (crosstalkStartEvent) {
          crosstalkDuration += event.timestamp - crosstalkStartEvent.timestamp;
          crosstalkStartEvent = undefined;

          // mark event as new start event for rx
          if (rxStartEvent) rxStartEvent = event;
        }
        // if hasn't been crosstalking, add to tx duration
        else {
          txDuration += event.timestamp - txStartEvent.timestamp;
        }

        txStartEvent = undefined;
      }

      // if rx stops talking, and has been talking
      if (isRXEvent && event.value === false && rxStartEvent) {
        // if has been crosstalking, add to crosstalk duration
        if (crosstalkStartEvent) {
          crosstalkDuration += event.timestamp - crosstalkStartEvent.timestamp;
          crosstalkStartEvent = undefined;
          if (txStartEvent) txStartEvent = event;
        }
        // if hasn't been crosstalking, add to rx duration
        else {
          rxDuration += event.timestamp - rxStartEvent.timestamp;
        }

        rxStartEvent = undefined;
      }

      // if both tx and rx is talking,
      if (txStartEvent && rxStartEvent && !crosstalkStartEvent) {
        // mark event as the start of crosstalk
        crosstalkStartEvent = event;

        // if tx started crosstalk, add duration to rx duration
        if (isTXEvent) {
          rxDuration += event.timestamp - rxStartEvent.timestamp;
        }

        // if rx started crosstalk, add duration to tx duration
        if (isRXEvent) {
          txDuration += event.timestamp - txStartEvent.timestamp;
        }
      }
    }

    const totalTime = endTime - startTime;
    const silenceTime =
      totalTime - (txDuration + rxDuration + crosstalkDuration);

    const calculatePercentage = (duration: number) => {
      const pct = (100 * duration) / totalTime;
      //@ts-ignore
      return +(Math.round(pct + "e+2") + "e-2");
    };

    return {
      totalTime,
      txSpeechTime: txDuration,
      txSpeechTimePct: calculatePercentage(txDuration),
      rxSpeechTime: rxDuration,
      rxSpeechTimePct: calculatePercentage(rxDuration),
      crosstalkTime: crosstalkDuration,
      crosstalkTimePct: calculatePercentage(crosstalkDuration),
      silenceTime: silenceTime,
      silenceTimePct: calculatePercentage(silenceTime)
    } as SpeechTime;
  }

  /**
   * Get whether or not the headset is muted
   *
   * @returns {boolean} - muted status
   * @memberof Analytics
   */
  getMutedStatus(): boolean {
    const event = this.events.newest("mute");
    return event ? event.value : false;
  }

  /**
   * Get the number of times the headset has been muted
   *
   * @returns {number} - muted count
   * @memberof Analytics
   */
  getMutedCount(): number {
    return this.events.find({ eventType: "mute" }).filter(event => event.value)
      .length;
  }

  /**
   * Get the boom arm position status
   *
   * @returns {(boolean | undefined)}
   * @memberof Analytics
   */
  getBoomArmStatus(): boolean | undefined {
    const event = this.events.newest("boomarm");
    return event ? event.value : undefined;
  }

  /**
   * Get the number of times the boom arm has been misaligned
   *
   * @returns {number}
   * @memberof Analytics
   */
  getBoomArmMisalignedCount(): number {
    return this.events
      .find({ eventType: "boomarm" })
      .filter(event => event.value).length;
  }

  /**
   * Get the number of times the volume has been increased
   *
   * @returns {number}
   * @memberof Analytics
   */
  getVolumeUpCount(): number {
    return this.events
      .find({ eventType: "volumeup" })
      .filter(event => event.value).length;
  }

  /**
   * Get the number of times the volume has been decreased
   *
   * @returns {number}
   * @memberof Analytics
   */
  getVolumeDownCount(): number {
    return this.events
      .find({ eventType: "volumedown" })
      .filter(event => event.value).length;
  }

  /**
   * Get the audio exposure level
   *
   * @returns {number}
   * @memberof Analytics
   */
  getAudioExposure(limit: number = -15): AnalyticsEvent[] {
    return this.events.find({ limit, eventType: "rxacousticlevel" });
  }

  /**
   * Get the average audio exposure level over a time interval
   *
   * @returns {number}
   * @memberof Analytics
   */
  getAverageAudioExposure(fromTime?: number, toTime?: number): number {
    return this.getAverageAcousticLevel("rxacousticlevel", fromTime, toTime);
  }

  /**
   * Get the average background noise level
   *
   * @returns {number}
   * @memberof Analytics
   */
  getBackgroundNoise(limit: number = -15): AnalyticsEvent[] {
    return this.events.find({ limit, eventType: "txacousticlevel" });
  }

  /**
   * Get the average background noise level over a time interval
   *
   * @returns {number}
   * @memberof Analytics
   */
  getAverageBackgroundNoise(fromTime?: number, toTime?: number): number {
    return this.getAverageAcousticLevel("txacousticlevel", fromTime, toTime);
  }

  /**
   * Get the average acoustic level level over a time interval, a private method
   * used for getAverageAudioExposure and getAverageBackgroundNoise
   *
   * @returns {number}
   * @memberof Analytics
   */
  private getAverageAcousticLevel(
    eventType: "rxacousticlevel" | "txacousticlevel",
    fromTime?: number,
    toTime?: number
  ): number {
    let events: AnalyticsEvent[] = [];

    if (fromTime && toTime) {
      const eventsWithinInterval = this.events.find({
        eventType,
        interval: { start: fromTime, end: toTime }
      });
      const firstEventBeforeInterval = this.events.find({
        eventType,
        limitEvent: eventsWithinInterval[0],
        limit: -1
      });

      events = [...firstEventBeforeInterval, ...eventsWithinInterval];
    } else {
      events = this.events.find({
        eventType
      });
    }

    // If no events was found, the headset hasn't reported an acoustic level yet
    if (events.length === 0) return 0;
    // If only one event was found, the average is the value of event
    if (events.length === 1) return events[0].value;

    let sum = 0;
    let totalWeight = 0;

    // Iterate every event and calculate sum and weight
    for (let i = 0; i < events.length - 1; i++) {
      const eventA = events[i];
      const eventB = events[i + 1];
      // weight is the number of miliseconds the acoustic level as active
      const weight = eventB.timestamp - eventA.timestamp;

      sum += weight * eventA.value;
      totalWeight += weight;
    }

    // return the weighted average
    return Math.round(sum / totalWeight);
  }
}
