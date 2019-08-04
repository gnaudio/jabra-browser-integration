export declare type JabraEventType = "Speech_Analysis_TX" | "Speech_Analysis_RX" | "TX Acoustic Logging Level" | "RX Acoustic Logging Level" | "TX Acoustic Logging Peak" | "RX Acoustic Logging Peak" | "Boom Position Guidance OK" | "Bad_Mic_detect Flag" | "Mute State";
export declare type AnalyticsEventType = "txspeech" | "rxspeech" | "txacousticlevel" | "rxacousticlevel" | "txacousticpeak" | "rxacousticpeak" | "armpositionok" | "badmic" | "mute";
export declare class AnalyticsEvent {
    type: string;
    value: any;
    timestamp: number;
    constructor(type: string, value: any, timestamp?: number);
}
export declare function createAnalyticsEvent(event: any): AnalyticsEvent | null;
export default AnalyticsEvent;
