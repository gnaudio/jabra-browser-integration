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

export type AnalyticsEventType =
  | "txspeech"
  | "rxspeech"
  | "txacousticlevel"
  | "rxacousticlevel"
  | "txacousticpeak"
  | "rxacousticpeak"
  | "armpositionok"
  | "badmic"
  | "mute";

const jabraEventTypes: {
  [T in JabraEventType]: {
    eventType: AnalyticsEventType;
    valueType: "boolean" | "number";
  }
} = {
  Speech_Analysis_TX: { eventType: "txspeech", valueType: "boolean" },
  Speech_Analysis_RX: { eventType: "rxspeech", valueType: "boolean" },
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
  "Bad_Mic_detect Flag": { eventType: "badmic", valueType: "boolean" },
  "Mute State": { eventType: "mute", valueType: "boolean" }
};

export class AnalyticsEvent {
  public type: string;
  public value: any;
  public timestamp: number;

  constructor(type: string, value: any, timestamp?: number) {
    this.type = type;
    this.value = value;
    this.timestamp = timestamp || Date.now();
  }
}

export function createAnalyticsEvent(event: any): AnalyticsEvent | null {
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
