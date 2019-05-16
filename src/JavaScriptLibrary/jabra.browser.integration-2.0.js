"use strict";
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
var jabra;
(function (jabra) {
    /**
     * Version of this javascript api (should match version number in file apart from possible alfa/beta designator).
     */
    jabra.apiVersion = "2.0.1";
    /**
     * Is the current version a beta ?
     */
    const isBeta = jabra.apiVersion.includes("beta");
    /**
     * Id of proper (production) release of browser plugin.
     */
    const prodExtensionId = "okpeabepajdgiepelmhkfhkjlhhmofma";
    /**
    * Id of beta release of browser plugin.
    */
    const betaExtensionId = "igcbbdnhomedfadljgcmcfpdcoonihfe";
    ;
    ;
    ;
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
     * All possible device events as internal array.
     */
    let eventNamesList = ["mute", "unmute", "device attached", "device detached", "acceptcall",
        "endcall", "reject", "flash", "online", "offline", "linebusy", "lineidle",
        "redial", "key0", "key1", "key2", "key3", "key4", "key5",
        "key6", "key7", "key8", "key9", "keyStar", "keyPound",
        "keyClear", "Online", "speedDial", "voiceMail", "LineBusy",
        "outOfRange", "intoRange", "pseudoAcceptcall", "pseudoEndcall",
        "button1", "button2", "button3", "volumeUp", "volumeDown", "fireAlarm",
        "jackConnection", "jackDisConnection", "qdConnection", "qdDisconnection",
        "headsetConnection", "headsetDisConnection", "devlog", "busylight",
        "hearThrough", "batteryStatus", "gnpButton", "mmi", "error"];
    /**
     * Error status codes returned by SDK. Same as Jabra_ErrorStatus in native SDK.
     */
    let ErrorCodes;
    (function (ErrorCodes) {
        ErrorCodes[ErrorCodes["NoError"] = 0] = "NoError";
        ErrorCodes[ErrorCodes["SSLError"] = 1] = "SSLError";
        ErrorCodes[ErrorCodes["CertError"] = 2] = "CertError";
        ErrorCodes[ErrorCodes["NetworkError"] = 3] = "NetworkError";
        ErrorCodes[ErrorCodes["DownloadError"] = 4] = "DownloadError";
        ErrorCodes[ErrorCodes["ParseError"] = 5] = "ParseError";
        ErrorCodes[ErrorCodes["OtherError"] = 6] = "OtherError";
        ErrorCodes[ErrorCodes["DeviceInfoError"] = 7] = "DeviceInfoError";
        ErrorCodes[ErrorCodes["FileNotAccessible"] = 8] = "FileNotAccessible";
        ErrorCodes[ErrorCodes["FileNotCompatible"] = 9] = "FileNotCompatible";
        ErrorCodes[ErrorCodes["Device_NotFound"] = 10] = "Device_NotFound";
        ErrorCodes[ErrorCodes["Parameter_fail"] = 11] = "Parameter_fail";
        ErrorCodes[ErrorCodes["Authorization_failed"] = 12] = "Authorization_failed";
        ErrorCodes[ErrorCodes["FileNotAvailable"] = 13] = "FileNotAvailable";
        ErrorCodes[ErrorCodes["ConfigParseError"] = 14] = "ConfigParseError";
        ErrorCodes[ErrorCodes["SetSettings_Fail"] = 15] = "SetSettings_Fail";
        ErrorCodes[ErrorCodes["Device_Reboot"] = 16] = "Device_Reboot";
        ErrorCodes[ErrorCodes["Device_ReadFail"] = 17] = "Device_ReadFail";
        ErrorCodes[ErrorCodes["Device_NotReady"] = 18] = "Device_NotReady";
        ErrorCodes[ErrorCodes["FilePartiallyCompatible"] = 19] = "FilePartiallyCompatible";
    })(ErrorCodes = jabra.ErrorCodes || (jabra.ErrorCodes = {}));
    ;
    /**
     * Error return codes. Same as Jabra_ReturnCode in native SDK.
     */
    let ErrorReturnCodes;
    (function (ErrorReturnCodes) {
        ErrorReturnCodes[ErrorReturnCodes["Return_Ok"] = 0] = "Return_Ok";
        ErrorReturnCodes[ErrorReturnCodes["Device_Unknown"] = 1] = "Device_Unknown";
        ErrorReturnCodes[ErrorReturnCodes["Device_Invalid"] = 2] = "Device_Invalid";
        ErrorReturnCodes[ErrorReturnCodes["Not_Supported"] = 3] = "Not_Supported";
        ErrorReturnCodes[ErrorReturnCodes["Return_ParameterFail"] = 4] = "Return_ParameterFail";
        ErrorReturnCodes[ErrorReturnCodes["ProtectedSetting_Write"] = 5] = "ProtectedSetting_Write";
        ErrorReturnCodes[ErrorReturnCodes["No_Information"] = 6] = "No_Information";
        ErrorReturnCodes[ErrorReturnCodes["NetworkRequest_Fail"] = 7] = "NetworkRequest_Fail";
        ErrorReturnCodes[ErrorReturnCodes["Device_WriteFail"] = 8] = "Device_WriteFail";
        ErrorReturnCodes[ErrorReturnCodes["Device_ReadFails"] = 9] = "Device_ReadFails";
        ErrorReturnCodes[ErrorReturnCodes["No_FactorySupported"] = 10] = "No_FactorySupported";
        ErrorReturnCodes[ErrorReturnCodes["System_Error"] = 11] = "System_Error";
        ErrorReturnCodes[ErrorReturnCodes["Device_BadState"] = 12] = "Device_BadState";
        ErrorReturnCodes[ErrorReturnCodes["FileWrite_Fail"] = 13] = "FileWrite_Fail";
        ErrorReturnCodes[ErrorReturnCodes["File_AlreadyExists"] = 14] = "File_AlreadyExists";
        ErrorReturnCodes[ErrorReturnCodes["File_Not_Accessible"] = 15] = "File_Not_Accessible";
        ErrorReturnCodes[ErrorReturnCodes["Firmware_UpToDate"] = 16] = "Firmware_UpToDate";
        ErrorReturnCodes[ErrorReturnCodes["Firmware_Available"] = 17] = "Firmware_Available";
        ErrorReturnCodes[ErrorReturnCodes["Return_Async"] = 18] = "Return_Async";
        ErrorReturnCodes[ErrorReturnCodes["Invalid_Authorization"] = 19] = "Invalid_Authorization";
        ErrorReturnCodes[ErrorReturnCodes["FWU_Application_Not_Available"] = 20] = "FWU_Application_Not_Available";
        ErrorReturnCodes[ErrorReturnCodes["Device_AlreadyConnected"] = 21] = "Device_AlreadyConnected";
        ErrorReturnCodes[ErrorReturnCodes["Device_NotConnected"] = 22] = "Device_NotConnected";
        ErrorReturnCodes[ErrorReturnCodes["CannotClear_DeviceConnected"] = 23] = "CannotClear_DeviceConnected";
        ErrorReturnCodes[ErrorReturnCodes["Device_Rebooted"] = 24] = "Device_Rebooted";
        ErrorReturnCodes[ErrorReturnCodes["Upload_AlreadyInProgress"] = 25] = "Upload_AlreadyInProgress";
        ErrorReturnCodes[ErrorReturnCodes["Download_AlreadyInProgress"] = 26] = "Download_AlreadyInProgress";
    })(ErrorReturnCodes = jabra.ErrorReturnCodes || (jabra.ErrorReturnCodes = {}));
    ;
    /**
     * Custom error returned by commands expecting results when failing.
     */
    class CommandError extends Error {
        constructor(command, errmessage, data) {
            super("Command " + command + " failed with error  message " + errmessage + " and details: " + JSON.stringify(data || {}));
            this.command = command;
            this.errmessage = errmessage;
            this.data = data;
            this.name = 'CommandError';
        }
    }
    jabra.CommandError = CommandError;
    ;
    ;
    /**
     * Internal mapping from all known events to array of registered callbacks. All possible events are setup
     * initially. Callbacks values are configured at runtime.
     */
    const eventListeners = new Map();
    eventNamesList.forEach((event) => eventListeners.set(event, []));
    /**
     * Device feature codes.
     */
    let DeviceFeature;
    (function (DeviceFeature) {
        DeviceFeature[DeviceFeature["BusyLight"] = 1000] = "BusyLight";
        DeviceFeature[DeviceFeature["FactoryReset"] = 1001] = "FactoryReset";
        DeviceFeature[DeviceFeature["PairingList"] = 1002] = "PairingList";
        DeviceFeature[DeviceFeature["RemoteMMI"] = 1003] = "RemoteMMI";
        DeviceFeature[DeviceFeature["MusicEqualizer"] = 1004] = "MusicEqualizer";
        DeviceFeature[DeviceFeature["EarbudInterconnectionStatus"] = 1005] = "EarbudInterconnectionStatus";
        DeviceFeature[DeviceFeature["StepRate"] = 1006] = "StepRate";
        DeviceFeature[DeviceFeature["HeartRate"] = 1007] = "HeartRate";
        DeviceFeature[DeviceFeature["RRInterval"] = 1008] = "RRInterval";
        DeviceFeature[DeviceFeature["RingtoneUpload"] = 1009] = "RingtoneUpload";
        DeviceFeature[DeviceFeature["ImageUpload"] = 1010] = "ImageUpload";
        DeviceFeature[DeviceFeature["NeedsExplicitRebootAfterOta"] = 1011] = "NeedsExplicitRebootAfterOta";
        DeviceFeature[DeviceFeature["NeedsToBePutIncCradleToCompleteFwu"] = 1012] = "NeedsToBePutIncCradleToCompleteFwu";
        DeviceFeature[DeviceFeature["RemoteMMIv2"] = 1013] = "RemoteMMIv2";
        DeviceFeature[DeviceFeature["Logging"] = 1014] = "Logging";
        DeviceFeature[DeviceFeature["PreferredSoftphoneListInDevice"] = 1015] = "PreferredSoftphoneListInDevice";
        DeviceFeature[DeviceFeature["VoiceAssistant"] = 1016] = "VoiceAssistant";
        DeviceFeature[DeviceFeature["PlayRingtone"] = 1017] = "PlayRingtone";
    })(DeviceFeature = jabra.DeviceFeature || (jabra.DeviceFeature = {}));
    ;
    /**
     * A specification of a button for MMI capturing.
     */
    let RemoteMmiType;
    (function (RemoteMmiType) {
        RemoteMmiType[RemoteMmiType["MMI_TYPE_MFB"] = 0] = "MMI_TYPE_MFB";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_VOLUP"] = 1] = "MMI_TYPE_VOLUP";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_VOLDOWN"] = 2] = "MMI_TYPE_VOLDOWN";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_VCB"] = 3] = "MMI_TYPE_VCB";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_APP"] = 4] = "MMI_TYPE_APP";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_TR_FORW"] = 5] = "MMI_TYPE_TR_FORW";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_TR_BACK"] = 6] = "MMI_TYPE_TR_BACK";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_PLAY"] = 7] = "MMI_TYPE_PLAY";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_MUTE"] = 8] = "MMI_TYPE_MUTE";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_HOOK_OFF"] = 9] = "MMI_TYPE_HOOK_OFF";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_HOOK_ON"] = 10] = "MMI_TYPE_HOOK_ON";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_BLUETOOTH"] = 11] = "MMI_TYPE_BLUETOOTH";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_JABRA"] = 12] = "MMI_TYPE_JABRA";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_BATTERY"] = 13] = "MMI_TYPE_BATTERY";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_PROG"] = 14] = "MMI_TYPE_PROG";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_LINK"] = 15] = "MMI_TYPE_LINK";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_ANC"] = 16] = "MMI_TYPE_ANC";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_LISTEN_IN"] = 17] = "MMI_TYPE_LISTEN_IN";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_DOT3"] = 18] = "MMI_TYPE_DOT3";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_DOT4"] = 19] = "MMI_TYPE_DOT4";
        RemoteMmiType[RemoteMmiType["MMI_TYPE_ALL"] = 255] = "MMI_TYPE_ALL";
    })(RemoteMmiType = jabra.RemoteMmiType || (jabra.RemoteMmiType = {}));
    ;
    /**
     * A MMI effect specification for light on, off or blinking in different tempo.
     */
    let RemoteMmiSequence;
    (function (RemoteMmiSequence) {
        RemoteMmiSequence[RemoteMmiSequence["MMI_LED_SEQUENCE_OFF"] = 0] = "MMI_LED_SEQUENCE_OFF";
        RemoteMmiSequence[RemoteMmiSequence["MMI_LED_SEQUENCE_ON"] = 1] = "MMI_LED_SEQUENCE_ON";
        RemoteMmiSequence[RemoteMmiSequence["MMI_LED_SEQUENCE_SLOW"] = 2] = "MMI_LED_SEQUENCE_SLOW";
        RemoteMmiSequence[RemoteMmiSequence["MMI_LED_SEQUENCE_FAST"] = 3] = "MMI_LED_SEQUENCE_FAST";
    })(RemoteMmiSequence = jabra.RemoteMmiSequence || (jabra.RemoteMmiSequence = {}));
    ;
    /**
     * MMI button actions reported when button has focus.
     */
    let RemoteMmiActionInput;
    (function (RemoteMmiActionInput) {
        RemoteMmiActionInput[RemoteMmiActionInput["MMI_ACTION_UP"] = 1] = "MMI_ACTION_UP";
        RemoteMmiActionInput[RemoteMmiActionInput["MMI_ACTION_DOWN"] = 2] = "MMI_ACTION_DOWN";
        RemoteMmiActionInput[RemoteMmiActionInput["MMI_ACTION_TAP"] = 4] = "MMI_ACTION_TAP";
        RemoteMmiActionInput[RemoteMmiActionInput["MMI_ACTION_DOUBLE_TAP"] = 8] = "MMI_ACTION_DOUBLE_TAP";
        RemoteMmiActionInput[RemoteMmiActionInput["MMI_ACTION_PRESS"] = 16] = "MMI_ACTION_PRESS";
        RemoteMmiActionInput[RemoteMmiActionInput["MMI_ACTION_LONG_PRESS"] = 32] = "MMI_ACTION_LONG_PRESS";
        RemoteMmiActionInput[RemoteMmiActionInput["MMI_ACTION_X_LONG_PRESS"] = 64] = "MMI_ACTION_X_LONG_PRESS";
    })(RemoteMmiActionInput = jabra.RemoteMmiActionInput || (jabra.RemoteMmiActionInput = {}));
    ;
    /**
     * The log level currently used internally in this api facade. Initially this is set to show errors and
     * warnings until a logEvent (>=0.5) changes this when initializing the extension or when the user
     * changes the log level. Available in the API for testing only - do not use this in normal applications.
     */
    jabra.logLevel = 2;
    /**
     * An internal logger helper.
     */
    const logger = new class {
        trace(msg) {
            if (jabra.logLevel >= 4) {
                console.log(msg);
            }
        }
        ;
        info(msg) {
            if (jabra.logLevel >= 3) {
                console.log(msg);
            }
        }
        ;
        warn(msg) {
            if (jabra.logLevel >= 2) {
                console.warn(msg);
            }
        }
        ;
        error(msg) {
            if (jabra.logLevel >= 1) {
                console.error(msg);
            }
        }
        ;
    };
    /**
     * A reasonably unique ID for our browser extension client that makes it possible to
     * differentiate between different instances of this api in different browser tabs.
     */
    const apiClientId = Math.random().toString(36).substr(2, 9);
    /**
     * A mapping from unique request ids for commands and the promise information needed
     * to resolve/reject them by an incomming event.
     */
    const sendRequestResultMap = new Map();
    /**
    * A counter used to generate unique request ID's used to match commands and returning events.
    */
    let requestNumber = 1;
    /**
     * Contains initialization information used by the init/shutdown methods.
     */
    let initState = {};
    /**
     * The JavaScript library must be initialized using this function. It returns a promise that
     * resolves when initialization is complete.
    */
    function init() {
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
            initState.eventCallback = (event) => {
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
                            delete event.data.message;
                        }
                        if (event.data.message) {
                            logger.trace("Got message: " + JSON.stringify(event.data));
                            const normalizedMsg = event.data.message.substring(7); // Strip "Event" prefix;
                            if (normalizedMsg.startsWith("logLevel")) {
                                jabra.logLevel = parseInt(event.data.message.substring(16));
                                logger.trace("Logger set to level " + jabra.logLevel);
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
                                    event.data.data.version_jsapi = jabra.apiVersion;
                                }
                                // For install info also check if the full installation is consistent.
                                if (normalizedMsg === "getinstallinfo") {
                                    event.data.data.installationOk = isInstallationOk(event.data.data);
                                }
                                // Lookup and check that we have identified a (real) command target to pair result with.
                                let resultTarget = identifyAndCleanupResultTarget(requestId);
                                if (resultTarget) {
                                    let result;
                                    if (event.data.data) {
                                        result = event.data.data;
                                    }
                                    else {
                                        let dataPosition = commandEventsList[commandIndex].length + 1;
                                        let dataStr = normalizedMsg.substring(dataPosition);
                                        result = {};
                                        if (dataStr) {
                                            result.legacy_result = dataStr;
                                        }
                                        ;
                                    }
                                    resultTarget.resolve(result);
                                }
                                else {
                                    let err = "Result target information missing for message " + event.data.message + ". This is likely due to some software components that have not been updated or a software bug. Please upgrade extension and/or chromehost";
                                    logger.error(err);
                                    notify("error", {
                                        error: err,
                                        message: event.data.message
                                    });
                                }
                            }
                            else if (eventListeners.has(normalizedMsg)) {
                                let clientEvent = JSON.parse(JSON.stringify(event.data));
                                delete clientEvent.direction;
                                delete clientEvent.apiClientId;
                                delete clientEvent.requestId;
                                clientEvent.message = normalizedMsg;
                                notify(normalizedMsg, clientEvent);
                            }
                            else {
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
                        }
                        else if (event.data.error) {
                            logger.error("Got error: " + event.data.error);
                            const normalizedError = event.data.error.substring(7); // Strip "Error" prefix;
                            // Reject target promise if there is one - otherwise send a general error.
                            let resultTarget = identifyAndCleanupResultTarget(requestId);
                            if (resultTarget) {
                                resultTarget.reject(new CommandError(resultTarget.cmd, normalizedError, event.data.data));
                            }
                            else {
                                let clientError = JSON.parse(JSON.stringify(event.data));
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
            window.addEventListener("message", initState.eventCallback);
            // Initial getversion and loglevel.
            setTimeout(() => {
                sendCmdWithResult("getversion", null, false).then((result) => {
                    let resultStr = (typeof result === 'string' || result instanceof String) ? result : JSON.stringify(result, null, 2);
                    logger.trace("getversion returned successfully with : " + resultStr);
                    sendCmd("logLevel", null, false);
                }).catch((error) => {
                    logger.error(error);
                });
            }, 1000);
            // Check if the web-extension is installed
            setTimeout(function () {
                if (duringInit === true) {
                    duringInit = false;
                    const extensionId = isBeta ? betaExtensionId : prodExtensionId;
                    reject(new Error("Jabra Browser Integration: You need to use this <a href='https://chrome.google.com/webstore/detail/" + extensionId + "'>Extension</a> and then reload this page"));
                }
            }, 5000);
            /**
             * Helper that checks if the installation is consistent.
             */
            function isInstallationOk(installInfo) {
                let browserSdkVersions = [installInfo.version_browserextension, installInfo.version_chromehost, installInfo.version_jsapi];
                // Check that we have install information for all components.
                if (browserSdkVersions.some(v => !v) || !installInfo.version_nativesdk) {
                    return false;
                }
                // Check that different beta versions are not mixed.
                if (!browserSdkVersions.map(v => {
                    let betaIndex = v.lastIndexOf('beta');
                    if (betaIndex >= 0 && v.length > betaIndex + 4) {
                        return v.substr(betaIndex + 4);
                    }
                    else {
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
            function notify(eventName, eventMsg) {
                let callbacks = eventListeners.get(eventName);
                if (callbacks) {
                    callbacks.forEach((callback) => {
                        callback(eventMsg);
                    });
                }
                else {
                    // This should not occur unless internal event mappings in this file
                    // are not configured correctly.
                    logger.error("Unexpected unknown eventName: " + eventName);
                }
            }
            /** Lookup any previous stored result target information for the request.
            *   Does cleanup if target found (so it can't be called twice for a request).
            *   Nb. requestId's are only provided by >= 0.5 extension and chromehost.
            */
            function identifyAndCleanupResultTarget(requestId) {
                // Lookup any previous stored result target information for the request.
                // Nb. requestId's are only provided by >= 0.5 extension and chromehost. 
                let resultTarget;
                if (requestId) {
                    resultTarget = sendRequestResultMap.get(requestId);
                    // Remember to cleanup to avoid memory leak!
                    sendRequestResultMap.delete(requestId);
                }
                else if (sendRequestResultMap.size === 1) {
                    // We don't have a requestId but since only one is being executed we
                    // can assume this is the one.
                    let value = sendRequestResultMap.entries().next().value;
                    resultTarget = value[1];
                    // Remember to cleanup to avoid memory leak and for future 
                    // requests like this to be resolved.
                    sendRequestResultMap.delete(value[0]);
                }
                else {
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
    }
    jabra.init = init;
    ;
    /**
    * De-initialize the api after use. Not normally used as api will normally
    * stay in use thoughout an application - mostly of interest for testing.
    */
    function shutdown() {
        if (initState.initialized) {
            window.removeEventListener("message", initState.eventCallback);
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
    }
    jabra.shutdown = shutdown;
    ;
    /**
     * Internal helper that returns an array of valid event keys that correspond to the event specificator
     * and are known to exist in our event listener map.
     */
    function getEvents(nameSpec) {
        if (Array.isArray(nameSpec)) {
            // @ts-ignore: Disable wrong "argument not assignable" error in ts 3.4
            return [...new Set([].concat.apply([], nameSpec.map(a => getEvents(a))))];
        }
        else if (nameSpec instanceof RegExp) {
            return Array.from(eventListeners.keys()).filter(key => nameSpec.test(key));
        }
        else { // String
            if (eventListeners.has(nameSpec)) {
                return [nameSpec];
            }
            else {
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
    function addEventListener(nameSpec, callback) {
        getEvents(nameSpec).map(name => {
            let callbacks = eventListeners.get(name);
            if (!callbacks.find((c) => c === callback)) {
                callbacks.push(callback);
            }
        });
    }
    jabra.addEventListener = addEventListener;
    ;
    /**
     * Remove existing listener to specified event(s). The callback must correspond to the exact callback provided
     * to a previous addEventListener.
     */
    function removeEventListener(nameSpec, callback) {
        getEvents(nameSpec).map(name => {
            let callbacks = eventListeners.get(name);
            let findIndex = callbacks.findIndex((c) => c === callback);
            if (findIndex >= 0) {
                callbacks.splice(findIndex, 1);
            }
        });
    }
    jabra.removeEventListener = removeEventListener;
    ;
    /**
    * Activate ringer (if supported) on the Jabra Device
    */
    function ring() {
        sendCmd("ring");
    }
    jabra.ring = ring;
    ;
    /**
    * Change state to in-a-call.
    */
    function offHook() {
        sendCmd("offhook");
    }
    jabra.offHook = offHook;
    ;
    /**
    * Change state to idle (not-in-a-call).
    */
    function onHook() {
        sendCmd("onhook");
    }
    jabra.onHook = onHook;
    ;
    /**
    * Mutes the microphone (if supported).
    */
    function mute() {
        sendCmd("mute");
    }
    jabra.mute = mute;
    ;
    /**
    * Unmutes the microphone (if supported).
    */
    function unmute() {
        sendCmd("unmute");
    }
    jabra.unmute = unmute;
    ;
    /**
    * Change state to held (if supported).
    */
    function hold() {
        sendCmd("hold");
    }
    jabra.hold = hold;
    ;
    /**
    * Change state from held to OffHook (if supported).
    */
    function resume() {
        sendCmd("resume");
    }
    jabra.resume = resume;
    ;
    /**
    * Capture/release buttons for customization (if supported). This turns off default behavior and enables mmi events to
    * be received instead. It also allows for mmi actions to be applied like changing lights with setRemoteMmiLightAction.
    *
    * @param type The button that should be captured/released.
    * @param capture True if button should be captured, false if it should be released.
    *
    * @returns A promise that is resolved once operation completes.
    */
    function setMmiFocus(type, capture) {
        let typeVal = numberOrString(type);
        let captureVal = booleanOrString(capture);
        return sendCmdWithResult("setmmifocus", {
            type: typeVal,
            capture: captureVal
        });
    }
    jabra.setMmiFocus = setMmiFocus;
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
    function setRemoteMmiLightAction(type, color, effect) {
        let typeVal = numberOrString(type);
        let colorVal = colorOrString(color);
        let effectVal = numberOrString(effect);
        return sendCmdWithResult("setremotemmilightaction", {
            type: typeVal,
            color: colorVal,
            effect: effectVal
        });
    }
    jabra.setRemoteMmiLightAction = setRemoteMmiLightAction;
    /**
    * Internal helper to get detailed information about the current active Jabra Device
    * from SDK, including current status but excluding media device information.
    */
    function _doGetActiveSDKDevice() {
        return sendCmdWithResult("getactivedevice");
    }
    ;
    /**
    * Internal helper to get detailed information about the all attached Jabra Devices
    * from SDK, including current status but excluding media device information.
    */
    function _doGetSDKDevices() {
        return sendCmdWithResult("getdevices");
    }
    ;
    /**
    * Get detailed information about the current active Jabra Device, including current status
    * and optionally also including related browser media device information.
    *
    * Note that browser media device information requires mediaDevices.getUserMedia or
    * getUserDeviceMediaExt to have been called so permissions are granted. Browser media information
    * is useful for setting a device constraint on mediaDevices.getUserMedia for input or for calling
    * setSinkId (when supported by the browser) to set output.
    */
    function getActiveDevice(includeBrowserMediaDeviceInfo = false) {
        let includeBrowserMediaDeviceInfoVal = booleanOrString(includeBrowserMediaDeviceInfo);
        if (includeBrowserMediaDeviceInfoVal) {
            return _doGetActiveSDKDevice_And_BrowserDevice();
        }
        else {
            return _doGetActiveSDKDevice();
        }
    }
    jabra.getActiveDevice = getActiveDevice;
    ;
    /**
    * List detailed information about all attached Jabra Devices, including current status.
    * and optionally also including related browser media device information.
    *
    * Note that browser media device information requires mediaDevices.getUserMedia or
    * getUserDeviceMediaExt to have been called so permissions are granted. Browser media information
    * is useful for setting a device constraint on mediaDevices.getUserMedia for input or for calling
    * setSinkId (when supported by the browser) to set output.
    */
    function getDevices(includeBrowserMediaDeviceInfo = false) {
        let includeBrowserMediaDeviceInfoVal = booleanOrString(includeBrowserMediaDeviceInfo);
        if (includeBrowserMediaDeviceInfoVal) {
            return _doGetSDKDevices_And_BrowserDevice();
        }
        else {
            return _doGetSDKDevices();
        }
    }
    jabra.getDevices = getDevices;
    ;
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
    function _setActiveDeviceId(id) {
        let idVal = numberOrString(id);
        // Use both new and old way of passing parameters for compatibility with <= v0.5.
        sendCmd("setactivedevice " + id.toString(), { id: idVal });
    }
    jabra._setActiveDeviceId = _setActiveDeviceId;
    ;
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
    function setActiveDeviceId(id) {
        let idVal = numberOrString(id);
        return sendCmdWithResult("setactivedevice2", { id: idVal });
    }
    jabra.setActiveDeviceId = setActiveDeviceId;
    ;
    /**
    * Set busylight on active device (if supported)
    *
    * @param busy True if busy light should be set, false if it should be cleared.
    */
    function setBusyLight(busy) {
        let busyVal = booleanOrString(busy);
        return sendCmdWithResult("setbusylight", { busy: busyVal });
    }
    jabra.setBusyLight = setBusyLight;
    ;
    /**
    * Get version number information for all components.
    */
    function getInstallInfo() {
        return sendCmdWithResult("getinstallinfo");
    }
    jabra.getInstallInfo = getInstallInfo;
    ;
    /**
    * Internal helper that forwards a command to the browser extension
    * without expecting a response.
    */
    function sendCmd(cmd, args = null, requireInitializedCheck = true) {
        if (!requireInitializedCheck || (requireInitializedCheck && initState.initialized)) {
            let requestId = (requestNumber++).toString();
            let msg = {
                direction: "jabra-headset-extension-from-page-script",
                message: cmd,
                args: args || {},
                requestId: requestId,
                apiClientId: apiClientId,
                version_jsapi: jabra.apiVersion
            };
            logger.trace("Sending command to content script: " + JSON.stringify(msg));
            window.postMessage(msg, "*");
        }
        else {
            throw new Error("Browser integration not initialized");
        }
    }
    ;
    /**
    * Internal helper that forwards a command to the browser extension
    * expecting a response (a promise).
    */
    function sendCmdWithResult(cmd, args = null, requireInitializedCheck = true) {
        if (!requireInitializedCheck || (requireInitializedCheck && initState.initialized)) {
            let requestId = (requestNumber++).toString();
            return new Promise((resolve, reject) => {
                sendRequestResultMap.set(requestId, { cmd, resolve, reject });
                let msg = {
                    direction: "jabra-headset-extension-from-page-script",
                    message: cmd,
                    args: args || {},
                    requestId: requestId,
                    apiClientId: apiClientId,
                    version_jsapi: jabra.apiVersion
                };
                logger.trace("Sending command to content script expecting result: " + JSON.stringify(msg));
                window.postMessage(msg, "*");
            });
        }
        else {
            return Promise.reject(new Error("Browser integration not initialized"));
        }
    }
    ;
    /**
    * Configure an audio html element on a webpage to use jabra audio device as speaker output. Returns a promise with boolean success status.
    * The deviceInfo argument must come from getDeviceInfo or getUserDeviceMediaExt calls.
    */
    function trySetDeviceOutput(audioElement, deviceInfo) {
        if (!audioElement || !deviceInfo) {
            return Promise.reject(new Error('Call to trySetDeviceOutput has argument(s) missing'));
        }
        if (!(typeof (audioElement.setSinkId) === "function")) {
            return Promise.reject(new Error('Your browser does not support required Audio Output Devices API'));
        }
        return audioElement.setSinkId(deviceInfo.browserAudioOutputId).then(() => {
            var success = audioElement.sinkId === deviceInfo.browserAudioOutputId;
            return success;
        });
    }
    jabra.trySetDeviceOutput = trySetDeviceOutput;
    ;
    /**
     * Checks if a Jabra Input device is in fact selected in a media stream.
     * The deviceInfo argument must come from getDeviceInfo or getUserDeviceMediaExt calls.
     */
    function isDeviceSelectedForInput(mediaStream, deviceInfo) {
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
    }
    jabra.isDeviceSelectedForInput = isDeviceSelectedForInput;
    ;
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
    function getUserDeviceMediaExt(constraints) {
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
        function mergeConstraints(ours, theirs) {
            if (theirs !== null && theirs !== undefined && typeof ours === 'object') {
                let result = {};
                for (var attrname in theirs) {
                    result[attrname] = theirs[attrname];
                }
                for (var attrname in ours) {
                    result[attrname] = mergeConstraints(ours[attrname], theirs[attrname]);
                } // Ours takes precedence.
                return result;
            }
            else {
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
                    });
                }
                else {
                    return Promise.reject(new Error('Could not find a Jabra device with a microphone'));
                }
            });
        });
    }
    jabra.getUserDeviceMediaExt = getUserDeviceMediaExt;
    ;
    /**
     * Internal helper for add media information properties to existing SDK device information.
     */
    function fillInMatchingMediaInfo(deviceInfo, mediaDevices) {
        function findBestMatchIndex(sdkDeviceName, mediaDeviceNameCandidates) {
            // Edit distance helper adapted from
            // https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
            function editDistance(s1, s2) {
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
                                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
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
            function levenshteinDistance(s1, s2) {
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
            }
            else if (mediaDeviceNameCandidates.length > 0) {
                let similarities = mediaDeviceNameCandidates.map(candidate => {
                    if (candidate.includes("(" + sdkDeviceName + ")")) {
                        return 1.0;
                    }
                    else {
                        // Remove Standard/Default prefix from label in Chrome when comparing
                        let prefixEnd = candidate.indexOf(' - ');
                        let cleanedCandidate = (prefixEnd >= 0) ? candidate.substring(prefixEnd + 3) : candidate;
                        return levenshteinDistance(sdkDeviceName, cleanedCandidate);
                    }
                });
                let bestMatchIndex = similarities.reduce((prevIndexMax, value, i, a) => value > a[prevIndexMax] ? i : prevIndexMax, 0);
                return bestMatchIndex;
            }
            else {
                return -1;
            }
        }
        // Find matching pair input or output device.
        function findMatchingMediaDevice(groupId, kind, src) {
            return src.find(md => md.groupId == groupId && md.kind == kind);
        }
        if (deviceInfo && deviceInfo.deviceName) {
            let groupId = undefined;
            let audioInputId = undefined;
            let audioOutputId = undefined;
            let label = undefined;
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
        }
        else {
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
    function _doGetSDKDevices_And_BrowserDevice() {
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
        return Promise.all([_doGetSDKDevices(), navigator.mediaDevices.enumerateDevices()]).then(([deviceInfos, mediaDevices]) => {
            deviceInfos.forEach((deviceInfo) => {
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
    function _doGetActiveSDKDevice_And_BrowserDevice() {
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
        return Promise.all([_doGetActiveSDKDevice(), navigator.mediaDevices.enumerateDevices()]).then(([deviceInfo, mediaDevices]) => {
            fillInMatchingMediaInfo(deviceInfo, mediaDevices);
            return deviceInfo;
        });
    }
    ;
    /**
    * Helper that pass boolean values through and parses strings to booleans.
    */
    function booleanOrString(arg) {
        if (arg !== "" && ((typeof arg === 'string') || (arg instanceof String))) {
            return (arg === 'true' || arg === '1');
        }
        else if (typeof (arg) === "boolean") {
            return arg;
        }
        else {
            throw new Error("Illegal/missing argument - boolean or string expected");
        }
    }
    /**
     * Helper that pass numbers through and parses strings to numbers.
     */
    function numberOrString(arg) {
        if (arg !== "" && ((typeof arg === 'string') || (arg instanceof String))) {
            return parseInt(arg);
        }
        else if (typeof arg == 'number') {
            return arg;
        }
        else {
            throw new Error("Illegal/missing argument - number or string expected");
        }
    }
    ;
    /**
     * Helper that pass color array through and converts values to color array.
     */
    function colorOrString(arg) {
        if (arg !== "" && ((typeof arg === 'string') || (arg instanceof String))) {
            let combinedValue = parseInt(arg, 16);
            return [(combinedValue >> 16) & 255, (combinedValue >> 8) & 255, combinedValue & 255];
        }
        else if (typeof arg == 'number') {
            let combinedValue = arg;
            return [(combinedValue >> 16) & 255, (combinedValue >> 8) & 255, combinedValue & 255];
        }
        else if (Array.isArray(arg)) {
            if (arg.length != 3) {
                throw new Error("Illegal argument - wrong dimension of number array (3 expected)");
            }
            return arg;
        }
        else {
            throw new Error("Illegal/missing argument - number array or hex string expected");
        }
    }
    ;
})(jabra || (jabra = {}));
;
//# sourceMappingURL=jabra.browser.integration-2.0.js.map