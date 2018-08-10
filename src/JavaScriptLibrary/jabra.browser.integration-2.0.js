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

let jabra = {
  logLevel: 1,
   
  /**
  * Internal logger to console that use logLevel for control.
  */
  logger: {
    trace(msg) {
      if (jabra.logLevel>=4) {
        console.log(msg);
      }
    },
  
    info(msg) {
      if (jabra.logLevel>=3) {
        console.log(msg);
      }
    },
  
    warn(msg) {
      if (jabra.logLevel>=2) {
        console.warn(msg);
      }
    },
  
    error(msg) {
      if (jabra.logLevel>=1) {
        console.error(msg);
      }
    } 
  },

  requestEnum: {
    mute: 0,
    unmute: 1,
    endCall: 2,
    acceptCall: 3,
    rejectCall: 4,
    flash: 5,
    deviceAttached: 6,
    deviceDetached: 7
  },

  /**
   * Keeps information of where to put fortcomming results for each requestId.
   * For internal use only.
   */
  sendRequestResultMap: new Map(),

  /**
   * Internal, unique session id for our client api used to distinguish between different 
   * instances of this api on different pages. 
   */
  apiClientId: Math.random().toString(36).substr(2, 9),

  requestNumber: 1,

  /**
  * Internal cached value for getjabraDeviceInfo function. Do not use.
  */
  jabraDeviceInfo: null,

  /* 
  * Internal state for init/close.
  */
  initState: {},

  init(onSuccess, onFailure, onNotify) {

    let duringInit = true;

    // Only Chrome is currently supported
    let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if (!isChrome) {
      onFailure("Jabra Browser Integration: Only supported by <a href='https://google.com/chrome'>Google Chrome</a>.");
      return false;
    }

    if (jabra.initState.initialized) {
      onFailure("Jabra Browser Integration already initialized");
      return false;
    }

    jabra.sendRequestResultMap.clear();

    // Setup message listener and do a "ping" to the Host
    jabra.initState.eventCallback = (event) => {
        if (event.source === window &&
          event.data.direction &&
          event.data.direction === "jabra-headset-extension-from-content-script") {

          let apiClientId = event.data.apiClientId || "";
          let requestId = event.data.requestId || "";

          // Only accept responses from our own requests or from device.
          if (apiClientId === apiClientId || apiClientId === "") {
            jabra.logger.trace("Receiving event from content script: " + JSON.stringify(event.data));

            // Lookup any previous stored result target informaton for the request.
            let resultTarget = requestId ? jabra.sendRequestResultMap.get(requestId) : undefined;
            if (resultTarget) {
              // Remember to cleanup to avoid memory leak!
              jabra.sendRequestResultMap.delete(requestId);
            }

            if (event.data.message && event.data.message.startsWith("Event: logLevel")) {
                jabra.logLevel = parseInt(event.data.message.substring(16));
                jabra.logger.trace("Logger set to level " + jabra.logLevel);
            } else if (duringInit === true) {
              // Hmm... this assume first event will be passed on to native host,
              // so it won't work with logLevel. Thus we check log level first.
              duringInit = false;
              if (event.data.error != null && event.data.error != undefined) {
                onFailure(event.data.error);
              } else {
                onSuccess();
              }
            } else if (event.data.message) {
              // Device request
              // TODO: Rewrite to lookup in dict to resolve events.
              
              if (event.data.message === "Event: mute") {
                onNotify(jabra.requestEnum.mute);
              } else if (event.data.message === "Event: unmute") {
                onNotify(jabra.requestEnum.unmute);
              } else if (event.data.message === "Event: device attached") {
                onNotify(jabra.requestEnum.deviceAttached);
              } else if (event.data.message === "Event: device detached") {
                onNotify(jabra.requestEnum.deviceDetached);
              } else if (event.data.message === "Event: acceptcall") {
                onNotify(jabra.requestEnum.acceptCall);
              } else if (event.data.message === "Event: endcall") {
                onNotify(jabra.requestEnum.endCall);
              } else if (event.data.message === "Event: reject") {
                onNotify(jabra.requestEnum.rejectCall);
              } else if (event.data.message === "Event: flash") {
                onNotify(jabra.requestEnum.flash);
              } else if (event.data.message.startsWith("Event: Version")) {
                // Ignore for now.
              }

              // Command results:
              if (!resultTarget) {
                resultTargetMissingError(event.data.message);
                return;
              }

              // TODO: Rewrite to lookup in dict to resolve events.
              
              if (event.data.message.startsWith("Event: devices")) {
                resultTarget.resolve(event.data.message.substring(15));
              } else if (event.data.message.startsWith("Event: activedevice")) {
                resultTarget.resolve(event.data.message.substring(20));
              }

              /*
              } else {
                jabra.logger.warn("Unknown message: " + event.data.message);
              }*/
            } else if (event.data.error) {
              if (resultTarget) {
                resultTarget.reject(event.data.error);
              } else {
                onFailure(event.data.error);
              }
            }
          }
        }
    };
    
    window.addEventListener("message", jabra.initState.eventCallback);

    this._sendCmd("logLevel");

    // Initial getversion and loglevel.
    setTimeout(
      () => {
        this._sendCmd("getversion");
      },
      1000
    );

    // Check if the web-extension is installed
    setTimeout(
      function () {
        if (duringInit === true) {
          duringInit = false;
          onFailure("Jabra Browser Integration: You need to use this <a href='https://chrome.google.com/webstore/detail/okpeabepajdgiepelmhkfhkjlhhmofma'>Extension</a> and then reload this page");
        }
      },
      5000
    );

    
    function resultTargetMissingError(msg) {
      jabra.logger.error("Result target information missing for message " + msg + ". This is likely due to some software components that have not been updated. Please upgrade extension and/or chromehost");
    }

    jabra.initState.initialized = true;
    return true;
  },

  /**
   * De-initialize the api after use. Not normally used as api will normally
   * stay in use thoughout an application - mostly of interest for testing.
   */
  shutdown() {
    if (jabra.initState.initialized) {
      window.removeEventListener("message", jabra.initState.eventCallback);
      jabra.initState.eventCallback = null;
      jabra.sendRequestResultMap.clear();
      jabra.requestNumber = 1;
      jabra.jabraDeviceInfo = null;
      jabra.initState.initialized = false;
      return true;
    }

    return false;
  },
 
  ring() {
    this._sendCmd("ring");
  },

  offHook() {
    this._sendCmd("offhook");
  },

  onHook() {
    this._sendCmd("onhook");
  },

  mute() {
    this._sendCmd("mute");
  },

  unmute() {
    this._sendCmd("unmute");
  },

  hold() {
    this._sendCmd("hold");
  },

  resume() {
    this._sendCmd("resume");
  },

  getActiveDevice() {
    return this._sendCmdWithResult("getactivedevice");
  },

  getDevices() {
    return this._sendCmdWithResult("getdevices");
  },

  setActiveDevice(id) {
    this._sendCmd("setactivedevice " + id);
  },

  getInstallInfo() {
    return this._sendCmdWithResult("getinstallinfo");
  },

  _sendCmd(cmd) {
    let requestId = (this.requestNumber++).toString();

    let msg = {
      direction: "jabra-headset-extension-from-page-script",
      message: cmd,
      requestId: requestId,
      apiClientId: this.apiClientId
    };

    jabra.logger.trace("Sending command to content script: " + JSON.stringify(msg));

    window.postMessage(msg, "*");
  },

  _sendCmdWithResult(cmd) {
    let requestId = (this.requestNumber++).toString();

    return new Promise((resolve, reject) => {
      jabra.sendRequestResultMap.set(requestId, { resolve, reject });
  
      let msg = {
        direction: "jabra-headset-extension-from-page-script",
        message: cmd,
        requestId: requestId,
        apiClientId: this.apiClientId
      };
  
      jabra.logger.trace("Sending command to content script expecting result: " + JSON.stringify(msg));
  
      window.postMessage(msg, "*");
    });
  },

  /**
  * Configure a <audio> html element on a webpage to use jabra audio device as speaker output. Returns a promise with boolean success status.
  * The deviceInfo argument must come from getDeviceInfo or getUserDeviceMediaExt calls.
  */
  trySetDeviceOutput(audioElement, deviceInfo) {
      var self = this;

      if (!audioElement || !deviceInfo) {
        return Promise.reject(new Error('Call to trySetDeviceOutput has argument(s) missing'));
      }

      if (!(typeof (audioElement.setSinkId) === "function")) {
          return Promise.reject(new Error('Your browser does not support required Audio Output Devices API'));
      }

      return audioElement.setSinkId(deviceInfo.audioOutputId).then(function() {
          var success = audioElement.sinkId === deviceInfo.audioOutputId;
          return success;
      });
  },

  /**
   * Checks if a Jabra Input device is in fact selected in a media stream.
   * The deviceInfo argument must come from getDeviceInfo or getUserDeviceMediaExt calls.
   */
  isDeviceSelectedForInput(mediaStream, deviceInfo) {
      if (!mediaStream || !deviceInfo) {
        return Promise.reject(new Error('Call to isDeviceSelectedForInput has argument(s) missing'));
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
  },

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
  getUserDeviceMedia(additionalConstraints) {
      return getUserDeviceMediaExt(additionalConstraints).then(function(obj) {
        return obj.stream;
      });
  },

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
  getUserDeviceMediaExt(additionalConstraints) {
    let self = this;

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
    function mergeConstraints(ours, theirs) {
        if (!theirs) {
          return ours;
        }
        var result = {};
        for (var attrname in theirs) { result[attrname] = theirs[attrname]; }
        for (var attrname in ours) { result[attrname] = ours[attrname]; } // Ours takes precedence.
        return result;
    }

    // If we have the input device id already we can do a direct call to getUserMedia, otherwise we have to do
    // an initial general call to getUserMedia just get access to looking up the input device and than a second
    // call to getUserMedia to make sure the Jabra input device is selected.
    if (self.jabraDeviceInfo && self.jabraDeviceInfo.audioInputId) {
        return navigator.mediaDevices.getUserMedia(mergeConstraints({ audio: { deviceId: self.jabraDeviceInfo.audioInputId } }, additionalConstraints))
              .then(function (stream) {
                return {
                   stream: stream,
                   deviceInfo: self.jabraDeviceInfo
                };
              });
    } else {
        return navigator.mediaDevices.getUserMedia(mergeConstraints({ audio: true, additionalConstraints })).then(function(dummyStream) {
            return self.getDeviceInfo().then(function(jabraDeviceInfo) {
                // Shutdown initial dummy stream (not sure it is really required but lets be nice).
                dummyStream.getTracks().forEach(function(track) {
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
  },

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
  getDeviceInfo() {
      let self = this;

      // Use cached value if already have found the devices.
      // TODO: Check if this works if the device has been unplugged/re-attached since last call ?
      if (self.jabraDeviceInfo) {
          return Promise.resolve(self.jabraDeviceInfo);
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
      return navigator.mediaDevices.enumerateDevices().then(function(devices) {
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
          var result = {
              groupId: groupId,
              audioInputId: audioInputId,
              audioOutputId: audioOutputId,
              label: label
          };

          // Cache result if at least partially sucessful.
          if (result.audioInputId) {
              self.jabraDeviceInfo = result;
          }

          return result;
      });
  }
};