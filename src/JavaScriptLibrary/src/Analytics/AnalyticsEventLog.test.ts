import { AnalyticsEventLog } from "./AnalyticsEventLog";
import { AnalyticsEvent } from "./AnalyticsEvent";

const now = Date.now();

describe("AnalyticsEventLog", () => {
  it("adds event to eventlog", () => {
    const eventLog = new AnalyticsEventLog();

    const event = new AnalyticsEvent("txspeech", true, now);
    eventLog.add(event);

    //@ts-ignore
    expect(eventLog.events[0]).toStrictEqual(event);
  });

  it("keeps eventlog in order, when added out of order", () => {
    const eventLog = new AnalyticsEventLog();

    const event1 = new AnalyticsEvent("txspeech", true, now);
    const event2 = new AnalyticsEvent("txspeech", true, now + 5000);
    const event3 = new AnalyticsEvent("txspeech", true, now);

    eventLog.add(event2);
    eventLog.add(event1);
    eventLog.add(event3);

    //@ts-ignore
    expect(eventLog.events[0]).toStrictEqual(event1);
    //@ts-ignore
    expect(eventLog.events[1]).toStrictEqual(event3);
    //@ts-ignore
    expect(eventLog.events[2]).toStrictEqual(event2);
  });
});
