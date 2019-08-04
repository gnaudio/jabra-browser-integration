import EventEmitter from "eventemitter3";

import * as Jabra from "../jabra.browser.integration-2.1";
import {
  AnalyticsEvent,
  createAnalyticsEvent,
  AnalyticsEventType
} from "./AnalyticsEvent";
import AnalyticsEventLog, {
  AnalyticsEventLogListFilter
} from "./AnalyticsEventLog";

export class Analytics extends EventEmitter {
  private events = new AnalyticsEventLog();

  public startTime: number | undefined;
  public stopTime: number | undefined;

  constructor() {
    super();

    Jabra.addEventListener("devlog", (devlogEvent: any) => {
      // Since devlog events can be recieved out of order, add event to the
      // event log, which will maintain an ordered list of events.
      const event = createAnalyticsEvent(devlogEvent);

      if (event) {
        this.events.add(event);
        this.emit(event.type, event);
      }
    });
  }

  public clear() {
    this.events.clear();
  }
  //
  //
  //
  //
  //
  // getStatus(excludeCrosstalk: boolean = false) {
  //   const txspeech = this.events.newest("txspeech");
  //   const rxspeech = this.events.newest("rxspeech");

  //   const isTXSpeaking = txspeech ? txspeech.value : false;
  //   const isRXSpeaking = rxspeech ? rxspeech.value : false;

  //   const status = {
  //     isTXSpeaking,
  //     isRXSpeaking,
  //     isCrosstalking: isTXSpeaking && isRXSpeaking,
  //     isSilent: !isTXSpeaking && !isRXSpeaking
  //   };

  //   if (excludeCrosstalk && status.isCrosstalking) {
  //     status.isTXSpeaking = false;
  //     status.isRXSpeaking = false;
  //   }

  //   return status;
  // }

  // /**
  //  * Get the speech time of either transmitter or reciever
  //  *
  //  * @param {number} startTime
  //  * @param {number} endTime
  //  * @returns speech time in miliseconds
  //  * @memberof Analytics
  //  */
  // public getSpeechTime(
  //   eventType: "txspeech" | "rxspeech",
  //   offsetEvent?: AnalyticsEvent
  // ) {
  //   const events = this.events.list({ eventType, offsetEvent });

  //   let time = 0;
  //   let startEvent: AnalyticsEvent | undefined;
  //   let calculatedEvents: AnalyticsEvent[] = [];

  //   for (const event of events) {
  //     // Since this.history is ordered oldest to newest, if we find a true,
  //     // find matching false
  //     if (event.value === true) startEvent = event;

  //     // When value is false, it's a match for startTime, calculate time difference
  //     // and update totalTime, also mark the element as last calculated element
  //     if (event.value === false && startEvent !== undefined) {
  //       time += event.timestamp - startEvent.timestamp;
  //       calculatedEvents.push(startEvent, event);
  //       startEvent = undefined;
  //     }
  //   }

  //   return { time, calculatedEvents };
  // }

  // getCrosstalkTime() {
  //   const events = this.events.list({
  //     eventType: "txspeech rxspeech"
  //   });

  //   let totalTime = 0;
  //   let startTime = null;
  //   let txSpeaking = false;
  //   let rxSpeaking = false;

  //   for (const event of events) {
  //     if (event.type === "txspeech") txSpeaking = event.value;
  //     if (event.type === "rxspeech") rxSpeaking = event.value;

  //     if (startTime === null && txSpeaking === true && rxSpeaking === true) {
  //       startTime = event.timestamp;
  //     }

  //     if (
  //       startTime !== null &&
  //       (txSpeaking === false || rxSpeaking === false)
  //     ) {
  //       totalTime += event.timestamp - startTime;
  //       startTime = null;
  //     }
  //   }

  //   return totalTime;
  // }

  // getSilenceTime(threshold: number = 1000) {
  //   const events = this.events.list({ eventType: "txspeech rxspeech" });

  //   let totalTime = 0;
  //   let startTime = null;
  //   let txSpeaking = false;
  //   let rxSpeaking = false;

