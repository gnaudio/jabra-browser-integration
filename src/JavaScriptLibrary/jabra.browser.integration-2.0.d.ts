/**
* The global jabra object is your entry for the jabra browser SDK.
*/
declare namespace jabra {
    /**
     * Contains information about a jabra device.
     */
    interface DeviceInfo {
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
        deviceInfo: DeviceInfo;
    }
    /**
     * An enimeration of codes for various device events.
     */
    enum DeviceEventCodes {
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
    }
    /**
     *  @deprecated Since 2.0. Use DeviceEventCodes enumeration instead for new code.
     *  Warning: Likely to be removed in a future version of this API.
     **/
    let requestEnum: {
        mute: DeviceEventCodes;
        unmute: DeviceEventCodes;
        endCall: DeviceEventCodes;
        acceptCall: DeviceEventCodes;
        rejectCall: DeviceEventCodes;
        flash: DeviceEventCodes;
        deviceAttached: DeviceEventCodes;
        deviceDetached: DeviceEventCodes;
    };
    /**
     * The JavaScript library must be initialized using this function.
     */
    function init(clientEventCallback: (event: string | DeviceEventCodes) => void): Promise<{}>;
    /**
    * De-initialize the api after use. Not normally used as api will normally
    * stay in use thoughout an application - mostly of interest for testing.
    */
    function shutdown(): boolean;
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
    * Get the current active Jabra Device.
    */
    function getActiveDevice(): Promise<string>;
    /**
    * List all attached Jabra Devices.
    */
    function getDevices(): Promise<string>;
    /**
    * Select a new active device.
    */
    function setActiveDevice(id: string): void;
    /**
    * Get protocol version.
    * @deprecated Since 2.0. Use getInstallInfo instead.
    * Warning: Likely to be removed in a future version of this API.
    */
    function getVersion(): Promise<string>;
    /**
    * TODO:
    */
    function getInstallInfo(): Promise<string>;
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
    function getUserDeviceMedia(additionalConstraints: MediaStreamConstraints): Promise<MediaStream>;
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
    function getDeviceInfo(): Promise<DeviceInfo>;
}
