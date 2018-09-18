/**
* The global jabra object is your entry for the jabra browser SDK.
*/
declare namespace jabra {
    /**
     * Version of this javascript api (should match version number in file apart from possible alfa/beta designator).
     */
    const apiVersion = "2.0.beta2";
    /**
     * Contains information about installed components.
     */
    interface InstallInfo {
        installationOk: boolean;
        version_chromehost: string;
        version_nativesdk: string;
        version_browserextension: string;
        version_jsapi: string;
        browserextension_id: string;
        browserextension_type: string;
    }
    interface DeviceInfo {
        deviceID: number;
        deviceName: string;
        deviceConnection: number;
        errStatus: number;
        isBTPaired?: boolean;
        isInFirmwareUpdateMode: boolean;
        parentInstanceId?: string;
        productID: number;
        serialNumber?: string;
        usbDevicePath?: string;
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
    }
    /**
     * Contains information about a jabra device.
     */
    interface BrowserDeviceInfo {
        groupId: string | null;
        audioInputId: string | null;
        audioOutputId: string | null;
        label: string | null;
    }
    /**
     * A combination of a media stream and the assoicated device.
     */
    interface MediaStreamAndDevicePair {
        stream: MediaStream;
        deviceInfo: BrowserDeviceInfo;
    }
    /**
     * All possible device events as discriminative  union.
     */
    type EventName = "mute" | "unmute" | "device attached" | "device detached" | "acceptcall" | "endcall" | "reject" | "flash" | "online" | "offline" | "redial" | "key0" | "key1" | "key2" | "key3" | "key4" | "key5" | "key6" | "key7" | "key8" | "key9" | "keyStar" | "keyPound" | "keyClear" | "Online" | "speedDial" | "voiceMail" | "LineBusy" | "outOfRange" | "pseudoOffHook" | "button1" | "button2" | "button3" | "volumeUp" | "volumeDown" | "fireAlarm" | "jackConnection" | "qdConnection" | "headsetConnection" | "devlog" | "busylight" | "hearThrough" | "batteryStatus" | "error";
    /**
     * Event type for call backs.
     */
    interface Event {
        name: string;
        data: {
            deviceID: number;
        };
    }
    type ClientError = any | {
        error: string;
    };
    type ClientMessage = any | {
        message: string;
    };
    /**
     * Type for event callback functions..
     */
    type EventCallback = (event: Event) => void;
    /**
     * The log level curently used internally in this api facade. Initially this is set to show errors and
     * warnings until a logEvent (>=0.5) changes this when initializing the extension or when the user
     * changes the log level. Available in the API for testing only - do not use this in normal applications.
     */
    let logLevel: number;
    /**
     * The JavaScript library must be initialized using this function. It returns a promise that
     * resolves when initialization is complete.
    */
    function init(): Promise<void>;
    /**
    * De-initialize the api after use. Not normally used as api will normally
    * stay in use thoughout an application - mostly of interest for testing.
    */
    function shutdown(): boolean;
    /**
     * Hook up listener call back to specified event(s) as specified by initial name specification argument nameSpec.
     * When the nameSpec argument is a string, this correspond to a single named event. When the argument is a regular
     * expression all lister subscribes to all matching events. If the argument is an array it recursively subscribes
     * to all events specified in the array.
     */
    function addEventListener(nameSpec: string | RegExp | Array<string | RegExp>, callback: EventCallback): void;
    /**
     * Remove existing listener to specified event(s). The callback must correspond to the exact callback provided
     * to a previous addEventListener.
     */
    function removeEventListener(nameSpec: string | RegExp | Array<string | RegExp>, callback: EventCallback): void;
    /**
    * Activate ringer (if supported) on the Jabra Device
    */
    function ring(): void;
    /**
    * Change state to in-a-call.
    */
    function offHook(): void;
    /**
    * Change state to idle (not-in-a-call).
    */
    function onHook(): void;
    /**
    * Mutes the microphone (if supported).
    */
    function mute(): void;
    /**
    * Unmutes the microphone (if supported).
    */
    function unmute(): void;
    /**
    * Change state to held (if supported).
    */
    function hold(): void;
    /**
    * Change state from held to OffHook (if supported).
    */
    function resume(): void;
    /**
    * Get detailed information about the current active Jabra Device, including current status.
    */
    function getActiveDevice(): Promise<DeviceInfo>;
    /**
    * List detailed information about all attached Jabra Devices, including current status.
    */
    function getDevices(): Promise<ReadonlyArray<DeviceInfo>>;
    /**
    * Select a new active device.
    */
    function setActiveDeviceId(id: number | string): void;
    /**
    * Set busylight on active device (if supported)
    */
    function setBusyLight(busy: boolean | string): void;
    /**
    * Get version number information for all components.
    */
    function getInstallInfo(): Promise<InstallInfo>;
    /**
    * Configure a <audio> html element on a webpage to use jabra audio device as speaker output. Returns a promise with boolean success status.
    * The deviceInfo argument must come from getDeviceInfo or getUserDeviceMediaExt calls.
    */
    function trySetDeviceOutput(audioElement: HTMLMediaElement, deviceInfo: BrowserDeviceInfo): Promise<boolean>;
    /**
     * Checks if a Jabra Input device is in fact selected in a media stream.
     * The deviceInfo argument must come from getDeviceInfo or getUserDeviceMediaExt calls.
     */
    function isDeviceSelectedForInput(mediaStream: MediaStream, deviceInfo: BrowserDeviceInfo): boolean;
    /**
    * Replacement for mediaDevices.getUserMedia that makes a best effort to select a Jabra audio device
    * to be used for the microphone. Unlike getUserMedia this method returns a promise that
    * resolve to a object containing both a stream and the device info for the selected device.
    *
    * Optional, additional non-audio constrains (like f.x. video) can be specified as well.
    *
    * Note: Subsequetly, if this method appears to succed use the isDeviceSelectedForInput function to check
    * if the browser did in fact choose a Jabra device for the microphone.
    */
    function getUserDeviceMediaExt(additionalConstraints: MediaStreamConstraints): Promise<MediaStreamAndDevicePair>;
    /**
     * Returns a promise resolving to all known IDs for (first found) Jabra device valid for the current
     * browser session (assuming mediaDevices.getUserMedia has been called so permissions are granted). For
     * supported browsers, like Chrome this include IDs for both microphone and speaker on a single device.
     * Useful for setting a device constraint on mediaDevices.getUserMedia for input or for calling
     * setSinkId (when supported by the browser) to set output. Called internally by getUserDeviceMedia
     * replacement for mediaDevices.getUserMedia.
     *
     * Chrome note:
     * 1) Only works if hosted under https.
     *
     * Firefox note:
     * 1) Output devices not supported yet. See "https://bugzilla.mozilla.org/show_bug.cgi?id=934425"
     * 2) The user must have provided permission to use the specific device to use it as a constraint.
     * 3) GroupId not supported.
     *
     * General non-chrome browser note:
     * 1) Returning output devices requires support for new Audio Output Devices API.
     */
    function getFirstDeviceInfo(): Promise<BrowserDeviceInfo>;
}
