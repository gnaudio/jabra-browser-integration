(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.jabra = {})));
}(this, (function (exports) {
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
   * Version of this javascript api (should match version number in file apart from possible alfa/beta designator).
   */
  var apiVersion = "2.1.0.beta1";
  /**
   * Is the current version a beta ?
   */

  var isBeta = apiVersion.includes("beta");
  /**
   * Id of proper (production) release of browser plugin.
   */

  var prodExtensionId = "okpeabepajdgiepelmhkfhkjlhhmofma";
  /**
   * Id of beta release of browser plugin.
   */

  var betaExtensionId = "igcbbdnhomedfadljgcmcfpdcoonihfe";
  /**
   * Names of command response events.
   */

  var commandEventsList = ["devices", "activedevice", "getinstallinfo", "Version", "setmmifocus", "setactivedevice2", "setbusylight", "setremotemmilightaction"];
  /**
   * All possible device events as internal array.
   */

  var eventNamesList = ["mute", "unmute", "device attached", "device detached", "acceptcall", "endcall", "reject", "flash", "online", "offline", "linebusy", "lineidle", "redial", "key0", "key1", "key2", "key3", "key4", "key5", "key6", "key7", "key8", "key9", "keyStar", "keyPound", "keyClear", "Online", "speedDial", "voiceMail", "LineBusy", "outOfRange", "intoRange", "pseudoAcceptcall", "pseudoEndcall", "button1", "button2", "button3", "volumeUp", "volumeDown", "fireAlarm", "jackConnection", "jackDisConnection", "qdConnection", "qdDisconnection", "headsetConnection", "headsetDisConnection", "devlog", "busylight", "hearThrough", "batteryStatus", "gnpButton", "mmi", "error"];

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
  })(exports.ErrorCodes || (exports.ErrorCodes = {}));

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
  })(exports.ErrorReturnCodes || (exports.ErrorReturnCodes = {}));
  /**
   * Custom error returned by commands expecting results when failing.
   */


  var CommandError = /*@__PURE__*/(function (Error) {
    function CommandError(command, errmessage, data) {
      Error.call(this, "Command " + command + " failed with error  message " + errmessage + " and details: " + JSON.stringify(data || {}));
      this.command = command;
      this.errmessage = errmessage;
      this.data = data;
      this.name = "CommandError";
    }

    if ( Error ) CommandError.__proto__ = Error;
    CommandError.prototype = Object.create( Error && Error.prototype );
    CommandError.prototype.constructor = CommandError;

    return CommandError;
  }(Error));
  /**
   * Internal mapping from all known events to array of registered callbacks. All possible events are setup
   * initially. Callbacks values are configured at runtime.
   */

  var eventListeners = new Map();
  eventNamesList.forEach(function (event) { return eventListeners.set(event, []); });

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
  })(exports.DeviceFeature || (exports.DeviceFeature = {}));

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
  })(exports.RemoteMmiType || (exports.RemoteMmiType = {}));

  (function (RemoteMmiSequence) {
    RemoteMmiSequence[RemoteMmiSequence["MMI_LED_SEQUENCE_OFF"] = 0] = "MMI_LED_SEQUENCE_OFF";
    RemoteMmiSequence[RemoteMmiSequence["MMI_LED_SEQUENCE_ON"] = 1] = "MMI_LED_SEQUENCE_ON";
    RemoteMmiSequence[RemoteMmiSequence["MMI_LED_SEQUENCE_SLOW"] = 2] = "MMI_LED_SEQUENCE_SLOW";
    RemoteMmiSequence[RemoteMmiSequence["MMI_LED_SEQUENCE_FAST"] = 3] = "MMI_LED_SEQUENCE_FAST";
  })(exports.RemoteMmiSequence || (exports.RemoteMmiSequence = {}));

  (function (RemoteMmiActionInput) {
    RemoteMmiActionInput[RemoteMmiActionInput["MMI_ACTION_UP"] = 1] = "MMI_ACTION_UP";
    RemoteMmiActionInput[RemoteMmiActionInput["MMI_ACTION_DOWN"] = 2] = "MMI_ACTION_DOWN";
    RemoteMmiActionInput[RemoteMmiActionInput["MMI_ACTION_TAP"] = 4] = "MMI_ACTION_TAP";
    RemoteMmiActionInput[RemoteMmiActionInput["MMI_ACTION_DOUBLE_TAP"] = 8] = "MMI_ACTION_DOUBLE_TAP";
    RemoteMmiActionInput[RemoteMmiActionInput["MMI_ACTION_PRESS"] = 16] = "MMI_ACTION_PRESS";
    RemoteMmiActionInput[RemoteMmiActionInput["MMI_ACTION_LONG_PRESS"] = 32] = "MMI_ACTION_LONG_PRESS";
    RemoteMmiActionInput[RemoteMmiActionInput["MMI_ACTION_X_LONG_PRESS"] = 64] = "MMI_ACTION_X_LONG_PRESS";
  })(exports.RemoteMmiActionInput || (exports.RemoteMmiActionInput = {}));
  /**
   * The log level currently used internally in this api facade. Initially this is set to show errors and
   * warnings until a logEvent (>=0.5) changes this when initializing the extension or when the user
   * changes the log level. Available in the API for testing only - do not use this in normal applications.
   */


  exports.logLevel = 2;
  /**
   * An internal logger helper.
   */

  var logger = new /*@__PURE__*/(function () {
    function anonymous () {}

    anonymous.prototype.trace = function trace (msg) {
      if (exports.logLevel >= 4) {
        console.log(msg);
      }
    };

    anonymous.prototype.info = function info (msg) {
      if (exports.logLevel >= 3) {
        console.log(msg);
      }
    };

    anonymous.prototype.warn = function warn (msg) {
      if (exports.logLevel >= 2) {
        console.warn(msg);
      }
    };

    anonymous.prototype.error = function error (msg) {
      if (exports.logLevel >= 1) {
        console.error(msg);
      }
    };

    return anonymous;
  }())();
  /**
   * A reasonably unique ID for our browser extension client that makes it possible to
   * differentiate between different instances of this api in different browser tabs.
   */

  var apiClientId = Math.random().toString(36).substr(2, 9);
  /**
   * A mapping from unique request ids for commands and the promise information needed
   * to resolve/reject them by an incomming event.
   */

  var sendRequestResultMap = new Map();
  /**
   * A counter used to generate unique request ID's used to match commands and returning events.
   */

  var requestNumber = 1;
  /**
   * Contains initialization information used by the init/shutdown methods.
   */

  var initState = {};
  /**
   * The JavaScript library must be initialized using this function. It returns a promise that
   * resolves when initialization is complete.
   */

  function init() {
    return new Promise(function (resolve, reject) {
      // Only Chrome is currently supported
      var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

      if (!isChrome) {
        return reject(new Error("Jabra Browser Integration: Only supported by <a href='https://google.com/chrome'>Google Chrome</a>."));
      }

      if (initState.initialized || initState.initializing) {
        return reject(new Error("Jabra Browser Integration already initialized"));
      }

      initState.initializing = true;
      sendRequestResultMap.clear();
      var duringInit = true;

      initState.eventCallback = function (event) {
        if (event.source === window && event.data.direction && event.data.direction === "jabra-headset-extension-from-content-script") {
          var eventApiClientId = event.data.apiClientId || "";
          var requestId = event.data.requestId || ""; // Only accept responses from our own requests or from device.

          if (apiClientId === eventApiClientId || eventApiClientId === "") {
            logger.trace("Receiving event from content script: " + JSON.stringify(event.data)); // For backwards compatibility a blank message might be send as "na".

            if (event.data.message === "na") {
              delete event.data.message;
            } // For backward compatability reinterprent messages starting with error as errors:


            if (event.data.message && event.data.message.startsWith("Error:")) {
              event.data.error = event.data.message;
              delete event.data.message;
            }

            if (event.data.message) {
              logger.trace("Got message: " + JSON.stringify(event.data));
              var normalizedMsg = event.data.message.substring(7); // Strip "Event" prefix;

              if (normalizedMsg.startsWith("logLevel")) {
                exports.logLevel = parseInt(event.data.message.substring(16));
                logger.trace("Logger set to level " + exports.logLevel); // Loglevels are internal events and not an indication of proper
                // initialization so skip rest of handling for log levels.

                return;
              }

              var commandIndex = commandEventsList.findIndex(function (e) { return normalizedMsg.startsWith(e); });

              if (commandIndex >= 0) {
                // For install info and version command, we need to add api version number.
                if (normalizedMsg === "getinstallinfo" || normalizedMsg.startsWith("Version ")) {
                  // Old extension/host won't have data so make sure it exists to avoid breakage.
                  if (!event.data.data) {
                    event.data.data = {};
                  }

                  event.data.data.version_jsapi = apiVersion;
                } // For install info also check if the full installation is consistent.


                if (normalizedMsg === "getinstallinfo") {
                  event.data.data.installationOk = isInstallationOk(event.data.data);
                } // Lookup and check that we have identified a (real) command target to pair result with.


                var resultTarget = identifyAndCleanupResultTarget(requestId);

                if (resultTarget) {
                  var result;

                  if (event.data.data) {
                    result = event.data.data;
                  } else {
                    var dataPosition = commandEventsList[commandIndex].length + 1;
                    var dataStr = normalizedMsg.substring(dataPosition);
                    result = {};

                    if (dataStr) {
                      result.legacy_result = dataStr;
                    }
                  }

                  resultTarget.resolve(result);
                } else {
                  var err = "Result target information missing for message " + event.data.message + ". This is likely due to some software components that have not been updated or a software bug. Please upgrade extension and/or chromehost";
                  logger.error(err);
                  notify("error", {
                    error: err,
                    message: event.data.message
                  });
                }
              } else if (eventListeners.has(normalizedMsg)) {
                var clientEvent = JSON.parse(JSON.stringify(event.data));
                delete clientEvent.direction;
                delete clientEvent.apiClientId;
                delete clientEvent.requestId;
                clientEvent.message = normalizedMsg;
                notify(normalizedMsg, clientEvent);
              } else {
                logger.warn("Unknown message: " + event.data.message);
                notify("error", {
                  error: "Unknown message: ",
                  message: event.data.message
                }); // Don't let unknown messages complete initialization so stop here.

                return;
              }

              if (duringInit) {
                duringInit = false;
                return resolve();
              }
            } else if (event.data.error) {
              logger.error("Got error: " + event.data.error);
              var normalizedError = event.data.error.substring(7); // Strip "Error" prefix;
              // Reject target promise if there is one - otherwise send a general error.

              var resultTarget$1 = identifyAndCleanupResultTarget(requestId);

              if (resultTarget$1) {
                resultTarget$1.reject(new CommandError(resultTarget$1.cmd, normalizedError, event.data.data));
              } else {
                var clientError = JSON.parse(JSON.stringify(event.data));
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

      window.addEventListener("message", initState.eventCallback); // Initial getversion and loglevel.

      setTimeout(function () {
        sendCmdWithResult("getversion", null, false).then(function (result) {
          var resultStr = typeof result === "string" || result instanceof String ? result : JSON.stringify(result, null, 2);
          logger.trace("getversion returned successfully with : " + resultStr);
          sendCmd("logLevel", null, false);
        }).catch(function (error) {
          logger.error(error);
        });
      }, 1000); // Check if the web-extension is installed

      setTimeout(function () {
        if (duringInit === true) {
          duringInit = false;
          var extensionId = isBeta ? betaExtensionId : prodExtensionId;
          reject(new Error("Jabra Browser Integration: You need to use this <a href='https://chrome.google.com/webstore/detail/" + extensionId + "'>Extension</a> and then reload this page"));
        }
      }, 5000);
      /**
       * Helper that checks if the installation is consistent.
       */

      function isInstallationOk(installInfo) {
        var browserSdkVersions = [installInfo.version_browserextension, installInfo.version_chromehost, installInfo.version_jsapi]; // Check that we have install information for all components.

        if (browserSdkVersions.some(function (v) { return !v; }) || !installInfo.version_nativesdk) {
          return false;
        } // Check that different beta versions are not mixed.


        if (!browserSdkVersions.map(function (v) {
          var betaIndex = v.lastIndexOf("beta");

          if (betaIndex >= 0 && v.length > betaIndex + 4) {
            return v.substr(betaIndex + 4);
          } else {
            return undefined;
          }
        }).filter(function (v) { return v; }) // @ts-ignore
        .every(function (v, i, arr) { return v === arr[0]; })) {
          return false;
        }

        return true;
      }
      /**
       * Post event/error to subscribers.
       */


      function notify(eventName, eventMsg) {
        var callbacks = eventListeners.get(eventName);

        if (callbacks) {
          callbacks.forEach(function (callback) {
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


      function identifyAndCleanupResultTarget(requestId) {
        // Lookup any previous stored result target information for the request.
        // Nb. requestId's are only provided by >= 0.5 extension and chromehost.
        var resultTarget;

        if (requestId) {
          resultTarget = sendRequestResultMap.get(requestId); // Remember to cleanup to avoid memory leak!

          sendRequestResultMap.delete(requestId);
        } else if (sendRequestResultMap.size === 1) {
          // We don't have a requestId but since only one is being executed we
          // can assume this is the one.
          var value = sendRequestResultMap.entries().next().value;
          resultTarget = value[1]; // Remember to cleanup to avoid memory leak and for future
          // requests like this to be resolved.

          sendRequestResultMap.delete(value[0]);
        } else {
          // No idea what target matches what request - give up.
          resultTarget = undefined;
        } // Warn in case of likely memory leak:


        var mapSize = sendRequestResultMap.size;

        if (mapSize > 10 && mapSize % 10 === 0) {
          // Limit warnings to every 10 size increases to avoid flooding:
          logger.warn("Memory leak found - Request result map is getting too large (size #" + mapSize + ")");
        }

        return resultTarget;
      }

      initState.initialized = true;
      initState.initializing = false;
    });
  }
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
      initState.initialized = false; // Unsubscribe all.
      // @ts-ignore

      eventListeners.forEach(function (value, key) {
        value = [];
      });
      return Promise.resolve();
    }

    return Promise.reject(new Error("Browser integration not initialized"));
  }
  /**
   * Internal helper that returns an array of valid event keys that correspond to the event specificator
   * and are known to exist in our event listener map.
   */

  function getEvents(nameSpec) {
    if (Array.isArray(nameSpec)) {
      // @ts-ignore: Disable wrong "argument not assignable" error in ts 3.4
      return [].concat( new Set([].concat.apply([], nameSpec.map(function (a) { return getEvents(a); }))) );
    } else if (nameSpec instanceof RegExp) {
      return Array.from(eventListeners.keys()).filter(function (key) { return nameSpec.test(key); });
    } else {
      // String
      if (eventListeners.has(nameSpec)) {
        return [nameSpec];
      } else {
        logger.warn("Unknown event " + nameSpec + " ignored when adding/removing eventlistener");
      }
    }

    return [];
  }

  function addEventListener(nameSpec, callback) {
    getEvents(nameSpec).map(function (name) {
      var callbacks = eventListeners.get(name);

      if (!callbacks.find(function (c) { return c === callback; })) {
        callbacks.push(callback);
      }
    });
  }
  function removeEventListener(nameSpec, callback) {
    getEvents(nameSpec).map(function (name) {
      var callbacks = eventListeners.get(name);
      var findIndex = callbacks.findIndex(function (c) { return c === callback; });

      if (findIndex >= 0) {
        callbacks.splice(findIndex, 1);
      }
    });
  }
  /**
   * Activate ringer (if supported) on the Jabra Device
   */

  function ring() {
    sendCmd("ring");
  }
  /**
   * Change state to in-a-call.
   */

  function offHook() {
    sendCmd("offhook");
  }
  /**
   * Change state to idle (not-in-a-call).
   */

  function onHook() {
    sendCmd("onhook");
  }
  /**
   * Mutes the microphone (if supported).
   */

  function mute() {
    sendCmd("mute");
  }
  /**
   * Unmutes the microphone (if supported).
   */

  function unmute() {
    sendCmd("unmute");
  }
  /**
   * Change state to held (if supported).
   */

  function hold() {
    sendCmd("hold");
  }
  /**
   * Change state from held to OffHook (if supported).
   */

  function resume() {
    sendCmd("resume");
  }
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
    var typeVal = numberOrString(type);
    var captureVal = booleanOrString(capture);
    return sendCmdWithResult("setmmifocus", {
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

  function setRemoteMmiLightAction(type, color, effect) {
    var typeVal = numberOrString(type);
    var colorVal = colorOrString(color);
    var effectVal = numberOrString(effect);
    return sendCmdWithResult("setremotemmilightaction", {
      type: typeVal,
      color: colorVal,
      effect: effectVal
    });
  }
  /**
   * Internal helper to get detailed information about the current active Jabra Device
   * from SDK, including current status but excluding media device information.
   */

  function _doGetActiveSDKDevice() {
    return sendCmdWithResult("getactivedevice");
  }
  /**
   * Internal helper to get detailed information about the all attached Jabra Devices
   * from SDK, including current status but excluding media device information.
   */


  function _doGetSDKDevices() {
    return sendCmdWithResult("getdevices");
  }
  /**
   * Get detailed information about the current active Jabra Device, including current status
   * and optionally also including related browser media device information.
   *
   * Note that browser media device information requires mediaDevices.getUserMedia or
   * getUserDeviceMediaExt to have been called so permissions are granted. Browser media information
   * is useful for setting a device constraint on mediaDevices.getUserMedia for input or for calling
   * setSinkId (when supported by the browser) to set output.
   */


  function getActiveDevice(includeBrowserMediaDeviceInfo) {
    if ( includeBrowserMediaDeviceInfo === void 0 ) includeBrowserMediaDeviceInfo = false;

    var includeBrowserMediaDeviceInfoVal = booleanOrString(includeBrowserMediaDeviceInfo);

    if (includeBrowserMediaDeviceInfoVal) {
      return _doGetActiveSDKDevice_And_BrowserDevice();
    } else {
      return _doGetActiveSDKDevice();
    }
  }
  /**
   * List detailed information about all attached Jabra Devices, including current status.
   * and optionally also including related browser media device information.
   *
   * Note that browser media device information requires mediaDevices.getUserMedia or
   * getUserDeviceMediaExt to have been called so permissions are granted. Browser media information
   * is useful for setting a device constraint on mediaDevices.getUserMedia for input or for calling
   * setSinkId (when supported by the browser) to set output.
   */

  function getDevices(includeBrowserMediaDeviceInfo) {
    if ( includeBrowserMediaDeviceInfo === void 0 ) includeBrowserMediaDeviceInfo = false;

    var includeBrowserMediaDeviceInfoVal = booleanOrString(includeBrowserMediaDeviceInfo);

    if (includeBrowserMediaDeviceInfoVal) {
      return _doGetSDKDevices_And_BrowserDevice();
    } else {
      return _doGetSDKDevices();
    }
  }
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
    var idVal = numberOrString(id); // Use both new and old way of passing parameters for compatibility with <= v0.5.

    sendCmd("setactivedevice " + id.toString(), {
      id: idVal
    });
  }
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
    var idVal = numberOrString(id);
    return sendCmdWithResult("setactivedevice2", {
      id: idVal
    });
  }
  /**
   * Set busylight on active device (if supported)
   *
   * @param busy True if busy light should be set, false if it should be cleared.
   */

  function setBusyLight(busy) {
    var busyVal = booleanOrString(busy);
    return sendCmdWithResult("setbusylight", {
      busy: busyVal
    });
  }
  /**
   * Get version number information for all components.
   */

  function getInstallInfo() {
    return sendCmdWithResult("getinstallinfo");
  }
  /**
   * Internal helper that forwards a command to the browser extension
   * without expecting a response.
   */

  function sendCmd(cmd, args, requireInitializedCheck) {
    if ( args === void 0 ) args = null;
    if ( requireInitializedCheck === void 0 ) requireInitializedCheck = true;

    if (!requireInitializedCheck || requireInitializedCheck && initState.initialized) {
      var requestId = (requestNumber++).toString();
      var msg = {
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
  }
  /**
   * Internal helper that forwards a command to the browser extension
   * expecting a response (a promise).
   */


  function sendCmdWithResult(cmd, args, requireInitializedCheck) {
    if ( args === void 0 ) args = null;
    if ( requireInitializedCheck === void 0 ) requireInitializedCheck = true;

    if (!requireInitializedCheck || requireInitializedCheck && initState.initialized) {
      var requestId = (requestNumber++).toString();
      return new Promise(function (resolve, reject) {
        sendRequestResultMap.set(requestId, {
          cmd: cmd,
          resolve: resolve,
          reject: reject
        });
        var msg = {
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
  }
  /**
   * Configure an audio html element on a webpage to use jabra audio device as speaker output. Returns a promise with boolean success status.
   * The deviceInfo argument must come from getDeviceInfo or getUserDeviceMediaExt calls.
   */


  function trySetDeviceOutput(audioElement, deviceInfo) {
    if (!audioElement || !deviceInfo) {
      return Promise.reject(new Error("Call to trySetDeviceOutput has argument(s) missing"));
    }

    if (!(typeof audioElement.setSinkId === "function")) {
      return Promise.reject(new Error("Your browser does not support required Audio Output Devices API"));
    }

    return audioElement.setSinkId(deviceInfo.browserAudioOutputId).then(function () {
      var success = audioElement.sinkId === deviceInfo.browserAudioOutputId;
      return success;
    });
  }
  /**
   * Checks if a Jabra Input device is in fact selected in a media stream.
   * The deviceInfo argument must come from getDeviceInfo or getUserDeviceMediaExt calls.
   */

  function isDeviceSelectedForInput(mediaStream, deviceInfo) {
    if (!mediaStream || !deviceInfo) {
      throw Error("Call to isDeviceSelectedForInput has argument(s) missing");
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
      return Promise.reject(new Error("Your browser does not support required media api"));
    } // Init completed ?


    if (!initState.initialized) {
      return Promise.reject(new Error("Browser integration not initialized"));
    } // Warn of degraded UX experience unless we are running https.


    if (location.protocol !== "https:") {
      logger.warn("This function needs to run under https for best UX experience (persisted permissions)");
    } // Check input validity:


    if (constraints !== undefined && constraints !== null && typeof constraints !== "object") {
      return Promise.reject(new Error("Optional constraints parameter must be an object"));
    }
    /**
     * Utility method that combines constraints with ours taking precedence (deep).
     */


    function mergeConstraints(ours, theirs) {
      if (theirs !== null && theirs !== undefined && typeof ours === "object") {
        var result = {};

        for (var attrname in theirs) {
          result[attrname] = theirs[attrname];
        }

        for (var attrname in ours) {
          result[attrname] = mergeConstraints(ours[attrname], theirs[attrname]);
        } // Ours takes precedence.


        return result;
      } else {
        return ours;
      }
    } // If we have the input device id already we can do a direct call to getUserMedia, otherwise we have to do
    // an initial general call to getUserMedia just get access to looking up the input device and then a second
    // call to getUserMedia to make sure the Jabra input device is selected.


    return navigator.mediaDevices.getUserMedia(mergeConstraints({
      audio: true
    }, constraints)).then(function (dummyStream) {
      return _doGetActiveSDKDevice_And_BrowserDevice().then(function (deviceInfo) {
        // Shutdown initial dummy stream (not sure it is really required but let's be nice).
        dummyStream.getTracks().forEach(function (track) {
          track.stop();
        });

        if (deviceInfo && deviceInfo.browserAudioInputId) {
          return navigator.mediaDevices.getUserMedia(mergeConstraints({
            audio: {
              deviceId: deviceInfo.browserAudioInputId
            }
          }, constraints)).then(function (stream) {
            return {
              stream: stream,
              deviceInfo: deviceInfo
            };
          });
        } else {
          return Promise.reject(new Error("Could not find a Jabra device with a microphone"));
        }
      });
    });
  }
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
            if (i == 0) { costs[j] = j; }else {
              if (j > 0) {
                var newValue = costs[j - 1];
                if (s1.charAt(i - 1) != s2.charAt(j - 1)) { newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1; }
                costs[j - 1] = lastValue;
                lastValue = newValue;
              }
            }
          }

          if (i > 0) { costs[s2.length] = lastValue; }
        }

        return costs[s2.length];
      } // Levenshtein distance helper adapted from
      // https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely


      function levenshteinDistance(s1, s2) {
        var longer = s1;
        var shorter = s2;

        if (s1.length < s2.length) {
          longer = s2;
          shorter = s1;
        }

        var longerLength = longer.length;

        if (longerLength === 0) {
          return 1.0;
        }

        return (longerLength - editDistance(longer, shorter)) / longerLength;
      }

      if (mediaDeviceNameCandidates.length == 1) {
        return 0;
      } else if (mediaDeviceNameCandidates.length > 0) {
        var similarities = mediaDeviceNameCandidates.map(function (candidate) {
          if (candidate.includes("(" + sdkDeviceName + ")")) {
            return 1.0;
          } else {
            // Remove Standard/Default prefix from label in Chrome when comparing
            var prefixEnd = candidate.indexOf(" - ");
            var cleanedCandidate = prefixEnd >= 0 ? candidate.substring(prefixEnd + 3) : candidate;
            return levenshteinDistance(sdkDeviceName, cleanedCandidate);
          }
        });
        var bestMatchIndex = similarities.reduce(function (prevIndexMax, value, i, a) { return value > a[prevIndexMax] ? i : prevIndexMax; }, 0);
        return bestMatchIndex;
      } else {
        return -1;
      }
    } // Find matching pair input or output device.


    function findMatchingMediaDevice(groupId, kind, src) {
      return src.find(function (md) { return md.groupId == groupId && md.kind == kind; });
    }

    if (deviceInfo && deviceInfo.deviceName) {
      var groupId = undefined;
      var audioInputId = undefined;
      var audioOutputId = undefined;
      var label = undefined; // Filter out non Jabra input/output devices:

      var jabraMediaDevices = mediaDevices.filter(function (device) { return device.label && device.label.toLowerCase().includes("jabra") && (device.kind === "audioinput" || device.kind === "audiooutput"); });
      var someJabraDeviceIndex = findBestMatchIndex(deviceInfo.deviceName, jabraMediaDevices.map(function (md) { return md.label; }));

      if (someJabraDeviceIndex >= 0) {
        var foundDevice = jabraMediaDevices[someJabraDeviceIndex];
        groupId = foundDevice.groupId;
        label = foundDevice.label;

        if (foundDevice.kind === "audioinput") {
          audioInputId = foundDevice.deviceId; // Lookup matching output device:

          var outputDevice = findMatchingMediaDevice(groupId, "audiooutput", jabraMediaDevices);

          if (outputDevice) {
            audioOutputId = outputDevice.deviceId;
          }
        } else if (foundDevice.kind === "audiooutput") {
          audioOutputId = foundDevice.deviceId; // Lookup matching output input device:

          var inputDevice = findMatchingMediaDevice(groupId, "audioinput", jabraMediaDevices);

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
      return Promise.reject(new Error("Your browser does not support required media api"));
    } // Init completed ?


    if (!initState.initialized) {
      return Promise.reject(new Error("Browser integration not initialized"));
    } // Browser security rules (for at least chrome) requires site to run under https for labels to be read.


    if (location.protocol !== "https:") {
      return Promise.reject(new Error("Your browser needs https for lookup to work"));
    }

    return Promise.all([_doGetSDKDevices(), navigator.mediaDevices.enumerateDevices()]).then(function (ref) {
      var deviceInfos = ref[0];
      var mediaDevices = ref[1];

      deviceInfos.forEach(function (deviceInfo) {
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
      return Promise.reject(new Error("Your browser does not support required media api"));
    } // Init completed ?


    if (!initState.initialized) {
      return Promise.reject(new Error("Browser integration not initialized"));
    } // Browser security rules (for at least chrome) requires site to run under https for labels to be read.


    if (location.protocol !== "https:") {
      return Promise.reject(new Error("Your browser needs https for lookup to work"));
    } // enumerateDevices requires user to have provided permission using getUserMedia for labels to be filled out.


    return Promise.all([_doGetActiveSDKDevice(), navigator.mediaDevices.enumerateDevices()]).then(function (ref) {
      var deviceInfo = ref[0];
      var mediaDevices = ref[1];

      fillInMatchingMediaInfo(deviceInfo, mediaDevices);
      return deviceInfo;
    });
  }
  /**
   * Helper that pass boolean values through and parses strings to booleans.
   */


  function booleanOrString(arg) {
    if (arg !== "" && (typeof arg === "string" || arg instanceof String)) {
      return arg === "true" || arg === "1";
    } else if (typeof arg === "boolean") {
      return arg;
    } else {
      throw new Error("Illegal/missing argument - boolean or string expected");
    }
  }
  /**
   * Helper that pass numbers through and parses strings to numbers.
   */


  function numberOrString(arg) {
    if (arg !== "" && (typeof arg === "string" || arg instanceof String)) {
      return parseInt(arg);
    } else if (typeof arg == "number") {
      return arg;
    } else {
      throw new Error("Illegal/missing argument - number or string expected");
    }
  }
  /**
   * Helper that pass color array through and converts values to color array.
   */


  function colorOrString(arg) {
    if (arg !== "" && (typeof arg === "string" || arg instanceof String)) {
      var combinedValue = parseInt(arg, 16);
      return [combinedValue >> 16 & 255, combinedValue >> 8 & 255, combinedValue & 255];
    } else if (typeof arg == "number") {
      var combinedValue$1 = arg;
      return [combinedValue$1 >> 16 & 255, combinedValue$1 >> 8 & 255, combinedValue$1 & 255];
    } else if (Array.isArray(arg)) {
      if (arg.length != 3) {
        throw new Error("Illegal argument - wrong dimension of number array (3 expected)");
      }

      return arg;
    } else {
      throw new Error("Illegal/missing argument - number array or hex string expected");
    }
  }
  /**
   * Hidden implementation code for device analytics.
   */
  // namespace DeviceAnalyticsInternals {
  //   enum EventType {
  //     BoomArmEvent,
  //     TxLevelEvent,
  //     RxLevelEvent,
  //     TxLevelPeakEvent,
  //     RxLevelPeakEvent,
  //     RxSpeechEvent,
  //     TxSpeechEvent,
  //     StartCallEvent,
  //     EndCallEvent,
  //     BadMicDetectFlagEvent
  //   }
  //   interface TimedData {
  //     eventType: EventType;
  //     ticks: number;
  //     i: number;
  //     b: boolean;
  //   }
  //   // @ts-ignore
  //   function compareTimedData(a: TimedData, b: TimedData) {
  //     // First sort by time.
  //     let timeComp = Math.sign(a.ticks - b.ticks);
  //     // Secondly sort so start/end events are first/last (surround other events).
  //     if (timeComp == 0 && a.eventType != b.eventType) {
  //       if (
  //         a.eventType == EventType.StartCallEvent ||
  //         b.eventType == EventType.EndCallEvent
  //       ) {
  //         return -1;
  //       } else if (
  //         a.eventType == EventType.EndCallEvent ||
  //         b.eventType == EventType.StartCallEvent
  //       ) {
  //         return +1;
  //       }
  //     }
  //     return timeComp;
  //   }
  //   export class DeviceAnalytics {
  //     // @ts-ignore
  //     private sortedTimedEvents: TimedData[];
  //     static readonly MaxElementsInCall = 20000;
  //     static readonly MaxElementsAddedOutsideCall = 400;
  //     // @ts-ignore
  //     private startCallIndex: number = -1;
  //     // @ts-ignore
  //     private endCallIndex: number = -1;
  //     // @ts-ignore
  //     constructor(deviceId: number) {
  //       this.sortedTimedEvents = new Array<TimedData>();
  //     }
  //   }
  // }

  /**
   * Public Analytics API as a class that clients must expressly instantiate to use.
   */
  // export class Analytics {
  //   private deviceAnalyticsPerDeviceId: Map<
  //     number,
  //     DeviceAnalyticsInternals.DeviceAnalytics
  //   >;
  //   constructor() {
  //     this.deviceAnalyticsPerDeviceId = new Map<
  //       number,
  //       DeviceAnalyticsInternals.DeviceAnalytics
  //     >();
  //     // Auto-subscribe for devlog events.
  //     addEventListener('devlog', event => {
  //       let deviceAnalytics = this.deviceAnalyticsPerDeviceId.get(
  //         event.data.deviceID
  //       );
  //       if (!deviceAnalytics) {
  //         this.deviceAnalyticsPerDeviceId.set(
  //           event.data.deviceID,
  //           (deviceAnalytics = new DeviceAnalyticsInternals.DeviceAnalytics(
  //             event.data.deviceID
  //           ))
  //         );
  //       }
  //       // TODO: Impl.
  //     });
  //   }
  //   // TODO Finish API here.
  // }

  var EventEmitter = function EventEmitter() {
    this.listeners = new Map();
  };
  /**
   * Add a function to be called when a specific type of event is emitted.
   *
   * @param {T} type
   * @param {EventEmitterListener<V>} listener
   * @memberof EventEmitter
   */


  EventEmitter.prototype.addEventListener = function addEventListener (type, listener) {
    var listeners = this.listeners.get(type) || [];
    this.listeners.set(type, listeners.concat( [listener]));
  };
  /**
   * Add a function to be called when a specific type of event is emitted.
   *
   * @param {T} type
   * @param {EventEmitterListener<V>} listener
   * @memberof EventEmitter
   */


  EventEmitter.prototype.on = function on (type, listener) {
    this.addEventListener(type, listener);
  };
  /**
   * Remove an event listener that was previously added.
   *
   * @param {T} type
   * @param {EventEmitterListener<V>} listener
   * @memberof EventEmitter
   */


  EventEmitter.prototype.removeEventListener = function removeEventListener (type, listener) {
    var listeners = this.listeners.get(type) || [];
    this.listeners.set(type, listeners.filter(function (l) { return l !== listener; }));
  };
  /**
   * Remove an event listener that was previously added.
   *
   * @param {T} type
   * @param {EventEmitterListener<V>} listener
   * @memberof EventEmitter
   */


  EventEmitter.prototype.off = function off (type, listener) {
    this.removeEventListener(type, listener);
  };
  /**
   * Emit an event of specific type, and supply what value to pass to the
   * listener.
   *
   * @param {T} type
   * @param {V} event
   * @returns
   * @memberof EventEmitter
   */


  EventEmitter.prototype.emit = function emit (type, value) {
    var listeners = this.listeners.get(type);
    if (!listeners) { return; }
    listeners.forEach(function (listener) {
      listener(value);
    });
  };

  var jabraEventTypes = {
    Speech_Analysis_TX: {
      eventType: "txspeech",
      valueType: "boolean"
    },
    Speech_Analysis_RX: {
      eventType: "rxspeech",
      valueType: "boolean"
    },
    "TX Acoustic Logging Level": {
      eventType: "txacousticlevel",
      valueType: "number"
    },
    "RX Acoustic Logging Level": {
      eventType: "rxacousticlevel",
      valueType: "number"
    },
    "TX Acoustic Logging Peak": {
      eventType: "txacousticpeak",
      valueType: "number"
    },
    "RX Acoustic Logging Peak": {
      eventType: "rxacousticpeak",
      valueType: "number"
    },
    "Boom Position Guidance OK": {
      eventType: "armpositionok",
      valueType: "boolean"
    },
    "Bad_Mic_detect Flag": {
      eventType: "badmic",
      valueType: "boolean"
    },
    "Mute State": {
      eventType: "mute",
      valueType: "boolean"
    }
  };
  var AnalyticsEvent = function AnalyticsEvent(type, value, timestamp) {
    this.type = type;
    this.value = value;
    this.timestamp = timestamp || Date.now();
  };
  function createAnalyticsEvent(event) {
    if ("ID" in event.data) {
      switch (event.data.ID) {
        case "VOLUP TAP":
          return new AnalyticsEvent("volumeup", true, event.data.TimeStampMs);

        case "VOLDOWN TAP":
          return new AnalyticsEvent("volumedown", true, event.data.TimeStampMs);
      }
    }

    for (var jabraEventType in jabraEventTypes) {
      if (jabraEventType in event.data) {
        var translation = jabraEventTypes[jabraEventType]; // @ts-ignore

        var value = event.data[jabraEventType];

        switch (translation.valueType) {
          case "boolean":
            value = value.toLowerCase() === "true";
            break;

          case "number":
            value = Number(value);
            break;

          default:
            break;
        }

        return new AnalyticsEvent(translation.eventType, value, event.data.TimeStampMs);
      }
    }

    return null;
  }

  var AnalyticsEventLog = function AnalyticsEventLog() {
    // An array of events sorted by the time it was emitted.
    this.events = [];
  }; // Asuming this.events is sorted, add an event while maintaining order.


  AnalyticsEventLog.prototype.add = function add (event) {
    // Find the index of the first event older than current event.
    var index = this.events.findIndex(function (e) {
      return event.timestamp < e.timestamp;
    }); // If event is older than any other event, add to back of event log

    if (index === -1) { index = this.events.length; } // Add all events before current event, current event, and all events after
    // current event

    this.events = this.events.slice(0, index).concat( [event], this.events.slice(index)); // Return parsed AnalyticsEvent

    return event;
  };
  /**
   * Get the newest event in the events log, optionally fitler by eventType
   *
   * @param {string} [eventType]
   * @returns newest event
   * @memberof AnalyticsEventLog
   */


  AnalyticsEventLog.prototype.newest = function newest (eventType) {
    // If eventType has been specified return last event with that type
    if (eventType) {
      for (var i = this.events.length - 1; i > 0; i--) {
        var event = this.events[i];
        if (event.type === eventType) { return event; }
      }

      return null;
    } // Else return last event of array


    return this.events[this.events.length - 1] || null;
  };
  /**
   *
   *
   * @param {AnalyticsEventLogListFilter} [filter]
   * @returns matching list of events
   * @memberof AnalyticsEventLog
   */


  AnalyticsEventLog.prototype.list = function list (filter) {
    var events = this.events;

    if (filter) {
      var eventType = filter.eventType;
        var limit = filter.limit;
        var interval = filter.interval;
        var limitEvent = filter.limitEvent;
        var offsetEvent = filter.offsetEvent;

      if (limitEvent) {
        events = events.slice(0, this.events.indexOf(limitEvent));
      }

      if (offsetEvent) {
        events = events.slice(this.events.indexOf(offsetEvent));
      }

      if (eventType || interval) {
        events = events.filter(function (ref) {
            var type = ref.type;
            var timestamp = ref.timestamp;

          if (eventType && !eventType.includes(type)) { return false; }
          if (interval && interval.start && timestamp < interval.start) { return false; }
          if (interval && interval.end && timestamp > interval.end) { return false; }
          return true;
        });
      }

      if (limit) {
        events = limit > 0 ? events.slice(0, limit) : events.slice(limit);
      }
    }

    return events;
  };

  AnalyticsEventLog.prototype.clear = function clear () {
    this.events = [];
  };

  var Analytics = /*@__PURE__*/(function (EventEmitter$$1) {
    function Analytics() {
      var this$1 = this;

      EventEmitter$$1.call(this);
      /**
       * The event log containing all the events happening when analytics start
       *
       * @private
       * @memberof Analytics
       */

      this.events = new AnalyticsEventLog();
      addEventListener("devlog", function (devlogEvent) {
        // opt out if not running
        if (!this$1.startTime || this$1.stopTime) { return; } // Since devlog events can be recieved out of order, add event to the
        // event log, which will maintain an ordered list of events.

        var event = createAnalyticsEvent(devlogEvent);

        if (event) {
          this$1.events.add(event);
          this$1.emit(event.type, event);
        }
      });
    }

    if ( EventEmitter$$1 ) Analytics.__proto__ = EventEmitter$$1;
    Analytics.prototype = Object.create( EventEmitter$$1 && EventEmitter$$1.prototype );
    Analytics.prototype.constructor = Analytics;
    /**
     * Starts the analytics module
     *
     * @memberof Analytics
     */


    Analytics.prototype.start = function start () {
      this.clear();
      this.startTime = Date.now();
      this.stopTime = undefined;
    };
    /**
     * Stops the analytics module
     *
     * @memberof Analytics
     */


    Analytics.prototype.stop = function stop () {
      this.stopTime = Date.now();
    };
    /**
     * Clears the event history of the analytics module
     *
     * @memberof Analytics
     */


    Analytics.prototype.clear = function clear () {
      this.events.clear();
    };
    /**
     * Get whether the transmitter or receiver is talking, and whether there's
     * crosstalk or silence
     *
     * @returns {SpeechStatus}
     * @memberof Analytics
     */


    Analytics.prototype.getSpeechStatus = function getSpeechStatus () {
      var txspeech = this.events.newest("txspeech");
      var rxspeech = this.events.newest("rxspeech");
      var isTXSpeaking = txspeech ? txspeech.value : false;
      var isRXSpeaking = rxspeech ? rxspeech.value : false;
      var isCrosstalking = isTXSpeaking && isRXSpeaking;
      var isSilent = !isTXSpeaking && !isRXSpeaking;
      return {
        isSilent: isSilent,
        isCrosstalking: isCrosstalking,
        isTXSpeaking: isCrosstalking ? false : isTXSpeaking,
        isRXSpeaking: isCrosstalking ? false : isRXSpeaking
      };
    };
    /**
     * Get time the transmitter or reciver has talked, and how long there's
     * been crosstalk or silence
     *
     * @param {number} [fromTime]
     * @param {number} [toTime]
     * @returns {SpeechTime}
     * @memberof Analytics
     */


    Analytics.prototype.getSpeechTime = function getSpeechTime (fromTime, toTime) {
      var query = {
        eventType: "txspeech rxspeech"
      };

      if (fromTime && toTime) {
        query.interval = {
          start: fromTime,
          end: toTime
        };
      }

      var events = this.events.list(query);
      var startTime = fromTime || this.startTime || 0;
      var endTime = toTime || this.stopTime || Date.now();
      var txDuration = 0;
      var txStartEvent;
      var rxDuration = 0;
      var rxStartEvent;
      var crosstalkDuration = 0;
      var crosstalkStartEvent;

      if (fromTime && toTime) {
        var firstTXEventBeforeInterval = this.events.list({
          eventType: "txspeech",
          limitEvent: events[0],
          limit: -1
        })[0];
        var firstRXEventBeforeInterval = this.events.list({
          eventType: "rxspeech",
          limitEvent: events[0],
          limit: -1
        })[0]; // if tx was speaking before interval, we assume they are still speaking,
        // and add an event to the event list with the timestamp being the
        // startTime of the interval

        if (firstTXEventBeforeInterval && firstTXEventBeforeInterval.value === true) {
          events.unshift(new AnalyticsEvent("txspeech", true, startTime));
        } // if rx was speaking before interval, we assume they are still speaking,
        // and add an event to the event list with the timestamp being the
        // startTime of the interval


        if (firstRXEventBeforeInterval && firstRXEventBeforeInterval.value === true) {
          events.unshift(new AnalyticsEvent("rxspeech", true, startTime));
        } // to ensure correct calculations we pad stopping events, to the end of
        // the events list


        events.push(new AnalyticsEvent("txspeech", false, endTime), new AnalyticsEvent("rxspeech", false, endTime));
      }

      for (var i = 0, list = events; i < list.length; i += 1) {
        var event = list[i];

        var isTXEvent = event.type === "txspeech";
        var isRXEvent = event.type === "rxspeech"; // if tx starts talking, and isn't already talking, mark start event

        if (isTXEvent && event.value === true && !txStartEvent) {
          txStartEvent = event;
        } // if rx starts talking, and isn't already talking, mark start event


        if (isRXEvent && event.value === true && !rxStartEvent) {
          rxStartEvent = event;
        } // if tx stops talking, and has been talking


        if (isTXEvent && event.value === false && txStartEvent) {
          // if has been crosstalking, add to crosstalk duration
          if (crosstalkStartEvent) {
            crosstalkDuration += event.timestamp - crosstalkStartEvent.timestamp;
            crosstalkStartEvent = undefined; // mark event as new start event for rx

            if (rxStartEvent) { rxStartEvent = event; }
          } // if hasn't been crosstalking, add to tx duration
          else {
              txDuration += event.timestamp - txStartEvent.timestamp;
            }

          txStartEvent = undefined;
        } // if rx stops talking, and has been talking


        if (isRXEvent && event.value === false && rxStartEvent) {
          // if has been crosstalking, add to crosstalk duration
          if (crosstalkStartEvent) {
            crosstalkDuration += event.timestamp - crosstalkStartEvent.timestamp;
            crosstalkStartEvent = undefined;
            if (txStartEvent) { txStartEvent = event; }
          } // if hasn't been crosstalking, add to rx duration
          else {
              rxDuration += event.timestamp - rxStartEvent.timestamp;
            }

          rxStartEvent = undefined;
        } // if both tx and rx is talking,


        if (txStartEvent && rxStartEvent && !crosstalkStartEvent) {
          // mark event as the start of crosstalk
          crosstalkStartEvent = event; // if tx started crosstalk, add duration to rx duration

          if (isTXEvent) {
            rxDuration += event.timestamp - rxStartEvent.timestamp;
          } // if rx started crosstalk, add duration to tx duration


          if (isRXEvent) {
            txDuration += event.timestamp - txStartEvent.timestamp;
          }
        }
      }

      var totalTime = endTime - startTime;
      var silenceTime = totalTime - (txDuration + rxDuration + crosstalkDuration);

      var calculatePercentage = function (duration) {
        var pct = 100 * duration / totalTime; //@ts-ignore

        return +(Math.round(pct + "e+2") + "e-2");
      };

      return {
        totalTime: totalTime,
        txSpeechTime: txDuration,
        txSpeechTimePct: calculatePercentage(txDuration),
        rxSpeechTime: rxDuration,
        rxSpeechTimePct: calculatePercentage(rxDuration),
        crosstalkTime: crosstalkDuration,
        crosstalkTimePct: calculatePercentage(crosstalkDuration),
        silenceTime: silenceTime,
        silenceTimePct: calculatePercentage(silenceTime)
      };
    };
    /**
     * Get whether or not the headset is muted
     *
     * @returns {boolean} - muted status
     * @memberof Analytics
     */


    Analytics.prototype.getMutedStatus = function getMutedStatus () {
      var event = this.events.newest("mute");
      return event ? event.value : false;
    };
    /**
     * Get the number of times the headset has been muted
     *
     * @returns {number} - muted count
     * @memberof Analytics
     */


    Analytics.prototype.getMutedCount = function getMutedCount () {
      return this.events.list({
        eventType: "mute"
      }).filter(function (event) { return event.value; }).length;
    };
    /**
     * Get the boom arm position status
     *
     * @returns {(boolean | undefined)}
     * @memberof Analytics
     */


    Analytics.prototype.getBoomArmStatus = function getBoomArmStatus () {
      var event = this.events.newest("boomarm");
      return event ? event.value : undefined;
    };
    /**
     * Get the number of times the boom arm has been misaligned
     *
     * @returns {number}
     * @memberof Analytics
     */


    Analytics.prototype.getBoomArmMisalignedCount = function getBoomArmMisalignedCount () {
      return this.events.list({
        eventType: "boomarm"
      }).filter(function (event) { return event.value; }).length;
    };
    /**
     * Get the number of times the volume has been increased
     *
     * @returns {number}
     * @memberof Analytics
     */


    Analytics.prototype.getVolumeUpCount = function getVolumeUpCount () {
      return this.events.list({
        eventType: "volumeup"
      }).filter(function (event) { return event.value; }).length;
    };
    /**
     * Get the number of times the volume has been decreased
     *
     * @returns {number}
     * @memberof Analytics
     */


    Analytics.prototype.getVolumeDownCount = function getVolumeDownCount () {
      return this.events.list({
        eventType: "volumedown"
      }).filter(function (event) { return event.value; }).length;
    };
    /**
     * Get the audio exposure level
     *
     * @returns {number}
     * @memberof Analytics
     */


    Analytics.prototype.getAudioExposure = function getAudioExposure (limit) {
      if ( limit === void 0 ) limit = -15;

      return this.events.list({
        limit: limit,
        eventType: "rxacousticlevel"
      });
    };
    /**
     * Get the average audio exposure level over a time interval
     *
     * @returns {number}
     * @memberof Analytics
     */


    Analytics.prototype.getAverageAudioExposure = function getAverageAudioExposure (fromTime, toTime) {
      return this.getAverageAcousticLevel("rxacousticlevel", fromTime, toTime);
    };
    /**
     * Get the average background noise level
     *
     * @returns {number}
     * @memberof Analytics
     */


    Analytics.prototype.getBackgroundNoise = function getBackgroundNoise (limit) {
      if ( limit === void 0 ) limit = -15;

      return this.events.list({
        limit: limit,
        eventType: "txacousticlevel"
      });
    };
    /**
     * Get the average background noise level over a time interval
     *
     * @returns {number}
     * @memberof Analytics
     */


    Analytics.prototype.getAverageBackgroundNoise = function getAverageBackgroundNoise (fromTime, toTime) {
      return this.getAverageAcousticLevel("txacousticlevel", fromTime, toTime);
    };
    /**
     * Get the average acoustic level level over a time interval, a private method
     * used for getAverageAudioExposure and getAverageBackgroundNoise
     *
     * @returns {number}
     * @memberof Analytics
     */


    Analytics.prototype.getAverageAcousticLevel = function getAverageAcousticLevel (eventType, fromTime, toTime) {
      var events = [];

      if (fromTime && toTime) {
        var eventsWithinInterval = this.events.list({
          eventType: eventType,
          interval: {
            start: fromTime,
            end: toTime
          }
        });
        var firstEventBeforeInterval = this.events.list({
          eventType: eventType,
          limitEvent: eventsWithinInterval[0],
          limit: -1
        });
        events = firstEventBeforeInterval.concat( eventsWithinInterval);
      } else {
        events = this.events.list({
          eventType: eventType
        });
      } // If no events was found, the headset hasn't reported an acoustic level yet


      if (events.length === 0) { return 0; } // If only one event was found, the average is the value of event

      if (events.length === 1) { return events[0].value; }
      var sum = 0;
      var totalWeight = 0; // Iterate every event and calculate sum and weight

      for (var i = 0; i < events.length - 1; i++) {
        var eventA = events[i];
        var eventB = events[i + 1]; // weight is the number of miliseconds the acoustic level as active

        var weight = eventB.timestamp - eventA.timestamp;
        sum += weight * eventA.value;
        totalWeight += weight;
      } // return the weighted average


      return Math.round(sum / totalWeight);
    };

    return Analytics;
  }(EventEmitter));

  exports.apiVersion = apiVersion;
  exports.CommandError = CommandError;
  exports.init = init;
  exports.shutdown = shutdown;
  exports.addEventListener = addEventListener;
  exports.removeEventListener = removeEventListener;
  exports.ring = ring;
  exports.offHook = offHook;
  exports.onHook = onHook;
  exports.mute = mute;
  exports.unmute = unmute;
  exports.hold = hold;
  exports.resume = resume;
  exports.setMmiFocus = setMmiFocus;
  exports.setRemoteMmiLightAction = setRemoteMmiLightAction;
  exports.getActiveDevice = getActiveDevice;
  exports.getDevices = getDevices;
  exports._setActiveDeviceId = _setActiveDeviceId;
  exports.setActiveDeviceId = setActiveDeviceId;
  exports.setBusyLight = setBusyLight;
  exports.getInstallInfo = getInstallInfo;
  exports.trySetDeviceOutput = trySetDeviceOutput;
  exports.isDeviceSelectedForInput = isDeviceSelectedForInput;
  exports.getUserDeviceMediaExt = getUserDeviceMediaExt;
  exports.Analytics = Analytics;

})));
//# sourceMappingURL=jabra.browser.integration-3.0.umd.js.map
