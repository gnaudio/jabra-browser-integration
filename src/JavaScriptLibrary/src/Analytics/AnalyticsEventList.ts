import { AnalyticsEvent } from "./AnalyticsEvent";

export type AnalyticsEventListFilter = {
  eventType?: string;
  limit?: number;
  limitEvent?: AnalyticsEvent;
  offsetEvent?: AnalyticsEvent;
  interval?: { start: number; end: number };
};

/**
 * The AnalyticsEventList class, is used to maintain and time ordered list of
 * events. Since there is no guarentee that analytics events will be received in
 * order, the add method of this class ensures that an event is inserted into
 * the list sorted. Besides that, it provides a convenient way to query events
 * in the list, using the methods newest or find.
 *
 * @export
 * @class AnalyticsEventList
 */
export class AnalyticsEventList {
  // An array of events sorted by the time it was emitted.
  private events: AnalyticsEvent[] = [];

  /**
   * Add an AnalyticsEvent to the event list, the list will automatically keep
   * the list sorted by the time it was emitted
   *
   * @param {AnalyticsEvent} event
   * @returns {AnalyticsEvent}
   * @memberof AnalyticsEventList
   */
  public add(event: AnalyticsEvent): AnalyticsEvent {
    // Asuming this.events is sorted, add an event while maintaining order.
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
   * @memberof AnalyticsEventList
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
   * Find a subset of events based on an object of filter parameters.
   *
   * @param {AnalyticsEventLogListFilter} [filter]
   * @param {string} filter.eventType A space separated list of event types to filter on
   * @param {number} filter.limit Limit the result to a specified number of events
   * @param {AnalyticsEvent} filter.limitEvent Limit the result to a specifc event, and get all events up to the specified event
   * @param {AnalyticsEvent} filter.offsetEvent Offset the result to a specifc event, and get all events after the specified event
   * @param {object} filter.interval Filter events by an start and end time, and get all events within the specified interval
   * @returns matching list of events
   * @memberof AnalyticsEventList
   */
  public find(filter?: AnalyticsEventListFilter) {
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
