/**
* The global jabra object is your entry for the jabra browser SDK.
*/
declare namespace jabra {
    /**
     * Version of this javascript api (should match version number in file apart from possible alfa/beta designator).
     */
    const apiVersion = "2.0.1";
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
    interface MediaStreamAndDeviceInfoPair {
        stream: MediaStream;
        deviceInfo: DeviceInfo;
    }
    /**
     * All possible device events as discriminative  union.
     */
    type EventName = "mute" | "unmute" | "device attached" | "device detached" | "acceptcall" | "endcall" | "reject" | "flash" | "online" | "offline" | "linebusy" | "lineidle" | "redial" | "key0" | "key1" | "key2" | "key3" | "key4" | "key5" | "key6" | "key7" | "key8" | "key9" | "keyStar" | "keyPound" | "keyClear" | "Online" | "speedDial" | "voiceMail" | "LineBusy" | "outOfRange" | "intoRange" | "pseudoAcceptcall" | "pseudoEndcall" | "button1" | "button2" | "button3" | "volumeUp" | "volumeDown" | "fireAlarm" | "jackConnection" | "jackDisConnection" | "qdConnection" | "qdDisconnection" | "headsetConnection" | "headsetDisConnection" | "devlog" | "busylight" | "hearThrough" | "batteryStatus" | "gnpButton" | "mmi" | "error";
    /**
     * Error status codes returned by SDK. Same as Jabra_ErrorStatus in native SDK.
     */
    enum ErrorCodes {
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
    enum ErrorReturnCodes {
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
    class CommandError extends Error {
        command: string;
        errmessage: string;
        data: any;
        constructor(command: string, errmessage: string, data?: string);
    }
    /**
     * Event type for call backs.
     */
    interface Event {
        message: string;
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
     * A MMI effect specification for light on, off or blinking in different tempo.
     */
    enum RemoteMmiSequence {
        MMI_LED_SEQUENCE_OFF = 0,
        MMI_LED_SEQUENCE_ON = 1,
        MMI_LED_SEQUENCE_SLOW = 2,
        MMI_LED_SEQUENCE_FAST = 3
    }
    /**
     * MMI button actions reported when button has focus.
     */
    enum RemoteMmiActionInput {
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
    type ColorType = [number, number, number];
    /**
     * The log level currently used internally in this api facade. Initially this is set to show errors and
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
    * @param color An RGB array of 3x integers or a RGB number (with 0x or # prefix for hex).
    * @param effect What effect to apply to the button.
    *
    * @returns A promise that is resolved once operation completes.
    */
    function setRemoteMmiLightAction(type: RemoteMmiType | string, color: ColorType | string | number, effect: RemoteMmiSequence | string): Promise<void>;
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
    * Note: The active device is a global setting that affects all browser
    * instances using the browser SDK. Unless changed specifically, the setting
    * persist until browser is restarted or device is unplugged.
    *
    * @deprecated Use setActiveDeviceId instead.
    */
    function _setActiveDeviceId(id: number | string): void;
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
    * Configure an audio html element on a webpage to use jabra audio device as speaker output. Returns a promise with boolean success status.
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
    * resolve to an object containing both a stream and the device info for the selected device.
    *
    * Optional, additional non-audio constrains (like f.x. video) can be specified as well.
    *
    * Note: Subsequently, if this method appears to succeed use the isDeviceSelectedForInput function to check
    * if the browser did in fact choose a Jabra device for the microphone.
    */
    function getUserDeviceMediaExt(constraints?: MediaStreamConstraints): Promise<MediaStreamAndDeviceInfoPair>;
}