  //   for (const event of events) {
  //     if (event.type === "txspeech") txSpeaking = event.value;
  //     if (event.type === "rxspeech") rxSpeaking = event.value;

  //     if (startTime === null && txSpeaking === false && rxSpeaking === false) {
  //       startTime = event.timestamp;
  //     }

  //     if (startTime !== null && (txSpeaking === true || rxSpeaking === true)) {
  //       const time = event.timestamp - startTime;

  //       if (time > threshold) totalTime += time;

  //       startTime = null;
  //     }
  //   }

  //   return totalTime;
  // }

  // public getAcousticLevel(
  //   eventType: "txacousticlevel" | "rxacousticlevel",
  //   limit: number = 15
  // ) {
  //   return this.events.list({ eventType, limit });
  // }

  // public getAvgAcousticLevel(
  //   eventType: "txacousticlevel" | "rxacousticlevel",
  //   interval?: { start: number; end: number }
  // ) {
  //   // get events within time interval
  //   const eventsWithinInterval = this.events.list({ eventType, interval });
  //   // get first event before time interval
  //   const firstEventBeforeInterval = this.events.list({
  //     eventType,
  //     limitEvent: eventsWithinInterval[0],
  //     limit: -1
  //   });
  //   // combine the two arrays of events
  //   const events = [...firstEventBeforeInterval, ...eventsWithinInterval];

  //   // If no events was found, the headset hasn't reported an acoustic level yet
  //   if (events.length === 0) return 0;
  //   // If only one event was found, the average is the value of event
  //   if (events.length === 1) return events[0].value;

  //   let sum = 0;
  //   let totalWeight = 0;

  //   // Iterate every event and calculate sum and weight
  //   for (let i = 0; i < events.length - 1; i++) {
  //     const eventA = events[i];
  //     const eventB = events[i + 1];
  //     // weight is the number of miliseconds the acoustic level as active
  //     const weight = eventB.timestamp - eventA.timestamp;

  //     sum += weight * eventA.value;
  //     totalWeight += weight;
  //   }

  //   // return the weighted average
  //   return Math.round(sum / totalWeight);
  // }
  //
  //
  //
  //
  //
  getDuration(): number {
    return (
      this.getTXSpeechTime() +
      this.getRXSpeechTime() +
      this.getCrosstalkTime() +
      this.getSilenceTime()
    );
  }

  getTXSpeechStatus(): boolean {
    const txspeech = this.events.newest("txspeech");

    return txspeech ? txspeech.value : false;
  }
  getTXSpeechTime(fromTime?: number, toTime?: number): number {
    const query: {
      eventType: AnalyticsEventType;
      interval?: AnalyticsEventLogListFilter["interval"];
    } = { eventType: "txspeech" };

    if (fromTime && toTime) {
      query.interval = { start: fromTime, end: toTime };
    }

    const events = this.events.list(query);

    let time = 0;
    let startEvent: AnalyticsEvent | undefined;

    for (const event of events) {
      // Since this.history is ordered oldest to newest, if we find a true,
      // find matching false
      if (event.value === true) startEvent = event;

      // When value is false, it's a match for startTime, calculate time difference
      // and update totalTime, also mark the element as last calculated element
      if (event.value === false && startEvent !== undefined) {
        time += event.timestamp - startEvent.timestamp;
        startEvent = undefined;
      }
    }

    return time;
  }
  getTXSpeechPercentage(fromTime?: number, toTime?: number): number {
    return (100 * this.getTXSpeechTime(fromTime, toTime)) / this.getDuration();
  }

