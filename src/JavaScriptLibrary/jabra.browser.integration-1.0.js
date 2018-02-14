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
  }

};