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
    /**
     * Contains information about a device
     */
    interface DeviceInfo {
        deviceID: number;
        deviceName: string;
        deviceConnection: number;
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
        browserGroupId?: string;
        browserAudioInputId?: string;
        browserAudioOutputId?: string;
        browserLabel?: string;
    }
    /**
     * A combination of a media stream and information of the assoicated device from the view of the browser.
     */
    interface MediaStreamAndDeviceInfoPair {
        stream: MediaStream;
        deviceInfo: DeviceInfo;
    }
    /**
     * All possible device events as discriminative  union.
     */
    type EventName = "mute" | "unmute" | "device attached" | "device detached" | "acceptcall" | "endcall" | "reject" | "flash" | "online" | "offline" | "linebusy" | "lineidle" | "redial" | "key0" | "key1" | "key2" | "key3" | "key4" | "key5" | "key6" | "key7" | "key8" | "key9" | "keyStar" | "keyPound" | "keyClear" | "Online" | "speedDial" | "voiceMail" | "LineBusy" | "outOfRange" | "intoRange" | "pseudoAcceptcall" | "pseudoEndcall" | "button1" | "button2" | "button3" | "volumeUp" | "volumeDown" | "fireAlarm" | "jackConnection" | "jackDisConnection" | "qdConnection" | "qdDisconnection" | "headsetConnection" | "headsetDisConnection" | "devlog" | "busylight" | "hearThrough" | "batteryStatus" | "error";
    /**
     * Event type for call backs.
     */
    interface Event {
        name: string;
        data: {
            deviceID: number;
        };
    }
    /**
     * The format of errors returned.
     */
    type ClientError = any | {
        error: string;
    };
    /**
    * The format of messages returned.
    */
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
    * Get detailed information about the current active Jabra Device, including current status
    * and optionally also including related browser media device information.
    *
    * Note that browser media device information requires mediaDevices.getUserMedia or
    * getUserDeviceMediaExt to have been called so permissions are granted. Browser media information
    * is useful for setting a device constraint on mediaDevices.getUserMedia for input or for calling
    * setSinkId (when supported by the browser) to set output.
    */
    function getActiveDevice(includeBrowserMediaDeviceInfo?: boolean | string): Promise<DeviceInfo>;
    /**
    * List detailed information about all attached Jabra Devices, including current status.
    * and optionally also including related browser media device information.
    *
    * Note that browser media device information requires mediaDevices.getUserMedia or
    * getUserDeviceMediaExt to have been called so permissions are granted. Browser media information
    * is useful for setting a device constraint on mediaDevices.getUserMedia for input or for calling
    * setSinkId (when supported by the browser) to set output.
    */
    function getDevices(includeBrowserMediaDeviceInfo?: boolean | string): Promise<ReadonlyArray<DeviceInfo>>;
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
    function trySetDeviceOutput(audioElement: HTMLMediaElement, deviceInfo: DeviceInfo): Promise<boolean>;
    /**
     * Checks if a Jabra Input device is in fact selected in a media stream.
     * The deviceInfo argument must come from getDeviceInfo or getUserDeviceMediaExt calls.
     */
    function isDeviceSelectedForInput(mediaStream: MediaStream, deviceInfo: DeviceInfo): boolean;
    /**
    * Replacement for mediaDevices.getUserMedia that makes a best effort to select the active Jabra audio device
    * to be used for the microphone. Unlike getUserMedia this method returns a promise that
    * resolve to a object containing both a stream and the device info for the selected device.
    *
    * Optional, additional non-audio constrains (like f.x. video) can be specified as well.
    *
    * Note: Subsequetly, if this method appears to succed use the isDeviceSelectedForInput function to check
    * if the browser did in fact choose a Jabra device for the microphone.
    */
    function getUserDeviceMediaExt(additionalConstraints: MediaStreamConstraints): Promise<MediaStreamAndDeviceInfoPair>;
}