  getRXSpeechStatus(): boolean {
    const rxspeech = this.events.newest("rxspeech");

    return rxspeech ? rxspeech.value : false;
  }
  getRXSpeechTime(fromTime?: number, toTime?: number): number {
    const query: {
      eventType: string;
      interval?: { start: number; end: number };
    } = { eventType: "rxspeech" };

    if (fromTime && toTime) {
      query.interval = { start: fromTime, end: toTime };
    }

    const events = this.events.list(query);

    let time = 0;
    let startEvent: AnalyticsEvent | undefined;

    for (const event of events) {
      // Since this.history is ordered oldest to newest, if we find a true,
      // find matching false
      if (event.value === true) startEvent = event;

      // When value is false, it's a match for startTime, calculate time difference
      // and update totalTime, also mark the element as last calculated element
      if (event.value === false && startEvent !== undefined) {
        time += event.timestamp - startEvent.timestamp;
        startEvent = undefined;
      }
    }

    return time;
  }
  getRXSpeechPercentage(fromTime?: number, toTime?: number): number {
    return (100 * this.getRXSpeechTime(fromTime, toTime)) / this.getDuration();
  }

  getCrosstalkStatus(): boolean {
    return this.getTXSpeechStatus() && this.getRXSpeechStatus();
  }
  getCrosstalkTime(fromTime?: number, toTime?: number): number {
    const query: {
      eventType: string;
      interval?: { start: number; end: number };
    } = { eventType: "txspeech rxspeech" };

    if (fromTime && toTime) {
      query.interval = { start: fromTime, end: toTime };
    }

    const events = this.events.list(query);

    let totalTime = 0;
    let startTime = null;
    let txSpeaking = false;
    let rxSpeaking = false;

    for (const event of events) {
      if (event.type === "txspeech") txSpeaking = event.value;
      if (event.type === "rxspeech") rxSpeaking = event.value;

      if (startTime === null && txSpeaking === true && rxSpeaking === true) {
        startTime = event.timestamp;
      }

      if (
        startTime !== null &&
        (txSpeaking === false || rxSpeaking === false)
      ) {
        totalTime += event.timestamp - startTime;
        startTime = null;
      }
    }

    return totalTime;
  }
  getCrosstalkPercentage(fromTime?: number, toTime?: number): number {
    return (100 * this.getCrosstalkTime(fromTime, toTime)) / this.getDuration();
  }

  getSilenceStatus(): boolean {
    return !this.getTXSpeechStatus() && !this.getRXSpeechStatus();
  }
  getSilenceTime(fromTime?: number, toTime?: number): number {
    const query: {
      eventType: string;
      interval?: { start: number; end: number };
    } = { eventType: "txspeech rxspeech" };

    if (fromTime && toTime) {
      query.interval = { start: fromTime, end: toTime };
    }

    const events = this.events.list(query);

    let totalTime = 0;
    let startTime = null;
    let txSpeaking = false;
    let rxSpeaking = false;

    for (const event of events) {
      if (event.type === "txspeech") txSpeaking = event.value;
      if (event.type === "rxspeech") rxSpeaking = event.value;

      if (startTime === null && txSpeaking === false && rxSpeaking === false) {
        startTime = event.timestamp;
      }

      if (startTime !== null && (txSpeaking === true || rxSpeaking === true)) {
        const time = event.timestamp - startTime;

        if (time > 1000) totalTime += time;

        startTime = null;
      }
    }

    return totalTime;
  }
  getSilencePercentage(fromTime?: number, toTime?: number): number {
    return (100 * this.getSilenceTime(fromTime, toTime)) / this.getDuration();
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
    return this.events.list({ limit, eventType: "txacousticlevel" });
  }
  getAverageAudioExposure(fromTime?: number, toTime?: number): number {
    const eventType = "txacousticlevel";

    let events: AnalyticsEvent[] = [];

    if (fromTime && toTime) {
      const eventsWithinInterval = this.events.list({
        eventType: "txacousticlevel",
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
    return this.events.list({ limit, eventType: "rxacousticlevel" });
  }
  getAverageBackgroundNoise(fromTime?: number, toTime?: number): number {
    const eventType = "rxacousticlevel";

    let events: AnalyticsEvent[] = [];

    if (fromTime && toTime) {
      const eventsWithinInterval = this.events.list({
        eventType: "txacousticlevel",
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
