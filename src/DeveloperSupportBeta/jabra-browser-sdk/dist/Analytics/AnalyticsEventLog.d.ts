import { AnalyticsEvent } from "./AnalyticsEvent";
export declare type AnalyticsEventLogListFilter = {
    eventType?: string;
    limit?: number;
    limitEvent?: AnalyticsEvent;
    offsetEvent?: AnalyticsEvent;
    interval?: {
        start: number;
        end: number;
    };
};
export declare class AnalyticsEventLog {
    private events;
    add(event: AnalyticsEvent): AnalyticsEvent;
    /**
     * Get the newest event in the events log, optionally fitler by eventType
     *
     * @param {string} [eventType]
     * @returns newest event
     * @memberof AnalyticsEventLog
     */
    newest(eventType?: string): AnalyticsEvent | null;
    /**
     *
     *
     * @param {AnalyticsEventLogListFilter} [filter]
     * @returns matching list of events
     * @memberof AnalyticsEventLog
     */
    list(filter?: AnalyticsEventLogListFilter): AnalyticsEvent[];
    clear(): void;
}
