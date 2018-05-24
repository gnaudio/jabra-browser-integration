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

var jabra = {

  callBack: null,

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
  * Internal cached value for getJabraDeviceIds function. Do not use.
  */
  jabraDeviceIds: null,

  init: function (onSuccess, onFailure, onNotify) {

    var duringInit = true;

    // Only Chrome is currently supported
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if (!isChrome) {
      onFailure("Jabra Browser Integration: Only supported by <a href='https://google.com/chrome'>Google Chrome</a>.");
      return;
    }
    // Setup message listener and do a "ping" to the Host
    window.addEventListener("message",
      function (event) {
        if (event.source === window &&
          event.data.direction &&
          event.data.direction === "jabra-headset-extension-from-content-script") {
          if (duringInit === true) {
            duringInit = false;
            if (event.data.error != null && event.data.error != undefined) {
              onFailure(event.data.error);
            } else {
              onSuccess();
            }
          } else {
            // Device request
            if (event.data.message === "Event: mute") {
              onNotify(jabra.requestEnum.mute);
            }
            if (event.data.message === "Event: unmute") {
              onNotify(jabra.requestEnum.unmute);
            }
            if (event.data.message === "Event: device attached") {
              onNotify(jabra.requestEnum.deviceAttached);
            }
            if (event.data.message === "Event: device detached") {
              onNotify(jabra.requestEnum.deviceDetached);
            }
            if (event.data.message === "Event: acceptcall") {
              onNotify(jabra.requestEnum.acceptCall);
            }
            if (event.data.message === "Event: endcall") {
              onNotify(jabra.requestEnum.endCall);
            }
            if (event.data.message === "Event: reject") {
              onNotify(jabra.requestEnum.rejectCall);
            }
            if (event.data.message === "Event: flash") {
              onNotify(jabra.requestEnum.flash);
            }
            // Result from a request
            if (jabra.callBack) {
              if (event.data.message.startsWith("Event: devices")) {
                jabra.callBack(event.data.message.substring(15));
              }
              if (event.data.message.startsWith("Event: activedevice")) {
                jabra.callBack(event.data.message.substring(20));
              }
            }
          }
        }
      }
    );

    // Initial getversion
    setTimeout(
      () => {
        this.sendCmd("getversion");
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
  },

  ring: function () {
    this.sendCmd("ring");
  },

  offHook: function () {
    this.sendCmd("offhook");
  },

  onHook: function () {
    this.sendCmd("onhook");
  },

  mute: function () {
    this.sendCmd("mute");
  },

  unmute: function () {
    this.sendCmd("unmute");
  },

  hold: function () {
    this.sendCmd("hold");
  },

  resume: function () {
    this.sendCmd("resume");
  },

  getActiveDevice: function (callBack) {
    jabra.callBack = callBack;
    this.sendCmd("getactivedevice");
  },

  getDevices: function (callBack) {
    jabra.callBack = callBack;
    this.sendCmd("getdevices");
  },

  setActiveDevice: function (id) {
    this.sendCmd("setactivedevice " + id);
  },

  sendCmd: function (cmd) {
    window.postMessage({
      direction: "jabra-headset-extension-from-page-script",
      message: cmd
    },
      "*");
  },

  /**
  * Configure a <audio> html element on a webpage to use jabra audio device as speaker output. Returns a promise with boolean success status.
  */
  trySetDeviceOutput: function(audioElement) {
      var self = this;

      if (!(typeof (audioElement.setSinkId) === "function")) {
          return Promise.reject(new Error('Your browser does not support required Audio Output Devices API'));
      }

      return self.getDeviceInfo().then(function(ids) {
          return audioElement.setSinkId(ids.audioOutputId).then(function() {
              var success = audioElement.sinkId === ids.audioOutputId;
              return success;
          });
      });
  },

  /**
   * Checks if a Jabra Input device is in fact selected in a media stream.
   */
  isDeviceSelectedForInput: function(mediaStream) {
      var tracks = mediaStream.getAudioTracks();
      for (var i = 0, len = tracks.length; i < len; i++) {
          var track = tracks[i];
          if (!track.label.includes('Jabra')) {
              return false;
          }
      }

      return true;
  },

  /**
  * Drop-in replacement for mediaDevices.getUserMedia that makes a best effort to select a Jabra audio device 
  * to be used for the microphone and optionally sets output to Jabra as well if an HTML audio element
  * reference is provided.
  * 
  * Like the orginal getUserMedia this method returns a promise that resolve to a media stream if successful.
  * Optional, additional non-audio constrains (like f.x. video) can be specified as well.
  * 
  * Note: Subsequetly, if this method appears to succed use the isDeviceSelectedForInput function to check 
  * if the browser did in fact choose a Jabra device for the microphone.
  */
  getUserDeviceMedia: function(additionalConstraints) {
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
          var result = {};
          for (var attrname in theirs) { result[attrname] = theirs[attrname]; }
          for (var attrname in ours) { result[attrname] = ours[attrname]; } // Ours takes precedence.
          return result;
      }

      // If we have the input device id already we can do a direct call to getUserMedia, otherwise we have to do
      // an initial general call to getUserMedia just get access to looking up the input device and than a second
      // call to getUserMedia to make sure the Jabra input device is selected.
      if (self.jabraDeviceIds && self.jabraDeviceIds.audioInputId) {
          return navigator.mediaDevices.getUserMedia(mergeConstraints({ audio: { deviceId: self.jabraDeviceIds.audioInputId } }, additionalConstraints));
      } else {
          return navigator.mediaDevices.getUserMedia(mergeConstraints({ audio: true, additionalConstraints })).then(function(dummyStream) {
              return self.getDeviceInfo().then(function(jabraDeviceIds) {
                  // Shutdown initial dummy stream (not sure it is really required but lets be nice).
                  dummyStream.getTracks().forEach(function(track) {
                      track.stop();
                  });

                  if (jabraDeviceIds && jabraDeviceIds.audioInputId) {
                      return navigator.mediaDevices.getUserMedia(mergeConstraints({ audio: { deviceId: jabraDeviceIds.audioInputId } }, additionalConstraints));
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
  getDeviceInfo: function() {
      let self = this;

      // Use cached value if already have found the devices.
      // TODO: Check if this works if the device has been unplugged/re-attached since last call ?
      if (self.jabraDeviceIds) {
          return Promise.resolve(self.jabraDeviceIds);
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
                      label = device.label; // Should be the same for both input and output.
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
              self.jabraDeviceIds = result;
          }

          return result;
      });
  }
};