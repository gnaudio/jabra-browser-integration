// Generated by dts-bundle v0.7.3

declare module '@gnaudio/jabra-browser-integration' {
    export * from "@gnaudio/jabra-browser-integration/core";
    export * from "@gnaudio/jabra-browser-integration/meta";
    export * from "@gnaudio/jabra-browser-integration/Analytics";
}

declare module '@gnaudio/jabra-browser-integration/core' {
    /**
        * Version of this javascript api (should match version number in file apart from possible alfa/beta designator).
        */
    export const apiVersion = "3.0.0-beta.7";
    /**
        * Contains information about installed components.
        */
    export interface InstallInfo {
            installationOk: boolean;
            version_chromehost: string;
            version_nativesdk: string;
            version_browserextension: string;
            version_jsapi: string;
            browserextension_id: string;
            browserextension_type: string;
    }
    /**
        * Contains information about a device
        */
    export interface DeviceInfo {
            deviceID: number;
            deviceName: string;
            deviceConnection: number;
            deviceFeatures: ReadonlyArray<DeviceFeature>;
            errStatus: number;
            isBTPaired?: boolean;
            isInFirmwareUpdateMode: boolean;
            productID: number;
            serialNumber?: string;
            variant: string;
            dongleName?: string;
            skypeCertified: boolean;
            firmwareVersion?: string;
            electricSerialNumbers?: ReadonlyArray<string>;
            batteryLevelInPercent?: number;
            batteryCharging?: boolean;
            batteryLow?: boolean;
            leftEarBudStatus?: boolean;
            equalizerEnabled?: boolean;
            busyLight?: boolean;
            /**
                * Set to ID of related dongle and/or headset if both are paired and connected.
                */
            connectedDeviceID?: number;
            /**
                * Set if the same device is connected in more than one way (BT and USB), so
                * the device appears twice.
                */
            aliasDeviceID?: number;
            /**
                * Only available in debug versions.
                */
            parentInstanceId?: string;
            /**
                * Only available in debug versions.
                */
            usbDevicePath?: string;
            /**
                * Browser media device information group (browser session specific).
                * Only available when calling getDevices/getActiveDevice with includeBrowserMediaDeviceInfo argument set to true.
                */
            browserGroupId?: string;
            /**
                * The browser's unique identifier for the input (e.g. microphone) part of the Jabra device (page origin specific).
                * Only available when calling getDevices/getActiveDevice with includeBrowserMediaDeviceInfo argument set to true.
                */
            browserAudioInputId?: string;
            /**
                * The browser's unique identifier for an output (e.g. speaker) part of the Jabra device (page origin specific).
                * Only available when calling getDevices/getActiveDevice with includeBrowserMediaDeviceInfo argument set to true.
                */
            browserAudioOutputId?: string;
            /**
                * The browser's textual descriptor of the device.
                * Only available when calling getDevices/getActiveDevice with includeBrowserMediaDeviceInfo argument set to true.
                */
            browserLabel?: string;
    }
    /**
        * A combination of a media stream and information of the associated device from the view of the browser.
        */
    export interface MediaStreamAndDeviceInfoPair {
            stream: MediaStream;
            deviceInfo: DeviceInfo;
    }
    /**
        * All button event names.
        */
    export type ButtonEventName = "mute" | "unmute" | "acceptcall" | "endcall" | "reject" | "flash" | "online" | "offline" | "linebusy" | "lineidle" | "redial" | "key0" | "key1" | "key2" | "key3" | "key4" | "key5" | "key6" | "key7" | "key8" | "key9" | "keyStar" | "keyPound" | "keyClear" | "Online" | "speedDial" | "voiceMail" | "LineBusy" | "outOfRange" | "intoRange" | "pseudoAcceptcall" | "pseudoEndcall" | "button1" | "button2" | "button3" | "volumeUp" | "volumeDown" | "fireAlarm" | "jackConnection" | "jackDisConnection" | "qdConnection" | "qdDisconnection" | "headsetConnection" | "headsetDisConnection";
    /**
        * Names of events describing device being added/removed.
        */
    export type AttachedDeattachedEventName = "device attached" | "device detached";
    /**
        * Names of events presently without a type definition (subject to change).
        */
    export type UntypedEventName = "busylight" | "hearThrough" | "batteryStatus" | "gnpButton" | "mmi" | "error";
    /**
        * All possible device events as discriminative  union.
        */
    export type EventName = ButtonEventName | AttachedDeattachedEventName | "devlog" | UntypedEventName;
    /**
        * Error status codes returned by SDK. Same as Jabra_ErrorStatus in native SDK.
        */
    export enum ErrorCodes {
            NoError = 0,
            SSLError = 1,
            CertError = 2,
            NetworkError = 3,
            DownloadError = 4,
            ParseError = 5,
            OtherError = 6,
            DeviceInfoError = 7,
            FileNotAccessible = 8,
            FileNotCompatible = 9,
            Device_NotFound = 10,
            Parameter_fail = 11,
            Authorization_failed = 12,
            FileNotAvailable = 13,
            ConfigParseError = 14,
            SetSettings_Fail = 15,
            Device_Reboot = 16,
            Device_ReadFail = 17,
            Device_NotReady = 18,
            FilePartiallyCompatible = 19
    }
    /**
        * Error return codes. Same as Jabra_ReturnCode in native SDK.
        */
    export enum ErrorReturnCodes {
            Return_Ok = 0,
            Device_Unknown = 1,
            Device_Invalid = 2,
            Not_Supported = 3,
            Return_ParameterFail = 4,
            ProtectedSetting_Write = 5,
            No_Information = 6,
            NetworkRequest_Fail = 7,
            Device_WriteFail = 8,
            Device_ReadFails = 9,
            No_FactorySupported = 10,
            System_Error = 11,
            Device_BadState = 12,
            FileWrite_Fail = 13,
            File_AlreadyExists = 14,
            File_Not_Accessible = 15,
            Firmware_UpToDate = 16,
            Firmware_Available = 17,
            Return_Async = 18,
            Invalid_Authorization = 19,
            FWU_Application_Not_Available = 20,
            Device_AlreadyConnected = 21,
            Device_NotConnected = 22,
            CannotClear_DeviceConnected = 23,
            Device_Rebooted = 24,
            Upload_AlreadyInProgress = 25,
            Download_AlreadyInProgress = 26
    }
    /**
        * Custom error returned by commands expecting results when failing.
        */
    export class CommandError extends Error {
            command: string;
            errmessage: string;
            data: any;
            constructor(command: string, errmessage: string, data?: string);
    }
    /**
        * General event type for call backs.
        */
    export interface Event {
            message: EventName;
            data: {
                    [key: string]: any;
            } & {
                    deviceID: number;
                    activeDevice?: boolean;
            };
    }
    /**
        * Event type for device added/removed.
        */
    export interface DeviceAttachedDeAttachedEvent {
            message: "device attached" | "device detached";
            data: DeviceInfo;
    }
    /**
        * Event type for button events;
        */
    export interface ButtonEvent {
            message: ButtonEventName;
            data: {
                    deviceID: number;
                    activeDevice: boolean;
                    buttonInData: boolean;
                    isOffHook: boolean;
                    ringing: boolean;
                    translatedInData: number;
            };
    }
    /**
        * Event type for dev log call backs.
        */
    export interface DevLogEvent {
            message: "devlog";
            data: {
                    deviceID: number;
                    activeDevice: boolean;
                    AppID: string;
                    ESN: string;
                    FW: string;
                    LocalTimeStamp: string;
                    Pid: number;
                    TimeStampMs: number;
                    Variant: string;
                    "Device Name": string;
                    "Raw data": string;
                    "Seq.No": number;
                    "TX Acoustic Logging Level": string;
                    "TX Acoustic Logging Peak": string;
                    "RX Acoustic Logging Level": string;
                    "RX Acoustic Logging Peak": string;
                    Speech_Analysis_TX: string;
                    Speech_Analysis_RX: string;
                    "Boom Position Guidance OK": string;
                    "Bad_Mic_detect Flag": string;
                    ID: string;
            };
    }
    /**
        * The format of errors returned.
        */
    export type ClientError = any | {
            error: string;
    };
    /**
        * The format of messages returned.
        */
    export type ClientMessage = any | {
            message: string;
    };
    /**
        * Type for event callback functions..
        */
    export type EventCallback = (event: Event | DeviceAttachedDeAttachedEvent | ButtonEvent | DevLogEvent) => void;
    /**
        * Device feature codes.
        */
    export enum DeviceFeature {
            BusyLight = 1000,
            FactoryReset = 1001,
            PairingList = 1002,
            RemoteMMI = 1003,
            MusicEqualizer = 1004,
            EarbudInterconnectionStatus = 1005,
            StepRate = 1006,
            HeartRate = 1007,
            RRInterval = 1008,
            RingtoneUpload = 1009,
            ImageUpload = 1010,
            NeedsExplicitRebootAfterOta = 1011,
            NeedsToBePutIncCradleToCompleteFwu = 1012,
            RemoteMMIv2 = 1013,
            Logging = 1014,
            PreferredSoftphoneListInDevice = 1015,
            VoiceAssistant = 1016,
            PlayRingtone = 1017
    }
    /**
        * A specification of a button for MMI capturing.
        */
    export enum RemoteMmiType {
            MMI_TYPE_MFB = 0,
            MMI_TYPE_VOLUP = 1,
            MMI_TYPE_VOLDOWN = 2,
            MMI_TYPE_VCB = 3,
            MMI_TYPE_APP = 4,
            MMI_TYPE_TR_FORW = 5,
            MMI_TYPE_TR_BACK = 6,
            MMI_TYPE_PLAY = 7,
            MMI_TYPE_MUTE = 8,
            MMI_TYPE_HOOK_OFF = 9,
            MMI_TYPE_HOOK_ON = 10,
            MMI_TYPE_BLUETOOTH = 11,
            MMI_TYPE_JABRA = 12,
            MMI_TYPE_BATTERY = 13,
            MMI_TYPE_PROG = 14,
            MMI_TYPE_LINK = 15,
            MMI_TYPE_ANC = 16,
            MMI_TYPE_LISTEN_IN = 17,
            MMI_TYPE_DOT3 = 18,
            MMI_TYPE_DOT4 = 19,
            MMI_TYPE_BUSYLIGHT = 128
    }
    /**
        * A MMI effect specification for light on, off or blinking in different tempo.
        * Nb: For legacy reasons these values are different than those in the C-SDK.
        */
    export enum RemoteMmiSequence {
            MMI_LED_SEQUENCE_OFF = 0,
            MMI_LED_SEQUENCE_ON = 1,
            MMI_LED_SEQUENCE_SLOW = 2,
            MMI_LED_SEQUENCE_FAST = 3
    }
    /**
        * MMI button actions reported when button has focus.
        */
    export enum RemoteMmiActionInput {
            MMI_ACTION_UP = 1,
            MMI_ACTION_DOWN = 2,
            MMI_ACTION_TAP = 4,
            MMI_ACTION_DOUBLE_TAP = 8,
            MMI_ACTION_PRESS = 16,
            MMI_ACTION_LONG_PRESS = 32,
            MMI_ACTION_X_LONG_PRESS = 64
    }
    /**
        * A 3 x 8 bit set of RGB colors. Numbers can be between 0-255.
        */
    export type ColorType = [number, number, number];
    /**
        * The log level currently used internally in this api facade. Initially this is set to show errors and
        * warnings until a logEvent (>=0.5) changes this when initializing the extension or when the user
        * changes the log level. Available in the API for testing only - do not use this in normal applications.
        */
    export let logLevel: number;
    /**
        * The JavaScript library must be initialized using this function. It returns a promise that
        * resolves when initialization is complete.
        */
    export function init(): Promise<void>;
    /**
        * De-initialize the api after use. Not normally used as api will normally
        * stay in use thoughout an application - mostly of interest for testing.
        */
    export function shutdown(): Promise<void>;
    /**
        * Internal helper that returns an array of valid event keys that correspond to the event specificator
        * and are known to exist in our event listener map.
        */
    export function _getEvents(nameSpec: string | RegExp | Array<string | RegExp>): ReadonlyArray<string>;
    /**
        * Hook up listener call back to specified event(s) as specified by initial name specification argument nameSpec.
        * When the nameSpec argument is a string, this correspond to a single named event. When the argument is a regular
        * expression all lister subscribes to all matching events. If the argument is an array it recursively subscribes
        * to all events specified in the array.
        */
    export function addEventListener(nameSpec: AttachedDeattachedEventName, callback: (event: DeviceInfo) => void): void;
    export function addEventListener(nameSpec: "devlog", callback: (event: DevLogEvent) => void): void;
    export function addEventListener(nameSpec: ButtonEventName, callback: (event: ButtonEvent) => void): void;
    export function addEventListener(nameSpec: UntypedEventName, callback: (event: Event) => void): void;
    export function addEventListener(nameSpec: EventName | RegExp | Array<EventName | RegExp>, callback: EventCallback): void;
    /**
        * Remove existing listener to specified event(s). The callback must correspond to the exact callback provided
        * to a previous addEventListener.
        */
    export function removeEventListener(nameSpec: AttachedDeattachedEventName, callback: (event: DeviceInfo) => void): void;
    export function removeEventListener(nameSpec: "devlog", callback: (event: DevLogEvent) => void): void;
    export function removeEventListener(nameSpec: ButtonEventName, callback: (event: ButtonEvent) => void): void;
    export function removeEventListener(nameSpec: UntypedEventName, callback: (event: Event) => void): void;
    export function removeEventListener(nameSpec: EventName | RegExp | Array<EventName | RegExp>, callback: EventCallback): void;
    /**
        * Activate ringer (if supported) on the Jabra Device
        */
    export function ring(): void;
    /**
        * Change state to in-a-call.
        */
    export function offHook(): void;
    /**
        * Change state to idle (not-in-a-call).
        */
    export function onHook(): void;
    /**
        * Mutes the microphone (if supported).
        */
    export function mute(): void;
    /**
        * Unmutes the microphone (if supported).
        */
    export function unmute(): void;
    /**
        * Change state to held (if supported).
        */
    export function hold(): void;
    /**
        * Change state from held to OffHook (if supported).
        */
    export function resume(): void;
    /**
        * Capture/release buttons for customization (if supported). This turns off default behavior and enables mmi events to
        * be received instead. It also allows for mmi actions to be applied like changing lights with setRemoteMmiLightAction.
        *
        * @param type The button that should be captured/released.
        * @param capture True if button should be captured, false if it should be released.
        *
        * @returns A promise that is resolved once operation completes.
        */
    export function setMmiFocus(type: RemoteMmiType, capture: boolean): Promise<void>;
    /**
        * Change light/color on a previously captured button.
        * Nb. This requires the button to be previously captured though setMMiFocus.
        *
        * @param type The button that should be captured/released.
        * @param color An RGB array of 3x integers or a RGB number (with 0x or # prefix for hex).
        * @param effect What effect to apply to the button.
        *
        * @returns A promise that is resolved once operation completes.
        */
    export function setRemoteMmiLightAction(type: RemoteMmiType, color: ColorType | number, effect: RemoteMmiSequence): Promise<void>;
    /**
        * Get detailed information about the current active Jabra Device, including current status
        * and optionally also including related browser media device information.
        *
        * Note that browser media device information requires mediaDevices.getUserMedia or
        * getUserDeviceMediaExt to have been called so permissions are granted. Browser media information
        * is useful for setting a device constraint on mediaDevices.getUserMedia for input or for calling
        * setSinkId (when supported by the browser) to set output.
        */
    export function getActiveDevice(includeBrowserMediaDeviceInfo?: boolean): Promise<DeviceInfo>;
    /**
        * List detailed information about all attached Jabra Devices, including current status.
        * and optionally also including related browser media device information.
        *
        * Note that browser media device information requires mediaDevices.getUserMedia or
        * getUserDeviceMediaExt to have been called so permissions are granted. Browser media information
        * is useful for setting a device constraint on mediaDevices.getUserMedia for input or for calling
        * setSinkId (when supported by the browser) to set output.
        */
    export function getDevices(includeBrowserMediaDeviceInfo?: boolean): Promise<ReadonlyArray<DeviceInfo>>;
    /**
        * Internal utility that select a new active device in a backwards compatible way that works with earlier chrome host.
        * Used internally by test tool - do not use otherwise.
        *
        * Note: The active device is a global setting that affects all browser
        * instances using the browser SDK. Unless changed specifically, the setting
        * persist until browser is restarted or device is unplugged.
        *
        * @deprecated Use setActiveDeviceId instead.
        */
    export function _setActiveDeviceId(id: number): void;
    /**
        * Select a new active device returning once selection is completed.
        *
        * Note: The active device is a global setting that affects all browser
        * instances using the browser SDK. Unless changed specifically, the setting
        * persist until browser is restarted or device is unplugged.
        *
        * @param id The id number of the new active device.
        * @returns A promise that is resolved once selection completes.
        *
        */
    export function setActiveDeviceId(id: number): Promise<void>;
    /**
        * Set busylight on active device (if supported)
        *
        * @param busy True if busy light should be set, false if it should be cleared.
        */
    export function setBusyLight(busy: boolean): Promise<void>;
    /**
        * Get version number information for all components.
        */
    export function getInstallInfo(): Promise<InstallInfo>;
    /**
        * Configure an audio html element on a webpage to use jabra audio device as speaker output. Returns a promise with boolean success status.
        * The deviceInfo argument must come from getDeviceInfo or getUserDeviceMediaExt calls.
        */
    export function trySetDeviceOutput(audioElement: HTMLMediaElement, deviceInfo: DeviceInfo): Promise<boolean>;
    /**
        * Checks if a Jabra Input device is in fact selected in a media stream.
        * The deviceInfo argument must come from getDeviceInfo or getUserDeviceMediaExt calls.
        */
    export function isDeviceSelectedForInput(mediaStream: MediaStream, deviceInfo: DeviceInfo): boolean;
    /**
        * Replacement for mediaDevices.getUserMedia that makes a best effort to select the active Jabra audio device
        * to be used for the microphone. Unlike getUserMedia this method returns a promise that
        * resolve to an object containing both a stream and the device info for the selected device.
        *
        * Optional, additional non-audio constrains (like f.x. video) can be specified as well.
        *
        * Note: Subsequently, if this method appears to succeed use the isDeviceSelectedForInput function to check
        * if the browser did in fact choose a Jabra device for the microphone.
        */
    export function getUserDeviceMediaExt(constraints?: MediaStreamConstraints): Promise<MediaStreamAndDeviceInfoPair>;
}

