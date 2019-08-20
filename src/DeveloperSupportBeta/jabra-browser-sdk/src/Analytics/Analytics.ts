import EventEmitter from "eventemitter3";

import * as Jabra from "../jabra.browser.integration-2.1";
import { AnalyticsEvent, createAnalyticsEvent } from "./AnalyticsEvent";
import {
  AnalyticsEventLog,
  AnalyticsEventLogListFilter
} from "./AnalyticsEventLog";

export class Analytics extends EventEmitter {
  private events = new AnalyticsEventLog();

  public startTime: number | undefined;
  public stopTime: number | undefined;

  constructor() {
    super();

    Jabra.addEventListener("devlog", (devlogEvent: any) => {
      // opt out if not running
      if (!this.startTime || this.stopTime) return;
      // Since devlog events can be recieved out of order, add event to the
      // event log, which will maintain an ordered list of events.
      const event = createAnalyticsEvent(devlogEvent);

      if (event) {
        this.events.add(event);
        this.emit(event.type, event);
      }
    });
  }

  public start() {
    this.startTime = Date.now();
    this.stopTime = undefined;
  }

  public stop() {
    this.stopTime = Date.now();
  }

  public clear() {
    this.events.clear();
  }

  public getSpeechStatus() {
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

  public getSpeechTime(fromTime?: number, toTime?: number) {
    const query: {
      eventType: string;
      interval?: AnalyticsEventLogListFilter["interval"];
    } = { eventType: "txspeech rxspeech" };

    if (fromTime && toTime) {
      query.interval = { start: fromTime, end: toTime };
    }

    let events = this.events.list(query);
    const startTime = fromTime || this.startTime || 0;
    const endTime = toTime || this.stopTime || Date.now();

    let txDuration = 0;
    let txStartEvent: any | undefined;

    let rxDuration = 0;
    let rxStartEvent: any | undefined;

    let crosstalkDuration = 0;
    let crosstalkStartEvent: any | undefined;

    if (fromTime && toTime) {
      const firstTXEventBeforeInterval = this.events.list({
        eventType: "txspeech",
        limitEvent: events[0],
        limit: -1
      })[0];
      const firstRXEventBeforeInterval = this.events.list({
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
    };
  }

  getMutedStatus(): boolean {
    const event = this.events.newest("mute");
    return event ? event.value : false;
  }
  getMutedCount(): number {
    return this.events.list({ eventType: "mute" }).filter(event => event.value)
      .length;
  }

  getBoomArmStatus(): boolean | undefined {
    const event = this.events.newest("boomarm");
    return event ? event.value : undefined;
  }
  getBoomArmMisalignedCount(): number {
    return this.events
      .list({ eventType: "boomarm" })
      .filter(event => event.value).length;
  }

  getVolumeUpCount(): number {
    return this.events
      .list({ eventType: "volumeup" })
      .filter(event => event.value).length;
  }
  getVolumeDownCount(): number {
    return this.events
      .list({ eventType: "volumedown" })
      .filter(event => event.value).length;
  }

  getAudioExposure(limit: number = -15): AnalyticsEvent[] {
    return this.events.list({ limit, eventType: "rxacousticlevel" });
  }
  getAverageAudioExposure(fromTime?: number, toTime?: number): number {
    const eventType = "rxacousticlevel";

    let events: AnalyticsEvent[] = [];

    if (fromTime && toTime) {
      const eventsWithinInterval = this.events.list({
        eventType,
        interval: { start: fromTime, end: toTime }
      });
      const firstEventBeforeInterval = this.events.list({
        eventType,
        limitEvent: eventsWithinInterval[0],
        limit: -1
      });

      events = [...firstEventBeforeInterval, ...eventsWithinInterval];
    } else {
      events = this.events.list({
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

  getBackgroundNoise(limit: number = -15): AnalyticsEvent[] {
    return this.events.list({ limit, eventType: "txacousticlevel" });
  }
  getAverageBackgroundNoise(fromTime?: number, toTime?: number): number {
    const eventType = "txacousticlevel";

    let events: AnalyticsEvent[] = [];

    if (fromTime && toTime) {
      const eventsWithinInterval = this.events.list({
        eventType,
        interval: { start: fromTime, end: toTime }
      });
      const firstEventBeforeInterval = this.events.list({
        eventType,
        limitEvent: eventsWithinInterval[0],
        limit: -1
      });

      events = [...firstEventBeforeInterval, ...eventsWithinInterval];
    } else {
      events = this.events.list({
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

export default Analytics;
