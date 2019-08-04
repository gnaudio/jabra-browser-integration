import AnalyticsEvent from "./AnalyticsEvent";

export type AnalyticsEventLogListFilter = {
  eventType?: string;
  limit?: number;
  limitEvent?: AnalyticsEvent;
  offsetEvent?: AnalyticsEvent;
  interval?: { start: number; end: number };
};

class AnalyticsEventLog {
  // An array of events sorted by the time it was emitted.
  private events: AnalyticsEvent[] = [];

  // Asuming this.events is sorted, add an event while maintaining order.
  public add(event: AnalyticsEvent): AnalyticsEvent {
    // Find the index of the first event older than current event.
    let index = this.events.findIndex(e => {
      return event.timestamp < e.timestamp;
    });

    // If event is older than any other event, add to back of event log
    if (index === -1) index = this.events.length;

    // Add all events before current event, current event, and all events after
    // current event
    this.events = [
      ...this.events.slice(0, index),
      event,
      ...this.events.slice(index)
    ];

    // Return parsed AnalyticsEvent
    return event;
  }

  /**
   * Get the newest event in the events log, optionally fitler by eventType
   *
   * @param {string} [eventType]
   * @returns newest event
   * @memberof AnalyticsEventLog
   */
  public newest(eventType?: string) {
    // If eventType has been specified return last event with that type
    if (eventType) {
      for (let i = this.events.length - 1; i > 0; i--) {
        const event = this.events[i];

        if (event.type === eventType) return event;
      }

      return null;
    }

    // Else return last event of array
    return this.events[this.events.length - 1] || null;
  }

  /**
   *
   *
   * @param {AnalyticsEventLogListFilter} [filter]
   * @returns matching list of events
   * @memberof AnalyticsEventLog
   */
  public list(filter?: AnalyticsEventLogListFilter) {
    let events = this.events;

    if (filter) {
      const { eventType, limit, interval, limitEvent, offsetEvent } = filter;

      if (limitEvent) {
        events = events.slice(0, this.events.indexOf(limitEvent));
      }

      if (offsetEvent) {
        events = events.slice(this.events.indexOf(offsetEvent));
      }

      if (eventType || interval) {
        events = events.filter(({ type, timestamp }) => {
          if (eventType && !eventType.includes(type)) return false;
          if (interval && interval.start && timestamp < interval.start)
            return false;
          if (interval && interval.end && timestamp > interval.end)
            return false;

          return true;
        });
      }

      if (limit) {
        events = limit > 0 ? events.slice(0, limit) : events.slice(limit);
      }
    }

    return events;
  }

  public clear() {
    this.events = [];
  }
}

export default AnalyticsEventLog;
