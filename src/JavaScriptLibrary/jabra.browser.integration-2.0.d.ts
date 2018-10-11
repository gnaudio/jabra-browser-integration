/**
* The global jabra object is your entry for the jabra browser SDK.
*/
declare namespace jabra {
    /**
     * Version of this javascript api (should match version number in file apart from possible alfa/beta designator).
     */
    const apiVersion = "2.0.beta3";
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
         * The browser's unique identifier for the input (e.g. microphone) part of the Jabra device (page orgin specific).
         * Only available when calling getDevices/getActiveDevice with includeBrowserMediaDeviceInfo argument set to true.
         */
        browserAudioInputId?: string;
        /**
        * The browser's unique identifier for an output (e.g. speaker) part of the Jabra device (page orgin specific).
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
     * A combination of a media stream and information of the assoicated device from the view of the browser.
     */
    interface MediaStreamAndDeviceInfoPair {
        stream: MediaStream;
        deviceInfo: DeviceInfo;
    }
    /**
     * All possible device events as discriminative  union.
     */
    type EventName = "mute" | "unmute" | "device attached" | "device detached" | "acceptcall" | "endcall" | "reject" | "flash" | "online" | "offline" | "linebusy" | "lineidle" | "redial" | "key0" | "key1" | "key2" | "key3" | "key4" | "key5" | "key6" | "key7" | "key8" | "key9" | "keyStar" | "keyPound" | "keyClear" | "Online" | "speedDial" | "voiceMail" | "LineBusy" | "outOfRange" | "intoRange" | "pseudoAcceptcall" | "pseudoEndcall" | "button1" | "button2" | "button3" | "volumeUp" | "volumeDown" | "fireAlarm" | "jackConnection" | "jackDisConnection" | "qdConnection" | "qdDisconnection" | "headsetConnection" | "headsetDisConnection" | "devlog" | "busylight" | "hearThrough" | "batteryStatus" | "gnpButton" | "mmi" | "error";
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
     * Device feature codes.
     */
    enum DeviceFeature {
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
    enum RemoteMmiType {
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
        MMI_TYPE_ALL = 255
    }
    /**
     * A MMI efffect specification for light on, off or blinking in different tempo.
     */
    enum RemoteMmiSequence {
        MMI_LED_SEQUENCE_OFF = 0,
        MMI_LED_SEQUENCE_ON = 1,
        MMI_LED_SEQUENCE_SLOW = 2,
        MMI_LED_SEQUENCE_FAST = 3
    }
    /**
     * A 3 x 8 bit set of RGB colors. Numbers can be between 0-255.
     */
    type ColorType = [number, number, number];
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
    function shutdown(): Promise<void>;
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
    * Capture/release buttons for customization (if supported). This turns off default behavior and enables mmi events to
    * be received instead. It also allows for mmi actions to be applied like changing lights with setRemoteMmiLightAction.
    *
    * @param type The button that should be captured/released.
    * @param capture True if button should be captured, false if it should be released.
    *
    * @returns A promise that is resolved once operation completes.
    */
    function setMmiFocus(type: RemoteMmiType | string, capture: boolean | string): Promise<void>;
    /**
    * Change light/color on a previously captured button.
    * Nb. This requires the button to be previously captured though setMMiFocus.
    *
    * @param type The button that should be captured/released.
    * @param color An RGB array of 3 8 bit integers or a RGB hex string (without prefix).
    * @param effect What effect to apply to the button.
    *
    * @returns A promise that is resolved once operation completes.
    */
    function setRemoteMmiLightAction(type: RemoteMmiType | string, color: ColorType | string, effect: RemoteMmiSequence | string): Promise<void>;
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
    * Internal utility that select a new active device in a backwards compatible way that works with earlier chrome host.
    * Used internally by test tool - do not use otherwise.
    *
    * @deprecated Use setActiveDeviceId instead.
    */
    function _setActiveDeviceId_deprecated(id: number | string): void;
    /**
    * Select a new active device returning once selection is completed.
    *
    * @param id The id number of the new active device.
    * @returns A promise that is resolved once selection completes.
    *
    */
    function setActiveDeviceId(id: number | string): Promise<void>;
    /**
    * Set busylight on active device (if supported)
    *
    * @param busy True if busy light should be set, false if it should be cleared.
    */
    function setBusyLight(busy: boolean | string): Promise<void>;
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
    function getUserDeviceMediaExt(constraints?: MediaStreamConstraints): Promise<MediaStreamAndDeviceInfoPair>;
}