declare module '@gnaudio/jabra-browser-integration/meta' {
    /**
        * Base interface for containing common meta-data for
        * reflective access to API classes, properties,
        * methods, constructors etc.
        */
    export interface SymbolEntry {
            comment?: string;
            name: string;
            documentation: string;
            tsType: string;
            jsType?: string;
    }
    /**
        * Meta-data for reflective access to API classes.
        */
    export interface ClassEntry extends SymbolEntry {
            methods: MethodEntry[];
            properties: PropertyEntry[];
    }
    /**
        * Meta-data for reflective access to API class properties.
        */
    export interface PropertyEntry extends SymbolEntry {
            readonly: boolean;
    }
    /**
        * Meta-data for reflective access to API class methods.
        */
    export interface MethodEntry extends SymbolEntry {
            parameters: ParameterEntry[];
    }
    /**
        * Meta-data for reflective access to API method parameters.
        */
    export interface ParameterEntry extends SymbolEntry {
            optional: boolean;
    }
    /**
        * The meta API that classes with meta information shold support.
        */
    export interface MetaApi {
            getMeta(): ClassEntry;
    }
}

declare module '@gnaudio/jabra-browser-integration/Analytics' {
    export { Analytics } from "@gnaudio/jabra-browser-integration/Analytics/Analytics";
}

