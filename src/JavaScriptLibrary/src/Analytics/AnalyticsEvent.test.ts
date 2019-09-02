import { AnalyticsEvent, createAnalyticsEvent } from "./AnalyticsEvent";

const now = Date.now();

describe("AnalyticsEvent", () => {
  it("properly created analytics event", () => {
    const eventType = "test";
    const eventValue = "test";
    const eventTimestamp = Date.now();
    const event = new AnalyticsEvent(eventType, eventValue, eventTimestamp);

    expect(event.type).toBe(eventType);
    expect(event.value).toBe(eventValue);
    expect(event.timestamp).toBe(eventTimestamp);
  });
});

describe("createAnalyticsEvent", () => {
  it("properly created 'volumeup' event", () => {
    const devlogEvent = {
      data: {
        ID: "VOLUP TAP",
        TimeStampMs: now
      }
    };

    expect(createAnalyticsEvent(devlogEvent)).toStrictEqual(
      new AnalyticsEvent("volumeup", true, now)
    );
  });

  it("properly created 'volumedown' event", () => {
    const devlogEvent = {
      data: {
        ID: "VOLDOWN TAP",
        TimeStampMs: now
      }
    };

    expect(createAnalyticsEvent(devlogEvent)).toStrictEqual(
      new AnalyticsEvent("volumedown", true, now)
    );
  });

  it("properly created 'txspeech' event", () => {
    const devlogEvent = {
      data: {
        Speech_Analysis_TX: "TRUE",
        TimeStampMs: now
      }
    };

    expect(createAnalyticsEvent(devlogEvent)).toStrictEqual(
      new AnalyticsEvent("txspeech", true, now)
    );
  });

  it("properly created 'rxspeech' event", () => {
    const devlogEvent = {
      data: {
        Speech_Analysis_RX: "TRUE",
        TimeStampMs: now
      }
    };

    expect(createAnalyticsEvent(devlogEvent)).toStrictEqual(
      new AnalyticsEvent("rxspeech", true, now)
    );
  });

  it("properly created 'txacousticlevel' event", () => {
    const devlogEvent = {
      data: {
        "TX Acoustic Logging Level": 40,
        TimeStampMs: now
      }
    };

    expect(createAnalyticsEvent(devlogEvent)).toStrictEqual(
      new AnalyticsEvent("txacousticlevel", 40, now)
    );
  });

  it("properly created 'rxacousticlevel' event", () => {
    const devlogEvent = {
      data: {
        "RX Acoustic Logging Level": 40,
        TimeStampMs: now
      }
    };

    expect(createAnalyticsEvent(devlogEvent)).toStrictEqual(
      new AnalyticsEvent("rxacousticlevel", 40, now)
    );
  });

  it("properly created 'txacousticpeak' event", () => {
    const devlogEvent = {
      data: {
        "TX Acoustic Logging Peak": 40,
        TimeStampMs: now
      }
    };

    expect(createAnalyticsEvent(devlogEvent)).toStrictEqual(
      new AnalyticsEvent("txacousticpeak", 40, now)
    );
  });

  it("properly created 'rxacousticpeak' event", () => {
    const devlogEvent = {
      data: {
        "RX Acoustic Logging Peak": 40,
        TimeStampMs: now
      }
    };

    expect(createAnalyticsEvent(devlogEvent)).toStrictEqual(
      new AnalyticsEvent("rxacousticpeak", 40, now)
    );
  });

  it("properly created 'armpositionok' event", () => {
    const devlogEvent = {
      data: {
        "Boom Position Guidance OK": "TRUE",
        TimeStampMs: now
      }
    };

    expect(createAnalyticsEvent(devlogEvent)).toStrictEqual(
      new AnalyticsEvent("armpositionok", true, now)
    );
  });

  it("properly created 'badmic' event", () => {
    const devlogEvent = {
      data: {
        "Bad_Mic_detect Flag": "TRUE",
        TimeStampMs: now
      }
    };

    expect(createAnalyticsEvent(devlogEvent)).toStrictEqual(
      new AnalyticsEvent("badmic", true, now)
    );
  });

  it("properly created 'txspeech' event", () => {
    const devlogEvent = {
      data: {
        "Mute State": "TRUE",
        TimeStampMs: now
      }
    };

    expect(createAnalyticsEvent(devlogEvent)).toStrictEqual(
      new AnalyticsEvent("mute", true, now)
    );
  });
});
