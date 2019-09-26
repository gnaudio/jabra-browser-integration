import * as Jabra from "../core";

// A union containing all DevLogEvent data values that we will convert to AnalyticsEvents
export type JabraEventType =
  | "Speech_Analysis_TX"
  | "Speech_Analysis_RX"
  | "TX Acoustic Logging Level"
  | "RX Acoustic Logging Level"
  | "TX Acoustic Logging Peak"
  | "RX Acoustic Logging Peak"
  | "Boom Position Guidance OK"
  | "Bad_Mic_detect Flag"
  | "Mute State";

// A union containing all the AnalyticEvent types, these events all represent a
// change in the value they represent
export type AnalyticsEventType =
  | "txspeech" // Is the transmitter speaking
  | "rxspeech" // Is the receiver speaking
  | "txacousticlevel" // The acoustic level of the transmitter
  | "rxacousticlevel" // The acoustic level of the receiver
  | "txacousticpeak" // The acoustic level peak of the transmitter
  | "rxacousticpeak" // The acoustic level peak of the receiver
  | "armpositionok" // Is the boom arm correctly positioned
  | "badmic" // Is the mic reported as a bad mic
  | "mute"; // Is the headset muted

// This object defines the remapping between a DevLogEvent and an
// AnalyticsEvent. The object key is the key that must be present in the
// DevLogEvent, the key.eventType is the new event type given in AnalyticsEvent,
// and key.valueType is the expected primitive type of the value, so it can be
// parsed correctly
const jabraEventTypes: {
  [T in JabraEventType]: {
    eventType: AnalyticsEventType;
    valueType: "boolean" | "number";
  };
} = {
  Speech_Analysis_TX: {
    eventType: "txspeech",
    valueType: "boolean"
  },
  Speech_Analysis_RX: {
    eventType: "rxspeech",
    valueType: "boolean"
  },
  "TX Acoustic Logging Level": {
    eventType: "txacousticlevel",
    valueType: "number"
  },
  "RX Acoustic Logging Level": {
    eventType: "rxacousticlevel",
    valueType: "number"
  },
  "TX Acoustic Logging Peak": {
    eventType: "txacousticpeak",
    valueType: "number"
  },
  "RX Acoustic Logging Peak": {
    eventType: "rxacousticpeak",
    valueType: "number"
  },
  "Boom Position Guidance OK": {
    eventType: "armpositionok",
    valueType: "boolean"
  },
  "Bad_Mic_detect Flag": {
    eventType: "badmic",
    valueType: "boolean"
  },
  "Mute State": {
    eventType: "mute",
    valueType: "boolean"
  }
};

/**
 * The AnalyticsEvent class represents events that occur, when the Jabra
 * headset reports analytics data.
 *
 * @export
 * @class AnalyticsEvent
 */
export class AnalyticsEvent {
  /**
   * The event type of the analytics event
   *
   * @type {string}
   * @memberof AnalyticsEvent
   */
  public readonly type: string;

  /**
   * The value of the analytics event
   *
   * @type {*}
   * @memberof AnalyticsEvent
   */
  public readonly value: any;

  /**
   * The epoch time of the analytics event occured
   *
   * @type {number}
   * @memberof AnalyticsEvent
   */
  public readonly timestamp: number;

  constructor(type: string, value: any, timestamp?: number) {
    this.type = type;
    this.value = value;
    this.timestamp = timestamp || Date.now();
  }
}

/**
 * The createAnalyticsEvent function converts a jabra.DevLogEvent, to an
 * AnalyticsEvent. The event type and data value is parsed and sanitised before
 * the event is created.
 *
 * @export
 * @param {Jabra.DevLogEvent} event
 * @returns {(AnalyticsEvent | null)}
 */
export function createAnalyticsEvent(
  event: Jabra.DevLogEvent
): AnalyticsEvent | null {
  if ("ID" in event.data) {
    switch (event.data.ID) {
      case "VOLUP TAP":
        return new AnalyticsEvent("volumeup", true, event.data.TimeStampMs);
      case "VOLDOWN TAP":
        return new AnalyticsEvent("volumedown", true, event.data.TimeStampMs);
    }
  }

  for (const jabraEventType in jabraEventTypes) {
    if (jabraEventType in event.data) {
      const translation = jabraEventTypes[jabraEventType as JabraEventType];
      // @ts-ignore
      let value = event.data[jabraEventType];

      switch (translation.valueType) {
        case "boolean":
          value = value.toLowerCase() === "true";
          break;
        case "number":
          value = Number(value);
          break;
        default:
          break;
      }

      return new AnalyticsEvent(
        translation.eventType,
        value,
        event.data.TimeStampMs
      );
    }
  }

  return null;
}
