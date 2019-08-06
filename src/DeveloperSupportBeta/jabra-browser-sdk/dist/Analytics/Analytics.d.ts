import EventEmitter from "eventemitter3";
import { AnalyticsEvent } from "./AnalyticsEvent";
export declare class Analytics extends EventEmitter {
    private events;
    startTime: number | undefined;
    stopTime: number | undefined;
    constructor();
    start(): void;
    stop(): void;
    clear(): void;
    getSpeechStatus(): {
        isSilent: boolean;
        isCrosstalking: any;
        isTXSpeaking: any;
        isRXSpeaking: any;
    };
    getSpeechTime(fromTime?: number, toTime?: number): {
        totalTime: number;
        txSpeechTime: number;
        txSpeechTimePct: number;
        rxSpeechTime: number;
        rxSpeechTimePct: number;
        crosstalkTime: number;
        crosstalkTimePct: number;
        silenceTime: number;
        silenceTimePct: number;
    };
    getMutedStatus(): boolean;
    getMutedCount(): number;
    getBoomArmStatus(): boolean | undefined;
    getBoomArmMisalignedCount(): number;
    getVolumeUpCount(): number;
    getVolumeDownCount(): number;
    getAudioExposure(limit?: number): AnalyticsEvent[];
    getAverageAudioExposure(fromTime?: number, toTime?: number): number;
    getBackgroundNoise(limit?: number): AnalyticsEvent[];
    getAverageBackgroundNoise(fromTime?: number, toTime?: number): number;
}
export default Analytics;
