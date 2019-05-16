/*
Jabra Browser Integration
https://github.com/gnaudio/jabra-browser-integration

MIT License

Copyright (c) 2017 GN Audio A/S (Jabra)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
* The global jabra object is your entry for the jabra browser SDK.
*/
namespace jabra {
    /**
     * Version of this javascript api (should match version number in file apart from possible alfa/beta designator).
     */
    export const apiVersion = "2.0.1";

    /**
     * Is the current version a beta ?
     */
    const isBeta = apiVersion.includes("beta");

    /**
     * Id of proper (production) release of browser plugin.
     */
    const prodExtensionId = "okpeabepajdgiepelmhkfhkjlhhmofma";

     /**
     * Id of beta release of browser plugin.
     */
    const betaExtensionId = "igcbbdnhomedfadljgcmcfpdcoonihfe";

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
    };

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
        serialNumber?: string,
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
    };

    /**
     * A combination of a media stream and information of the associated device from the view of the browser.
     */
    export interface MediaStreamAndDeviceInfoPair {
        stream: MediaStream;
        deviceInfo: DeviceInfo
    };

    /**
     * Names of command response events.
     */
    const commandEventsList = [
        "devices",
        "activedevice",
        "getinstallinfo",
        "Version",
        "setmmifocus",
        "setactivedevice2",
        "setbusylight",
        "setremotemmilightaction"
    ];

    /**
     * All possible device events as discriminative  union.
     */
    export type EventName = "mute" | "unmute" | "device attached" | "device detached" | "acceptcall"
                            | "endcall" | "reject" | "flash" | "online" | "offline" | "linebusy" | "lineidle"
                            | "redial" | "key0" | "key1" | "key2" | "key3" | "key4" | "key5"
                            | "key6" | "key7" | "key8" | "key9" | "keyStar" | "keyPound"
                            | "keyClear" | "Online" | "speedDial" | "voiceMail" | "LineBusy"
                            | "outOfRange" | "intoRange" | "pseudoAcceptcall" | "pseudoEndcall" 
                            | "button1" | "button2" | "button3" | "volumeUp" | "volumeDown" | "fireAlarm"
                            | "jackConnection" | "jackDisConnection" | "qdConnection" | "qdDisconnection"
                            | "headsetConnection" | "headsetDisConnection" | "devlog" | "busylight" 
                            | "hearThrough" | "batteryStatus" | "gnpButton" | "mmi" | "error";

    /**
     * All possible device events as internal array.
     */
    let eventNamesList: ReadonlyArray<EventName>
                       = [  "mute", "unmute", "device attached", "device detached", "acceptcall",
                            "endcall", "reject", "flash", "online", "offline", "linebusy", "lineidle",
                            "redial", "key0", "key1", "key2", "key3", "key4", "key5",
                            "key6", "key7", "key8", "key9", "keyStar", "keyPound",
                            "keyClear", "Online", "speedDial", "voiceMail", "LineBusy",
                            "outOfRange", "intoRange", "pseudoAcceptcall", "pseudoEndcall",
                            "button1", "button2", "button3", "volumeUp", "volumeDown", "fireAlarm",
                            "jackConnection", "jackDisConnection", "qdConnection", "qdDisconnection", 
                            "headsetConnection","headsetDisConnection", "devlog", "busylight", 
                            "hearThrough", "batteryStatus", "gnpButton", "mmi", "error" ];

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
    };

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
    };

    /**
     * Custom error returned by commands expecting results when failing.
     */
    export class CommandError extends Error {
        command: string;
        errmessage: string;
        data: any;

        constructor(command: string, errmessage: string, data?: string) {
            super("Command " + command +" failed with error  message " + errmessage + " and details: " + JSON.stringify(data || {}));
            this.command = command;
            this.errmessage = errmessage;
            this.data = data;
            this.name = 'CommandError';
        }
    };


    /**
     * Internal helper that stores information about the promise to resolve/reject
     * for a command being processed.
     */
    interface PromiseCallbacks {
        cmd: string,
        resolve: (value?: any | PromiseLike<any> | undefined) => void;
        reject: (err: Error) => void;
    }

    /**
     * Event type for call backs.
     */
    export interface Event {
        message: string;
        data: {
            deviceID: number;
            /* variable */
        };
    };

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
    export declare type EventCallback = (event: Event) => void;

    /**
     * Internal mapping from all known events to array of registered callbacks. All possible events are setup
     * initially. Callbacks values are configured at runtime.
     */
    const eventListeners: Map<EventName, Array<EventCallback>> = new Map<EventName, Array<EventCallback>>();
    eventNamesList.forEach((event: EventName) => eventListeners.set(event, []));
     
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
        PlayRingtone=1017
    };

    /**
     * A specification of a button for MMI capturing.
     */
    export enum RemoteMmiType {
        MMI_TYPE_MFB       = 0,
        MMI_TYPE_VOLUP     = 1,
        MMI_TYPE_VOLDOWN   = 2,
        MMI_TYPE_VCB       = 3,
        MMI_TYPE_APP       = 4,
        MMI_TYPE_TR_FORW   = 5,
        MMI_TYPE_TR_BACK   = 6,
        MMI_TYPE_PLAY      = 7,
        MMI_TYPE_MUTE      = 8,
        MMI_TYPE_HOOK_OFF  = 9,
        MMI_TYPE_HOOK_ON   = 10,
        MMI_TYPE_BLUETOOTH = 11,
        MMI_TYPE_JABRA     = 12,
        MMI_TYPE_BATTERY   = 13,
        MMI_TYPE_PROG      = 14,
        MMI_TYPE_LINK      = 15,
        MMI_TYPE_ANC       = 16,
        MMI_TYPE_LISTEN_IN = 17,
        MMI_TYPE_DOT3      = 18,
        MMI_TYPE_DOT4      = 19,
        MMI_TYPE_ALL       = 255
    };

    /**
     * A MMI effect specification for light on, off or blinking in different tempo.
     */
    export enum RemoteMmiSequence {
        MMI_LED_SEQUENCE_OFF     = 0,
        MMI_LED_SEQUENCE_ON      = 1,
        MMI_LED_SEQUENCE_SLOW    = 2,
        MMI_LED_SEQUENCE_FAST    = 3
    };

    /**
     * MMI button actions reported when button has focus.
     */
    export enum RemoteMmiActionInput {
        MMI_ACTION_UP            = 1,
        MMI_ACTION_DOWN          = 2,
        MMI_ACTION_TAP           = 4,
        MMI_ACTION_DOUBLE_TAP    = 8,
        MMI_ACTION_PRESS         = 16,
        MMI_ACTION_LONG_PRESS    = 32,
        MMI_ACTION_X_LONG_PRESS  = 64
    }; 

    /**
     * A 3 x 8 bit set of RGB colors. Numbers can be between 0-255.
     */
    export type ColorType = [number, number, number];

    /**
     * The log level currently used internally in this api facade. Initially this is set to show errors and 
     * warnings until a logEvent (>=0.5) changes this when initializing the extension or when the user
     * changes the log level. Available in the API for testing only - do not use this in normal applications.
     */
    export let logLevel: number = 2;

    /**
     * An internal logger helper.
     */
    const logger = new class {
        trace(msg: string) {
            if (logLevel >= 4) {
                console.log(msg);
            }
        };

        info(msg: string) {
            if (logLevel >= 3) {
                console.log(msg);
            }
        };

        warn(msg: string) {
            if (logLevel >= 2) {
                console.warn(msg);
            }
        };

        error(msg: string) {
            if (logLevel >= 1) {
                console.error(msg);
            }
        };
    };

    /**
     * A reasonably unique ID for our browser extension client that makes it possible to
     * differentiate between different instances of this api in different browser tabs.
     */
    const apiClientId: string = Math.random().toString(36).substr(2, 9);

    /**
     * A mapping from unique request ids for commands and the promise information needed 
     * to resolve/reject them by an incomming event.
     */
    const sendRequestResultMap: Map<string, PromiseCallbacks> = new Map<string, PromiseCallbacks>();

    /**
    * A counter used to generate unique request ID's used to match commands and returning events.
    */
    let requestNumber: number = 1;

    /**
     * Contains initialization information used by the init/shutdown methods.
     */
    let initState: {
        initialized?: boolean;
        initializing?: boolean;
        eventCallback?: (event: any) => void;
    } = {};

    /**
     * The JavaScript library must be initialized using this function. It returns a promise that
     * resolves when initialization is complete.
    */
    export function init(): Promise<void> {
        return new Promise((resolve, reject) => {
            // Only Chrome is currently supported
            let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            if (!isChrome) {
                return reject(new Error("Jabra Browser Integration: Only supported by <a href='https://google.com/chrome'>Google Chrome</a>."));
            }

            if (initState.initialized || initState.initializing) {
                return reject(new Error("Jabra Browser Integration already initialized"));
            }

            initState.initializing = true;
            sendRequestResultMap.clear();
            let duringInit = true;

            initState.eventCallback = (event: any) => {
                if (event.source === window &&
                    event.data.direction &&
                    event.data.direction === "jabra-headset-extension-from-content-script") {

                    let eventApiClientId = event.data.apiClientId || "";
                    let requestId = event.data.requestId || "";

                    // Only accept responses from our own requests or from device.
                    if (apiClientId === eventApiClientId || eventApiClientId === "") {
                        logger.trace("Receiving event from content script: " + JSON.stringify(event.data));

                        // For backwards compatibility a blank message might be send as "na".
                        if (event.data.message === "na") {
                            delete event.data.message;
                        }

                        // For backward compatability reinterprent messages starting with error as errors:
                        if (event.data.message && event.data.message.startsWith("Error:")) {
                            event.data.error = event.data.message;
                            delete event.data.message
                        }

                        if (event.data.message) {
                            logger.trace("Got message: " + JSON.stringify(event.data));
                            const normalizedMsg: string = event.data.message.substring(7); // Strip "Event" prefix;

                            if (normalizedMsg.startsWith("logLevel")) {
                                logLevel = parseInt(event.data.message.substring(16));
                                logger.trace("Logger set to level " + logLevel);

                                // Loglevels are internal events and not an indication of proper
                                // initialization so skip rest of handling for log levels.
                                return;
                            }

                            const commandIndex = commandEventsList.findIndex((e) => normalizedMsg.startsWith(e));
                            if (commandIndex >= 0) {
                                // For install info and version command, we need to add api version number.
                                if (normalizedMsg === "getinstallinfo" || (normalizedMsg.startsWith("Version "))) {
                                    // Old extension/host won't have data so make sure it exists to avoid breakage.
                                    if (!event.data.data) {
                                        event.data.data = {};
                                    }
                                    event.data.data.version_jsapi = apiVersion;
                                }

                                // For install info also check if the full installation is consistent.
                                if (normalizedMsg === "getinstallinfo") {
                                    event.data.data.installationOk = isInstallationOk(event.data.data);
                                }
                             
                                // Lookup and check that we have identified a (real) command target to pair result with.
                                let resultTarget = identifyAndCleanupResultTarget(requestId);
                                if (resultTarget) {
                                    let result: any;
                                    if (event.data.data) {
                                        result = event.data.data;
                                    } else {
                                        let dataPosition = commandEventsList[commandIndex].length + 1;
                                        let dataStr = normalizedMsg.substring(dataPosition);
                                        result = {};
                                        if (dataStr) {
                                          result.legacy_result =  dataStr;
                                        };
                                    }
    
                                    resultTarget.resolve(result)
                                } else {
                                    let err = "Result target information missing for message " + event.data.message + ". This is likely due to some software components that have not been updated or a software bug. Please upgrade extension and/or chromehost";
                                    logger.error(err);
                                    notify("error", {
                                        error: err,
                                        message: event.data.message
                                    });
                                }                                
                            } else if (eventListeners.has(normalizedMsg as EventName)) {
                                let clientEvent: ClientMessage = JSON.parse(JSON.stringify(event.data));
                                delete clientEvent.direction;
                                delete clientEvent.apiClientId;
                                delete clientEvent.requestId;
                                clientEvent.message = normalizedMsg;

                                notify(normalizedMsg as EventName, clientEvent);
                            } else {
                                logger.warn("Unknown message: " + event.data.message);
                                notify("error", {
                                    error: "Unknown message: ",
                                    message: event.data.message
                                });
                                // Don't let unknown messages complete initialization so stop here.
                                return;
                            }

                            if (duringInit) {
                                duringInit = false;
                                return resolve();
                            }
                        } else if (event.data.error) {
                            logger.error("Got error: " + event.data.error);
                            const normalizedError: string = event.data.error.substring(7); // Strip "Error" prefix;

                            // Reject target promise if there is one - otherwise send a general error.
                            let resultTarget = identifyAndCleanupResultTarget(requestId);
                            if (resultTarget) {
                                resultTarget.reject(new CommandError(resultTarget.cmd, normalizedError, event.data.data));
                            } else {
                                let clientError: ClientError = JSON.parse(JSON.stringify(event.data));
                                delete clientError.direction;
                                delete clientError.apiClientId;
                                delete clientError.requestId;
                                clientError.error = normalizedError;

                                notify("error", clientError);
                            }

                            if (duringInit) {
                                duringInit = false;
                                return reject(new Error(event.data.error));
                            }
                        }
                    }
                }
            };

            window.addEventListener("message", initState.eventCallback!);

            // Initial getversion and loglevel.
            setTimeout(
                () => {
                    sendCmdWithResult("getversion", null, false).then((result) => {
                        let resultStr = (typeof result === 'string' || result instanceof String) ? result : JSON.stringify(result, null, 2);
                        logger.trace("getversion returned successfully with : " + resultStr);

                        sendCmd("logLevel", null, false);
                    }).catch((error) => {
                        logger.error(error);
                    });
                },
                1000
            );

            // Check if the web-extension is installed
            setTimeout(
                function () {
                    if (duringInit === true) {
                        duringInit = false;
                        const extensionId = isBeta ? betaExtensionId : prodExtensionId;
                        reject(new Error("Jabra Browser Integration: You need to use this <a href='https://chrome.google.com/webstore/detail/" + extensionId + "'>Extension</a> and then reload this page"));
                    }
                },
                5000
            );

            /**
             * Helper that checks if the installation is consistent.
             */
            function isInstallationOk(installInfo: InstallInfo): boolean {
                let browserSdkVersions = [installInfo.version_browserextension, installInfo.version_chromehost, installInfo.version_jsapi];
  
                // Check that we have install information for all components.
                if (browserSdkVersions.some(v => !v) || !installInfo.version_nativesdk) {
                    return false;
                }

                // Check that different beta versions are not mixed.
                if (!browserSdkVersions.map(v => {
                    let betaIndex = v.lastIndexOf('beta');
                    if (betaIndex>=0 && v.length>betaIndex+4) {
                        return v.substr(betaIndex+4);
                    } else {
                        return undefined;
                    }
                }).filter(v => v).every((v, i, arr) => v === arr[0])) {
                    return false;
                }

                return true;
            }

            /**
             * Post event/error to subscribers.
             */
            function notify(eventName: EventName, eventMsg: ClientMessage | ClientError): void {
                let callbacks = eventListeners.get(eventName);
                if (callbacks) {
                    callbacks.forEach((callback) => {
                        callback(eventMsg);
                    });
                } else {
                    // This should not occur unless internal event mappings in this file
                    // are not configured correctly.
                    logger.error("Unexpected unknown eventName: " + eventName);
                }
            }

            /** Lookup any previous stored result target information for the request.
            *   Does cleanup if target found (so it can't be called twice for a request).
            *   Nb. requestId's are only provided by >= 0.5 extension and chromehost. 
            */
            function identifyAndCleanupResultTarget(requestId?: string) : PromiseCallbacks | undefined {
                // Lookup any previous stored result target information for the request.
                // Nb. requestId's are only provided by >= 0.5 extension and chromehost. 
                let resultTarget: PromiseCallbacks | undefined;
                if (requestId) {
                    resultTarget = sendRequestResultMap.get(requestId);
                    // Remember to cleanup to avoid memory leak!
                    sendRequestResultMap.delete(requestId);
                } else if (sendRequestResultMap.size === 1) {
                    // We don't have a requestId but since only one is being executed we
                    // can assume this is the one.
                    let value = sendRequestResultMap.entries().next().value;
                    resultTarget = value[1];
                    // Remember to cleanup to avoid memory leak and for future 
                    // requests like this to be resolved.
                    sendRequestResultMap.delete(value[0]);
                } else {
                    // No idea what target matches what request - give up.
                    resultTarget = undefined;
                }

                // Warn in case of likely memory leak:
                const mapSize = sendRequestResultMap.size;
                if (mapSize > 10 && mapSize % 10 === 0) { // Limit warnings to every 10 size increases to avoid flooding:
                    logger.warn("Memory leak found - Request result map is getting too large (size #" + mapSize + ")");
                }

                return resultTarget;

            }

            initState.initialized = true;
            initState.initializing = false;
        });
    };

    /**
    * De-initialize the api after use. Not normally used as api will normally
    * stay in use thoughout an application - mostly of interest for testing.
    */
    export function shutdown(): Promise<void> {
        if (initState.initialized) {
            window.removeEventListener("message", initState.eventCallback!);
            initState.eventCallback = undefined;
            sendRequestResultMap.clear();
            requestNumber = 1;
            initState.initialized = false;

            // Unsubscribe all.
            eventListeners.forEach((value, key) => {
                value = [];
            });
            return Promise.resolve();
        }

        return Promise.reject(new Error("Browser integration not initialized"));
    };

    /**
     * Internal helper that returns an array of valid event keys that correspond to the event specificator 
     * and are known to exist in our event listener map.
     */
    function getEvents(nameSpec: string | RegExp | Array<string | RegExp>): ReadonlyArray<string> {
        if (Array.isArray(nameSpec)) {
            // @ts-ignore: Disable wrong "argument not assignable" error in ts 3.4
            return [ ...new Set<string>([].concat.apply([], nameSpec.map(a => getEvents(a)))) ];
        } else if (nameSpec instanceof RegExp) {
            return Array.from<string>(eventListeners.keys()).filter(key => nameSpec.test(key))
        } else { // String
            if (eventListeners.has(nameSpec as EventName)) {
             return [ nameSpec ];
            } else {
                logger.warn("Unknown event " + nameSpec + " ignored when adding/removing eventlistener");
            }
        }

        return [];
    }

    /**
     * Hook up listener call back to specified event(s) as specified by initial name specification argument nameSpec.
     * When the nameSpec argument is a string, this correspond to a single named event. When the argument is a regular
     * expression all lister subscribes to all matching events. If the argument is an array it recursively subscribes
     * to all events specified in the array.
     */
    export function addEventListener(nameSpec: string | RegExp | Array<string | RegExp>, callback: EventCallback): void {
        getEvents(nameSpec).map(name => {
            let callbacks = eventListeners.get(name as EventName);
            if (!callbacks!.find((c) => c === callback)) {
              callbacks!.push(callback);
            }
        });
    };

    /**
     * Remove existing listener to specified event(s). The callback must correspond to the exact callback provided
     * to a previous addEventListener. 
     */
    export function removeEventListener(nameSpec: string | RegExp | Array<string | RegExp>, callback: EventCallback): void {
        getEvents(nameSpec).map(name => {
            let callbacks = eventListeners.get(name as EventName);
            let findIndex = callbacks!.findIndex((c) => c === callback);
            if (findIndex >= 0) {
              callbacks!.splice(findIndex, 1);
            }
        });
    };

    /**
    * Activate ringer (if supported) on the Jabra Device
    */
    export function ring(): void {
        sendCmd("ring");
    };

    /**
    * Change state to in-a-call.
    */
    export function offHook(): void {
        sendCmd("offhook");
    };

    /**
    * Change state to idle (not-in-a-call).
    */
    export function onHook(): void {
        sendCmd("onhook");
    };

    /**
    * Mutes the microphone (if supported).
    */
    export function mute(): void {
        sendCmd("mute");
    };

    /**
    * Unmutes the microphone (if supported).
    */
    export function unmute(): void {
        sendCmd("unmute");
    };

    /**
    * Change state to held (if supported).
    */
    export function hold(): void {
        sendCmd("hold");
    };

    /**
    * Change state from held to OffHook (if supported).
    */
    export function resume(): void {
        sendCmd("resume");
    };

    /**
    * Capture/release buttons for customization (if supported). This turns off default behavior and enables mmi events to
    * be received instead. It also allows for mmi actions to be applied like changing lights with setRemoteMmiLightAction.
    * 
    * @param type The button that should be captured/released.
    * @param capture True if button should be captured, false if it should be released.
    * 
    * @returns A promise that is resolved once operation completes.
    */
    export function setMmiFocus(type: RemoteMmiType | string, capture: boolean | string): Promise<void> {
        let typeVal = numberOrString(type);
        let captureVal = booleanOrString(capture);
        return sendCmdWithResult<void>("setmmifocus", { 
            type: typeVal,
            capture: captureVal
        });
    }

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
    export function setRemoteMmiLightAction(type: RemoteMmiType | string, color: ColorType | string | number, effect: RemoteMmiSequence | string): Promise<void> {
        let typeVal = numberOrString(type);
        let colorVal = colorOrString(color);
        let effectVal = numberOrString(effect);
        return sendCmdWithResult<void>("setremotemmilightaction", { 
            type: typeVal,
            color: colorVal,
            effect: effectVal
        });        
    }

    /**
    * Internal helper to get detailed information about the current active Jabra Device
    * from SDK, including current status but excluding media device information.
    */
    function _doGetActiveSDKDevice(): Promise<DeviceInfo> {
      return sendCmdWithResult<DeviceInfo>("getactivedevice");
    };

    /**
    * Internal helper to get detailed information about the all attached Jabra Devices
    * from SDK, including current status but excluding media device information.
    */
    function _doGetSDKDevices(): Promise<ReadonlyArray<DeviceInfo>> {
        return sendCmdWithResult<ReadonlyArray<DeviceInfo>>("getdevices");
    };

    /**
    * Get detailed information about the current active Jabra Device, including current status
    * and optionally also including related browser media device information. 
    * 
    * Note that browser media device information requires mediaDevices.getUserMedia or
    * getUserDeviceMediaExt to have been called so permissions are granted. Browser media information
    * is useful for setting a device constraint on mediaDevices.getUserMedia for input or for calling 
    * setSinkId (when supported by the browser) to set output.
    */
    export function getActiveDevice(includeBrowserMediaDeviceInfo: boolean | string = false): Promise<DeviceInfo> {
        let includeBrowserMediaDeviceInfoVal = booleanOrString(includeBrowserMediaDeviceInfo);
        if (includeBrowserMediaDeviceInfoVal) {
            return _doGetActiveSDKDevice_And_BrowserDevice();
        } else {
            return _doGetActiveSDKDevice();
        }
    };

    /**
    * List detailed information about all attached Jabra Devices, including current status.
    * and optionally also including related browser media device information.
    * 
    * Note that browser media device information requires mediaDevices.getUserMedia or
    * getUserDeviceMediaExt to have been called so permissions are granted. Browser media information
    * is useful for setting a device constraint on mediaDevices.getUserMedia for input or for calling 
    * setSinkId (when supported by the browser) to set output.
    */
    export function getDevices(includeBrowserMediaDeviceInfo: boolean | string = false): Promise<ReadonlyArray<DeviceInfo>> {
        let includeBrowserMediaDeviceInfoVal = booleanOrString(includeBrowserMediaDeviceInfo);
        if (includeBrowserMediaDeviceInfoVal) {
            return _doGetSDKDevices_And_BrowserDevice();
        } else {
            return _doGetSDKDevices();
        }
     };

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
    export function _setActiveDeviceId(id: number | string): void {
        let idVal =  numberOrString(id);
        
        // Use both new and old way of passing parameters for compatibility with <= v0.5.
        sendCmd("setactivedevice " + id.toString(), { id: idVal } );
    };
    
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
    export function setActiveDeviceId(id: number | string): Promise<void> {
      let idVal =  numberOrString(id);
    
      return sendCmdWithResult<void>("setactivedevice2", { id: idVal } );
    };

    /**
    * Set busylight on active device (if supported)
    * 
    * @param busy True if busy light should be set, false if it should be cleared.
    */
    export function setBusyLight(busy: boolean | string): Promise<void> {
        let busyVal = booleanOrString(busy);
       
        return sendCmdWithResult<void>("setbusylight", { busy: busyVal } );
    };

    /**
    * Get version number information for all components.
    */
    export function getInstallInfo(): Promise<InstallInfo> {
        return sendCmdWithResult<InstallInfo>("getinstallinfo");
    };

    /**
    * Internal helper that forwards a command to the browser extension
    * without expecting a response.
    */
    function sendCmd(cmd: string, args: object | null = null, requireInitializedCheck: boolean = true): void {
        if (!requireInitializedCheck || (requireInitializedCheck && initState.initialized)) {
            let requestId = (requestNumber++).toString();

            let msg = {
                direction: "jabra-headset-extension-from-page-script",
                message: cmd,
                args: args || {},
                requestId: requestId,
                apiClientId: apiClientId,
                version_jsapi: apiVersion
            };

            logger.trace("Sending command to content script: " + JSON.stringify(msg));

            window.postMessage(msg, "*");
        } else {
            throw new Error("Browser integration not initialized");
        }
    };

    /**
    * Internal helper that forwards a command to the browser extension
    * expecting a response (a promise).
    */
    function sendCmdWithResult<T>(cmd: string, args: object | null = null, requireInitializedCheck: boolean = true): Promise<T> {
        if (!requireInitializedCheck || (requireInitializedCheck && initState.initialized)) {
            let requestId = (requestNumber++).toString();

            return new Promise<T>((resolve, reject) => {
                sendRequestResultMap.set(requestId, { cmd, resolve, reject });

                let msg = {
                    direction: "jabra-headset-extension-from-page-script",
                    message: cmd,
                    args: args || {},
                    requestId: requestId,
                    apiClientId: apiClientId,
                    version_jsapi: apiVersion
                };

                logger.trace("Sending command to content script expecting result: " + JSON.stringify(msg));

                window.postMessage(msg, "*");
            });
        } else {
            return Promise.reject(new Error("Browser integration not initialized"));
        }
    };

    /**
    * Configure an audio html element on a webpage to use jabra audio device as speaker output. Returns a promise with boolean success status.
    * The deviceInfo argument must come from getDeviceInfo or getUserDeviceMediaExt calls.
    */
    export function trySetDeviceOutput(audioElement: HTMLMediaElement, deviceInfo: DeviceInfo): Promise<boolean> {
        if (!audioElement || !deviceInfo) {
            return Promise.reject(new Error('Call to trySetDeviceOutput has argument(s) missing'));
        }

        if (!(typeof ((audioElement as any).setSinkId) === "function")) {
            return Promise.reject(new Error('Your browser does not support required Audio Output Devices API'));
        }

        return (audioElement as any).setSinkId(deviceInfo.browserAudioOutputId).then(() => {
            var success = (audioElement as any).sinkId === deviceInfo.browserAudioOutputId;
            return success;
        });
    };

    /**
     * Checks if a Jabra Input device is in fact selected in a media stream.
     * The deviceInfo argument must come from getDeviceInfo or getUserDeviceMediaExt calls.
     */
    export function isDeviceSelectedForInput(mediaStream: MediaStream, deviceInfo: DeviceInfo): boolean {
        if (!mediaStream || !deviceInfo) {
            throw Error('Call to isDeviceSelectedForInput has argument(s) missing');
        }

        var tracks = mediaStream.getAudioTracks();
        for (var i = 0, len = tracks.length; i < len; i++) {
            var track = tracks[i];
            var trackCap = track.getCapabilities();
            if (trackCap.deviceId !== deviceInfo.browserAudioInputId) {
                return false;
            }
        }

        return true;
    };

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
    export function getUserDeviceMediaExt(constraints?: MediaStreamConstraints): Promise<MediaStreamAndDeviceInfoPair> {
        // Good error if using old browser:
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            return Promise.reject(new Error('Your browser does not support required media api'));
        }

        // Init completed ?
        if (!initState.initialized) {
            return Promise.reject(new Error("Browser integration not initialized"));
        }

        // Warn of degraded UX experience unless we are running https.
        if (location.protocol !== 'https:') {
            logger.warn("This function needs to run under https for best UX experience (persisted permissions)");
        }

        // Check input validity:
        if (constraints !== undefined && constraints !== null && typeof constraints !== 'object') {
            return Promise.reject(new Error("Optional constraints parameter must be an object"));
        }

        /**
         * Utility method that combines constraints with ours taking precedence (deep). 
         */
        function mergeConstraints(ours: MediaStreamConstraints, theirs?: MediaStreamConstraints): MediaStreamConstraints {
            if (theirs !== null && theirs !== undefined && typeof ours === 'object') {
                let result: { [index: string]: any } = {};
                for (var attrname in theirs) { result[attrname] = (theirs as any)[attrname]; }
                for (var attrname in ours) { result[attrname] = mergeConstraints((ours as any)[attrname], (theirs as any)[attrname]); } // Ours takes precedence.
                return result;
            } else {
                return ours;
            }
        }

        // If we have the input device id already we can do a direct call to getUserMedia, otherwise we have to do
        // an initial general call to getUserMedia just get access to looking up the input device and then a second
        // call to getUserMedia to make sure the Jabra input device is selected.
        return navigator.mediaDevices.getUserMedia(mergeConstraints({ audio: true }, constraints)).then((dummyStream) => {
            return _doGetActiveSDKDevice_And_BrowserDevice().then((deviceInfo) => {
                // Shutdown initial dummy stream (not sure it is really required but let's be nice).
                dummyStream.getTracks().forEach((track) => {
                    track.stop();
                });

                if (deviceInfo && deviceInfo.browserAudioInputId) {                   
                    return navigator.mediaDevices.getUserMedia(mergeConstraints({ audio: { deviceId: deviceInfo.browserAudioInputId } }, constraints))
                        .then((stream) => {
                            return {
                                stream: stream,
                                deviceInfo: deviceInfo
                            };
                        })
                } else {
                    return Promise.reject(new Error('Could not find a Jabra device with a microphone'));
                }
            })
        });
    };

    /**
     * Internal helper for add media information properties to existing SDK device information.
     */
    function fillInMatchingMediaInfo(deviceInfo: DeviceInfo, mediaDevices: MediaDeviceInfo[]): void {
        function findBestMatchIndex(sdkDeviceName: string, mediaDeviceNameCandidates: string[]): number {
            // Edit distance helper adapted from
            // https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
            function editDistance(s1: string, s2: string) {
                s1 = s1.toLowerCase();
                s2 = s2.toLowerCase();
                
                var costs = new Array();
                for (var i = 0; i <= s1.length; i++) {
                    var lastValue = i;
                    for (var j = 0; j <= s2.length; j++) {
                    if (i == 0)
                        costs[j] = j;
                    else {
                        if (j > 0) {
                        var newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                        }
                    }
                    }
                    if (i > 0)
                    costs[s2.length] = lastValue;
                }
                return costs[s2.length];
            }
            
            // Levenshtein distance helper adapted from
            // https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
            function levenshteinDistance(s1: string, s2: string) : number {
                let longer = s1;
                let shorter = s2;
                if (s1.length < s2.length) {
                    longer = s2;
                    shorter = s1;
                }
                let longerLength = longer.length;
                if (longerLength === 0) {
                    return 1.0;
                }
                return (longerLength - editDistance(longer, shorter)) / longerLength;
            }

            if (mediaDeviceNameCandidates.length == 1) {
                return 0;
            } else if (mediaDeviceNameCandidates.length > 0) {
                let similarities = mediaDeviceNameCandidates.map(candidate => {
                    if (candidate.includes("(" + sdkDeviceName + ")")) {
                        return 1.0;
                    } else {
                        // Remove Standard/Default prefix from label in Chrome when comparing
                        let prefixEnd = candidate.indexOf(' - ');
                        let cleanedCandidate = (prefixEnd >= 0) ? candidate.substring(prefixEnd + 3) : candidate;

                        return levenshteinDistance(sdkDeviceName, cleanedCandidate)
                    }
                });
                let bestMatchIndex = similarities.reduce((prevIndexMax, value, i, a) => value > a[prevIndexMax] ? i : prevIndexMax, 0);
                return bestMatchIndex;
            } else {
                return -1;
            }
        }
            
        // Find matching pair input or output device.
        function findMatchingMediaDevice(groupId: string, kind: string, src: MediaDeviceInfo[]): MediaDeviceInfo | undefined {
            return src.find(md => md.groupId == groupId && md.kind == kind);
        }
        
        if (deviceInfo && deviceInfo.deviceName) {
            let groupId: string | undefined = undefined;
            let audioInputId: string | undefined = undefined;
            let audioOutputId: string | undefined = undefined;
            let label: string | undefined = undefined;
            // Filter out non Jabra input/output devices:
            let jabraMediaDevices = mediaDevices.filter(device => device.label
                && device.label.toLowerCase().includes('jabra')
                && (device.kind === 'audioinput' || device.kind === 'audiooutput'));
            let someJabraDeviceIndex = findBestMatchIndex(deviceInfo.deviceName, jabraMediaDevices.map(md => md.label));
            if (someJabraDeviceIndex >= 0) {
                let foundDevice = jabraMediaDevices[someJabraDeviceIndex];
                groupId = foundDevice.groupId;
                label = foundDevice.label;
                if (foundDevice.kind === 'audioinput') {
                    audioInputId = foundDevice.deviceId;
                    // Lookup matching output device:
                    let outputDevice = findMatchingMediaDevice(groupId, 'audiooutput', jabraMediaDevices);
                    if (outputDevice) {
                        audioOutputId = outputDevice.deviceId;
                    }
                }
                else if (foundDevice.kind === 'audiooutput') {
                    audioOutputId = foundDevice.deviceId;
                    // Lookup matching output input device:
                    let inputDevice = findMatchingMediaDevice(groupId, 'audioinput', jabraMediaDevices);
                    if (inputDevice) {
                        audioInputId = inputDevice.deviceId;
                    }
                }
            }
            if (groupId) {
                deviceInfo.browserGroupId = groupId;
            }
            if (label) {
                deviceInfo.browserLabel = label;
            }
            if (audioInputId) {
                deviceInfo.browserAudioInputId = audioInputId;
            }
            if (audioOutputId) {
                deviceInfo.browserAudioOutputId = audioOutputId;
            }
        } else {
            // Do nothing if device information is missing.
        }
    }

    /** 
     * Internal helper that returns complete device information, including both SDK and browser media device 
     * information for all devices. 
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
    function _doGetSDKDevices_And_BrowserDevice(): Promise<ReadonlyArray<DeviceInfo>> {
         // Good error if using old browser:
         if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            return Promise.reject(new Error('Your browser does not support required media api'));
        }

        // Init completed ?
        if (!initState.initialized) {
            return Promise.reject(new Error("Browser integration not initialized"));
        }

        // Browser security rules (for at least chrome) requires site to run under https for labels to be read.
        if (location.protocol !== 'https:') {
            return Promise.reject(new Error('Your browser needs https for lookup to work'));
        }

        return Promise.all([_doGetSDKDevices(), navigator.mediaDevices.enumerateDevices()]).then( ([deviceInfos, mediaDevices]) => {
            deviceInfos.forEach( (deviceInfo) => {
                fillInMatchingMediaInfo(deviceInfo, mediaDevices);
            });

            return deviceInfos;
        });
    }

    /** 
     * Internal helper that returns complete device information, including both SDK and browser media device 
     * information for active device. 
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
    function _doGetActiveSDKDevice_And_BrowserDevice(): Promise<DeviceInfo> {
         // Good error if using old browser:
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            return Promise.reject(new Error('Your browser does not support required media api'));
        }

        // Init completed ?
        if (!initState.initialized) {
            return Promise.reject(new Error("Browser integration not initialized"));
        }

        // Browser security rules (for at least chrome) requires site to run under https for labels to be read.
        if (location.protocol !== 'https:') {
            return Promise.reject(new Error('Your browser needs https for lookup to work'));
        }

        // enumerateDevices requires user to have provided permission using getUserMedia for labels to be filled out.
        return Promise.all([_doGetActiveSDKDevice(), navigator.mediaDevices.enumerateDevices()]).then( ([deviceInfo, mediaDevices]) => {
            fillInMatchingMediaInfo(deviceInfo, mediaDevices);
            return deviceInfo;
        });
    };

     /**
     * Helper that pass boolean values through and parses strings to booleans.
     */
    function booleanOrString(arg: boolean | string) : boolean
    {
        if (arg !== "" && ((typeof arg === 'string') || ((arg as any) instanceof String))) {
            return (arg === 'true' || arg === '1');
        } else if (typeof(arg) === "boolean")  {
            return arg;
        } else {
            throw new Error("Illegal/missing argument - boolean or string expected");
        }
    }

    /**
     * Helper that pass numbers through and parses strings to numbers.
     */
    function numberOrString(arg: number | string): number {
        if (arg !== "" && ((typeof arg === 'string') || ((arg as any) instanceof String))) {
            return parseInt(arg as string);
        } else if (typeof arg == 'number') {
            return arg;
        } else {
            throw new Error("Illegal/missing argument - number or string expected");
        }
    };

    /**
     * Helper that pass color array through and converts values to color array.
     */
    function colorOrString(arg: ReadonlyArray<number> | number | string): ReadonlyArray<number> {
        if (arg !== "" && ((typeof arg === 'string') || ((arg as any) instanceof String)))  {
            let combinedValue = parseInt(arg as string, 16);
            return [ (combinedValue >> 16) & 255, (combinedValue >> 8) & 255, combinedValue & 255 ];
        } else if (typeof arg == 'number') {
            let combinedValue = arg;
            return [ (combinedValue >> 16) & 255, (combinedValue >> 8) & 255, combinedValue & 255 ];
        } else if (Array.isArray(arg)) {
            if (arg.length !=3) {
                throw new Error("Illegal argument - wrong dimension of number array (3 expected)");
            }
            return arg;
        } else {
            throw new Error("Illegal/missing argument - number array or hex string expected");
        }
    };
};