declare module '@gnaudio/jabra-browser-integration/Analytics/Analytics' {
    import { EventEmitter } from "@gnaudio/jabra-browser-integration/EventEmitter";
    import { AnalyticsEvent } from "@gnaudio/jabra-browser-integration/Analytics/AnalyticsEvent";
    export type SpeechStatus = {
            isSilent: boolean;
            isCrosstalking: boolean;
            isTXSpeaking: boolean;
            isRXSpeaking: boolean;
    };
    export type SpeechTime = {
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
    /**
        * The Analytics will collect AnalyticsEvents and allow you to query data such
        * as speech status, speech time, and much more. To use the class, initialize an
        * instance of the class and use the start method to start collecting. The class
        * is an event emitter, so you can use addEventListener to listen to specific
        * AnalyticEvents. If you have multiple jabra devices connected and only want to
        * collect events from one of the devices supply a deviceID in the class
        * constructor.
        *
        * @export
        * @class Analytics
        * @extends {EventEmitter}
        */
    export class Analytics extends EventEmitter {
            /**
                * The timestamp of when analytics was started
                *
                * @type {(number | undefined)}
                * @memberof Analytics
                */
            startTime: number | undefined;
            /**
                * The timestamp of when the analytics was stopped
                *
                * @type {(number | undefined)}
                * @memberof Analytics
                */
            stopTime: number | undefined;
            /**
                * Creates an instance of Analytics. Supply a deviceID to only collect
                * analytics from that specific device.
                *
                * @param {(number | null)} [deviceID=null]
                * @memberof Analytics
                */
            constructor(deviceID?: number | null);
            /**
                * Starts the analytics module
                *
                * @memberof Analytics
                */
            start(): void;
            /**
                * Stops the analytics module
                *
                * @memberof Analytics
                */
            stop(): void;
            /**
                * Clears the event history of the analytics module
                *
                * @memberof Analytics
                */
            clear(): void;
            /**
                * Get whether the transmitter or receiver is talking, and whether there's
                * crosstalk or silence
                *
                * @returns {SpeechStatus}
                * @memberof Analytics
                */
            getSpeechStatus(): SpeechStatus;
            /**
                * Get time the transmitter or reciver has talked, and how long there's
                * been crosstalk or silence
                *
                * @param {number} [fromTime]
                * @param {number} [toTime]
                * @returns {SpeechTime}
                * @memberof Analytics
                */
            getSpeechTime(fromTime?: number, toTime?: number): SpeechTime;
            /**
                * Get whether or not the headset is muted
                *
                * @returns {boolean} - muted status
                * @memberof Analytics
                */
            getMutedStatus(): boolean;
            /**
                * Get the number of times the headset has been muted
                *
                * @returns {number} - muted count
                * @memberof Analytics
                */
            getMutedCount(): number;
            /**
                * Get the boom arm position status
                *
                * @returns {(boolean | undefined)}
                * @memberof Analytics
                */
            getBoomArmStatus(): boolean | undefined;
            /**
                * Get the number of times the boom arm has been misaligned
                *
                * @returns {number}
                * @memberof Analytics
                */
            getBoomArmMisalignedCount(): number;
            /**
                * Get the number of times the volume has been increased
                *
                * @returns {number}
                * @memberof Analytics
                */
            getVolumeUpCount(): number;
            /**
                * Get the number of times the volume has been decreased
                *
                * @returns {number}
                * @memberof Analytics
                */
            getVolumeDownCount(): number;
            /**
                * Get the audio exposure level
                *
                * @returns {number}
                * @memberof Analytics
                */
            getAudioExposure(limit?: number): AnalyticsEvent[];
            /**
                * Get the average audio exposure level over a time interval
                *
                * @returns {number}
                * @memberof Analytics
                */
            getAverageAudioExposure(fromTime?: number, toTime?: number): number;
            /**
                * Get the average background noise level
                *
                * @returns {number}
                * @memberof Analytics
                */
            getBackgroundNoise(limit?: number): AnalyticsEvent[];
            /**
                * Get the average background noise level over a time interval
                *
                * @returns {number}
                * @memberof Analytics
                */
            getAverageBackgroundNoise(fromTime?: number, toTime?: number): number;
    }
}

declare module '@gnaudio/jabra-browser-integration/EventEmitter' {
    export * from "@gnaudio/jabra-browser-integration/EventEmitter/EventEmitter";
}

declare module '@gnaudio/jabra-browser-integration/Analytics/AnalyticsEvent' {
    import * as Jabra from "@gnaudio/jabra-browser-integration/core";
    export type JabraEventType = "Speech_Analysis_TX" | "Speech_Analysis_RX" | "TX Acoustic Logging Level" | "RX Acoustic Logging Level" | "TX Acoustic Logging Peak" | "RX Acoustic Logging Peak" | "Boom Position Guidance OK" | "Bad_Mic_detect Flag" | "Mute State";
    export type AnalyticsEventType = "txspeech" | "rxspeech" | "txacousticlevel" | "rxacousticlevel" | "txacousticpeak" | "rxacousticpeak" | "armpositionok" | "badmic" | "mute";
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
            readonly type: string;
            /**
                * The value of the analytics event
                *
                * @type {*}
                * @memberof AnalyticsEvent
                */
            readonly value: any;
            /**
                * The epoch time of the analytics event occured
                *
                * @type {number}
                * @memberof AnalyticsEvent
                */
            readonly timestamp: number;
            constructor(type: string, value: any, timestamp?: number);
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
    export function createAnalyticsEvent(event: Jabra.DevLogEvent): AnalyticsEvent | null;
}

declare module '@gnaudio/jabra-browser-integration/EventEmitter/EventEmitter' {
    export type EventEmitterListener<V> = (value: V) => void;
    export class EventEmitter<T = string, V = any> {
            /**
                * A map of event listeners
                *
                * @memberof EventEmitter
                */
            listeners: Map<T, EventEmitterListener<V>[]>;
            /**
                * Add a function to be called when a specific type of event is emitted.
                *
                * @param {T} type
                * @param {EventEmitterListener<V>} listener
                * @memberof EventEmitter
                */
            addEventListener(type: T, listener: EventEmitterListener<V>): void;
            /**
                * Add a function to be called when a specific type of event is emitted.
                *
                * @param {T} type
                * @param {EventEmitterListener<V>} listener
                * @memberof EventEmitter
                */
            on(type: T, listener: EventEmitterListener<V>): void;
            /**
                * Remove an event listener that was previously added.
                *
                * @param {T} type
                * @param {EventEmitterListener<V>} listener
                * @memberof EventEmitter
                */
            removeEventListener(type: T, listener: EventEmitterListener<V>): void;
            /**
                * Remove an event listener that was previously added.
                *
                * @param {T} type
                * @param {EventEmitterListener<V>} listener
                * @memberof EventEmitter
                */
            off(type: T, listener: EventEmitterListener<V>): void;
            /**
                * Emit an event of specific type, and supply what value to pass to the
                * listener.
                *
                * @param {T} type
                * @param {V} event
                * @returns
                * @memberof EventEmitter
                */
            emit(type: T, value: V): void;
    }
}

