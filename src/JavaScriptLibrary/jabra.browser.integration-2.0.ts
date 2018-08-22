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
     * Contains information about a jabra device.
     */
    export interface DeviceInfo {
        groupId: string | null,
        audioInputId: string | null,
        audioOutputId: string | null,
        label: string | null
    };

    /**
     * A combination of a media stream and the assoicated device.
     */
    export interface MediaStreamAndDevicePair {
        stream: MediaStream;
        deviceInfo: DeviceInfo
    };

    /**
     * An enimeration of codes for various device events.
     */
    export enum DeviceEventCodes {
        mute = 0,
        unmute = 1,
        endCall = 2,
        acceptCall = 3,
        rejectCall = 4,
        flash = 5,
        /**
         * A device has been added.
         */
        deviceAttached = 6,
        /**
         * A device has been removed.
         */
        deviceDetached = 7
    };

    export interface DeviceInfo {
        groupId: string | null,
        audioInputId: string | null,
        audioOutputId: string | null,
        label: string | null
    };

    /**
     * Internal helper that stores information about the promise to resolve/reject
     * for a command being processed.
     */
    interface PromiseCallbacks {
        resolve: (value: string) => any;
        reject: (reason: string) => any;
    }

    /**
     * Event type for call backs.
     */
    export interface Event {
        name: string;
        code: DeviceEventCodes;
        arg?: string;
    };

    /*
      export type ClientError = {
        [key: string]: string
    } | {
        error: string;
    };
    */

    export type ClientError = any | {
        error: string;
    };

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
    const eventListeners: Map<string, Array<EventCallback>> = new Map<string, Array<EventCallback>>();
    eventListeners.set("mute", []);
    eventListeners.set("unmute", []); 
    eventListeners.set("device attached", []); 
    eventListeners.set("device detached", []); 
    eventListeners.set("acceptcall", []); 
    eventListeners.set("endcall", []); 
    eventListeners.set("reject", []); 
    eventListeners.set("flash", []);
    eventListeners.set("error", []);

    const deviceEventsMap: { [key: string]: DeviceEventCodes } = {
        "mute": DeviceEventCodes.mute,
        "unmute": DeviceEventCodes.unmute,
        "device attached": DeviceEventCodes.deviceAttached,
        "device detached": DeviceEventCodes.deviceDetached,
        "acceptcall": DeviceEventCodes.acceptCall,
        "endcall": DeviceEventCodes.endCall,
        "reject": DeviceEventCodes.rejectCall,
        "flash": DeviceEventCodes.flash
    };

    const commandEventsList = [
        "devices",
        "activedevice",
        "getinstallinfo",
        "Version"
    ];

    /**
     * The log level curently used.
     */
    let logLevel: number = 1;

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
     * Cached information about current Jabra Device.
     */
    let jabraDeviceInfo: DeviceInfo | null = null;

    /**
     * Contains initialization information used by the init/shutdown methods.
     */
    let initState: {
        initialized?: boolean;
        initializing?: boolean;
        eventCallback?: (event: any) => void;
    } = {};


    /** 
     *  @deprecated Since 2.0. Use DeviceEventCodes enumeration instead for new code. 
     *  Warning: Likely to be removed in a future version of this API.
     **/
    export let requestEnum = {
        mute: DeviceEventCodes.mute,
        unmute: DeviceEventCodes.unmute,
        endCall: DeviceEventCodes.endCall,
        acceptCall: DeviceEventCodes.acceptCall,
        rejectCall: DeviceEventCodes.rejectCall,
        flash: DeviceEventCodes.flash,
        deviceAttached: DeviceEventCodes.deviceAttached,
        deviceDetached: DeviceEventCodes.deviceDetached
    };

    /**
     * The JavaScript library must be initialized using this function.
     */
    export function init() {
        return new Promise((resolve, reject) => {
            // Only Chrome is currently supported
            let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            if (!isChrome) {
                return reject("Jabra Browser Integration: Only supported by <a href='https://google.com/chrome'>Google Chrome</a>.");
            }

            if (initState.initialized || initState.initializing) {
                return reject("Jabra Browser Integration already initialized");
            }

            initState.initializing = true;
            sendRequestResultMap.clear();
            let duringInit = true;

            initState.eventCallback = (event: any) => {
                if (event.source === window &&
                    event.data.direction &&
                    event.data.direction === "jabra-headset-extension-from-content-script") {

                    let apiClientId = event.data.apiClientId || "";
                    let requestId = event.data.requestId || "";

                    // Only accept responses from our own requests or from device.
                    if (apiClientId === apiClientId || apiClientId === "") {
                        logger.trace("Receiving event from content script: " + JSON.stringify(event.data));

                        // Lookup any previous stored result target informaton for the request.
                        let resultTarget = requestId ? sendRequestResultMap.get(requestId) : undefined;
                        if (resultTarget) {
                            // Remember to cleanup to avoid memory leak!
                            sendRequestResultMap.delete(requestId);
                        }

                        if (event.data.message && event.data.message.startsWith("Event: logLevel")) {
                            logLevel = parseInt(event.data.message.substring(16));
                            logger.trace("Logger set to level " + logLevel);
                        } else if (duringInit === true) {
                            // Hmm... this assume first event will be passed on to native host,
                            // so it won't work with logLevel. Thus we check log level first.
                            duringInit = false;
                            if (event.data.error != null && event.data.error != undefined) {
                                return reject(event.data.error);
                            } else {
                                return resolve();
                            }
                        } else if (event.data.message) {
                            logger.trace("Got message: " + JSON.stringify(event.data));
                            const normalizedMsg: string = event.data.message.substring(7); // Strip "Event" prefix;
                            const commandIndex = commandEventsList.findIndex((e) => normalizedMsg.startsWith(e));
                            if (commandIndex >= 0) {
                                if (!resultTarget) {
                                    resultTargetMissingError(event.data.message);
                                    return;
                                }
                                let result: any;
                                if (event.data.data) {
                                    result = event.data.data;
                                } else {
                                    let dataPosition = commandEventsList[commandIndex].length + 1;
                                    let dataStr = normalizedMsg.substring(dataPosition);
                                    result = {};
                                    if (dataStr) {
                                      result.data_from_legazy_chromehost_please_upgrade =  dataStr;
                                    };
                                }
                                resultTarget.resolve(result);
                            } else if (eventListeners.has(normalizedMsg)) {
                                let callbacks = eventListeners.get(normalizedMsg);

                                let clientEvent: ClientMessage = JSON.parse(JSON.stringify(event.data));
                                delete clientEvent.direction;
                                delete clientEvent.apiClientId;
                                delete clientEvent.requestId;
                                clientEvent.message = normalizedMsg;
                                clientEvent.code =  deviceEventsMap[normalizedMsg];

                                callbacks!.forEach((callback) => {
                                    callback(clientEvent);
                                });
                            } else {
                                logger.warn("Unknown message: " + event.data.message);
                            }
                        } else if (event.data.error) {
                            logger.error("Got error: " + event.data.error);
                            const normalizedError: string = event.data.message.substring(7); // Strip "Error" prefix;
                            let clientError: ClientError = JSON.parse(JSON.stringify(event.data));
                            delete clientError.direction;
                            delete clientError.apiClientId;
                            delete clientError.requestId;
                            clientError.error = normalizedError;

                            if (resultTarget) {
                                resultTarget.reject(clientError);
                            } else {
                                let callbacks = eventListeners.get("error");
                                callbacks!.forEach((callback) => {
                                    callback(clientError);
                                });
                            }
                        }
                    }
                }
            };

            window.addEventListener("message", initState.eventCallback!);

            sendCmd("logLevel");

            // Initial getversion and loglevel.
            setTimeout(
                () => {
                    sendCmd("getversion");
                },
                1000
            );

            // Check if the web-extension is installed
            setTimeout(
                function () {
                    if (duringInit === true) {
                        duringInit = false;
                        reject("Jabra Browser Integration: You need to use this <a href='https://chrome.google.com/webstore/detail/okpeabepajdgiepelmhkfhkjlhhmofma'>Extension</a> and then reload this page");
                    }
                },
                5000
            );

            function resultTargetMissingError(msg: string) {
                logger.error("Result target information missing for message " + msg + ". This is likely due to some software components that have not been updated. Please upgrade extension and/or chromehost");
            }

            initState.initialized = true;
            initState.initializing = false;
        });
    };

    /**
    * De-initialize the api after use. Not normally used as api will normally
    * stay in use thoughout an application - mostly of interest for testing.
    */
    export function shutdown() {
        if (initState.initialized) {
            window.removeEventListener("message", initState.eventCallback!);
            initState.eventCallback = undefined;
            sendRequestResultMap.clear();
            requestNumber = 1;
            jabraDeviceInfo = null;
            initState.initialized = false;

            // Unsubscribe all.
            eventListeners.forEach((value, key) => {
                value = [];
            });
            return true;
        }

        return false;
    };

    /**
     * Internal helper that returns an array of valid event keys that correspond to the event specificator 
     * and are know to exist in our event listener map.
     */
    function getEvents(nameSpec: string | RegExp): ReadonlyArray<string> {
        if (nameSpec instanceof RegExp) {
            return Array.from<string>(eventListeners.keys()).filter(key => nameSpec.test(key))
        } else { // String
            if (eventListeners.has(nameSpec)) {
             return [ nameSpec ];
            }
        }

        return [];
    }

    /**
     * Hook up listener call back to specified event(s) as specified by initial name specification argument nameSpec.
     * When the nameSpec argument is a string, this correspond to a single named event. When the argument is a regular
     * expression all the lister subscribes to all matching events.
     */
    export function addEventListener(nameSpec: string | RegExp, callback: EventCallback): void {
        getEvents(nameSpec).map(name => {
            let callbacks = eventListeners.get(name);
            if (!callbacks!.find((c) => c === callback)) {
              callbacks!.push(callback);
            }
        });
    };

    /**
     * Remove existing listener to specified event(s). The callback must correspond to the exact callback provided
     * to a previous addEventListener. 
     */
    export function removeEventListener(nameSpec: string | RegExp, callback: EventCallback): void {
        getEvents(nameSpec).map(name => {
            let callbacks = eventListeners.get(name);
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
    * Get the current active Jabra Device.
    */
    export function getActiveDevice(): Promise<string> {
        return sendCmdWithResult("getactivedevice");
    };

    /**
    * List all attached Jabra Devices.
    */
    export function getDevices(): Promise<string> {
        return sendCmdWithResult("getdevices");
    };

    /**
    * Select a new active device.
    */
    export function setActiveDevice(id: string): void {
        sendCmd("setactivedevice " + id);
    };

    /**
    * Get protocol version.
    * @deprecated Since 2.0. Use getInstallInfo instead.
    * Warning: Likely to be removed in a future version of this API.
    */
    export function getVersion(): Promise<string> {
        return sendCmdWithResult("getversion");
    };

    /**
    * TODO:
    */
    export function getInstallInfo(): Promise<string> {
        return sendCmdWithResult("getinstallinfo");
    };

    /**
    * Internal helper that forwards a command to the browser extension
    * without expecting a response.
    */
    function sendCmd(cmd: string): void {
        let requestId = (requestNumber++).toString();

        let msg = {
            direction: "jabra-headset-extension-from-page-script",
            message: cmd,
            requestId: requestId,
            apiClientId: apiClientId
        };

        logger.trace("Sending command to content script: " + JSON.stringify(msg));

        window.postMessage(msg, "*");
    };

    /**
    * Internal helper that forwards a command to the browser extension
    * expecting a response (a promise).
    */
    function sendCmdWithResult(cmd: string): Promise<string> {
        let requestId = (requestNumber++).toString();

        return new Promise((resolve, reject) => {
            sendRequestResultMap.set(requestId, { resolve, reject });

            let msg = {
                direction: "jabra-headset-extension-from-page-script",
                message: cmd,
                requestId: requestId,
                apiClientId: apiClientId
            };

            logger.trace("Sending command to content script expecting result: " + JSON.stringify(msg));

            window.postMessage(msg, "*");
        });
    };

    /**
    * Configure a <audio> html element on a webpage to use jabra audio device as speaker output. Returns a promise with boolean success status.
    * The deviceInfo argument must come from getDeviceInfo or getUserDeviceMediaExt calls.
    */
    export function trySetDeviceOutput(audioElement: HTMLMediaElement, deviceInfo: DeviceInfo): Promise<boolean> {
        if (!audioElement || !deviceInfo) {
            return Promise.reject(new Error('Call to trySetDeviceOutput has argument(s) missing'));
        }

        if (!(typeof ((audioElement as any).setSinkId) === "function")) {
            return Promise.reject(new Error('Your browser does not support required Audio Output Devices API'));
        }

        return (audioElement as any).setSinkId(deviceInfo.audioOutputId).then(function () {
            var success = (audioElement as any).sinkId === deviceInfo.audioOutputId;
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
            if (trackCap.deviceId !== deviceInfo.audioInputId) {
                return false;
            }
        }

        return true;
    };

    /**
    * Drop-in replacement for mediaDevices.getUserMedia that makes a best effort to select a Jabra audio device 
    * to be used for the microphone.
    * 
    * Like the orginal getUserMedia this method returns a promise that resolve to a media stream if successful.
    * Optional, additional non-audio constrains (like f.x. video) can be specified as well.
    * 
    * See also getUserDeviceMediaExt that returns device information in addition to the stream! In most cases,
    * this is an better alternative since the device information is needed for additional steps.
    * 
    */
    export function getUserDeviceMedia(additionalConstraints: MediaStreamConstraints): Promise<MediaStream> {
        return getUserDeviceMediaExt(additionalConstraints).then(function (obj) {
            return obj.stream;
        });
    };

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
    export function getUserDeviceMediaExt(additionalConstraints: MediaStreamConstraints): Promise<MediaStreamAndDevicePair> {
        // Good error if using old browser:
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            return Promise.reject(new Error('Your browser does not support required media api'));
        }

        // Warn of degraded UX experience unless we are running https.
        if (location.protocol !== 'https:') {
            console.warn("This function needs to run under https for best UX experience (persisted permissions)");
        }

        /**
         * Utility method that combines constraints with ours taking precendence (shallow). 
         */
        function mergeConstraints(ours: { [index: string]: any }, theirs?: { [index: string]: any }): MediaStreamConstraints {
            if (!theirs) {
                return ours;
            }
            var result: { [index: string]: any } = {};
            for (var attrname in theirs) { result[attrname] = theirs[attrname]; }
            for (var attrname in ours) { result[attrname] = ours[attrname]; } // Ours takes precedence.
            return result;
        }

        // If we have the input device id already we can do a direct call to getUserMedia, otherwise we have to do
        // an initial general call to getUserMedia just get access to looking up the input device and than a second
        // call to getUserMedia to make sure the Jabra input device is selected.
        if (jabraDeviceInfo && jabraDeviceInfo.audioInputId) {
            return navigator.mediaDevices.getUserMedia(mergeConstraints({ audio: { deviceId: jabraDeviceInfo.audioInputId } }, additionalConstraints))
                .then(function (stream) {
                    return {
                        stream: stream,
                        deviceInfo: jabraDeviceInfo!
                    };
                });
        } else {
            return navigator.mediaDevices.getUserMedia(mergeConstraints({ audio: true, additionalConstraints })).then(function (dummyStream) {
                return getDeviceInfo().then(function (jabraDeviceInfo) {
                    // Shutdown initial dummy stream (not sure it is really required but lets be nice).
                    dummyStream.getTracks().forEach(function (track) {
                        track.stop();
                    });

                    if (jabraDeviceInfo && jabraDeviceInfo.audioInputId) {
                        return navigator.mediaDevices.getUserMedia(mergeConstraints({ audio: { deviceId: jabraDeviceInfo.audioInputId } }, additionalConstraints))
                            .then(function (stream) {
                                return {
                                    stream: stream,
                                    deviceInfo: jabraDeviceInfo
                                };
                            })
                    } else {
                        return Promise.reject(new Error('Could not find a Jabra device with a microphone'));
                    }
                })
            });
        }
    };

    /** 
     * Returns a promise resolving to all known ID for (first found) Jabra device valid for the current
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
    export function getDeviceInfo(): Promise<DeviceInfo> {
        // Use cached value if already have found the devices.
        // TODO: Check if this works if the device has been unplugged/re-attached since last call ?
        if (jabraDeviceInfo) {
            return Promise.resolve(jabraDeviceInfo);
        }

        // Good error if using old browser:
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            return Promise.reject(new Error('Your browser does not support required media api'));
        }

        // Browser security rules (for at least chrome) requires site to run under https for labels to be read.
        if (location.protocol !== 'https:') {
            return Promise.reject(new Error('Your browser needs https for lookup to work'));
        }

        // Look for Jabra devices among all media devices. The list is in random order
        // and not necessarily complete in all browsers.
        return navigator.mediaDevices.enumerateDevices().then(function (devices) {
            var groupId = null;
            var audioInputId = null;
            var audioOutputId = null;
            var label = null;

            // Find matching input/output pair if exist (and supported by browser).
            for (var i = 0; i !== devices.length; ++i) {
                var device = devices[i];

                // Label check requires user to have provided permission using getUserMedia.
                if (device.label && device.label.includes('Jabra')) {
                    // When we first find a Jabra device we fix on that device's groupId to
                    // to make sure input and output match same device.
                    if ((device.kind === 'audioinput' || device.kind === 'audiooutput') && !groupId) {
                        groupId = device.groupId;
                        // Retrieve label initially - Should be the same for both input and output anyway.
                        label = device.label;
                        // Remove Standard/Default prefix from label in Chrome.
                        var prefixEnd = label.indexOf(' - ');
                        if (prefixEnd >= 0) {
                            label = label.substring(prefixEnd + 3);
                        }
                    }

                    if (device.kind === 'audioinput' && device.groupId == groupId) {
                        audioInputId = device.deviceId;
                    } else if (device.kind === 'audiooutput' && device.groupId == groupId) {
                        audioOutputId = device.deviceId;
                    }
                }
            }

            // Result is an ID combination for single device + device label.
            var result: DeviceInfo = {
                groupId: groupId,
                audioInputId: audioInputId,
                audioOutputId: audioOutputId,
                label: label
            };

            // Cache result if at least partially sucessful.
            if (result.audioInputId) {
                jabraDeviceInfo = result;
            }

            return result;
        });
    };
};
