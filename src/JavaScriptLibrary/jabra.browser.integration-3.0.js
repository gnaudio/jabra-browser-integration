(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.jabra = {}));
}(this, (function (exports) { 'use strict';

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelperLoose(o) {
    var i = 0;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    i = o[Symbol.iterator]();
    return i.next.bind(i);
  }

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
  var apiVersion = "3.0.0-beta.8";
  /**
   * Is the current version a beta ?
   */

  var isBeta = /*#__PURE__*/apiVersion.includes("beta");
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


  var CommandError = /*#__PURE__*/function (_Error) {
    _inheritsLoose(CommandError, _Error);

    function CommandError(command, errmessage, data) {
      var _this;

      _this = _Error.call(this, "Command " + command + " failed with error  message " + errmessage + " and details: " + JSON.stringify(data || {})) || this;
      _this.command = command;
      _this.errmessage = errmessage;
      _this.data = data;
      _this.name = "CommandError";
      return _this;
    }

    return CommandError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));
  /**
   * Internal mapping from all known events to array of registered callbacks. All possible events are setup
   * initially. Callbacks values are configured at runtime.
   */

  var eventListeners = /*#__PURE__*/new Map();
  eventNamesList.forEach(function (event) {
    return eventListeners.set(event, []);
  });

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
    RemoteMmiType[RemoteMmiType["MMI_TYPE_BUSYLIGHT"] = 128] = "MMI_TYPE_BUSYLIGHT";
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

  var logger = /*#__PURE__*/new ( /*#__PURE__*/function () {
    function _class() {}

    var _proto = _class.prototype;

    _proto.trace = function trace(msg) {
      if (exports.logLevel >= 4) {
        console.log(msg);
      }
    };

    _proto.info = function info(msg) {
      if (exports.logLevel >= 3) {
        console.log(msg);
      }
    };

    _proto.warn = function warn(msg) {
      if (exports.logLevel >= 2) {
        console.warn(msg);
      }
    };

    _proto.error = function error(msg) {
      if (exports.logLevel >= 1) {
        console.error(msg);
      }
    };

    return _class;
  }())();
  /**
   * A reasonably unique ID for our browser extension client that makes it possible to
   * differentiate between different instances of this api in different browser tabs.
   */

  var apiClientId = /*#__PURE__*/Math.random().toString(36).substr(2, 9);
  /**
   * A mapping from unique request ids for commands and the promise information needed
   * to resolve/reject them by an incomming event.
   */

  var sendRequestResultMap = /*#__PURE__*/new Map();
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

              var commandIndex = commandEventsList.findIndex(function (e) {
                return normalizedMsg.startsWith(e);
              });

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

              var _resultTarget = identifyAndCleanupResultTarget(requestId);

              if (_resultTarget) {
                _resultTarget.reject(new CommandError(_resultTarget.cmd, normalizedError, event.data.data));
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
        })["catch"](function (error) {
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

        if (browserSdkVersions.some(function (v) {
          return !v;
        }) || !installInfo.version_nativesdk) {
          return false;
        } // Check that different beta versions are not mixed.
        // For example: This means that a beta-7 api is not
        // considered compatible with a beta-6 chromehost
        // or extension.


        if (!browserSdkVersions.map(function (v) {
          var betaIndex = v.lastIndexOf("beta");

          if (betaIndex >= 0 && v.length > betaIndex + 4) {
            return v.substr(betaIndex + 4);
          } else {
            return undefined;
          }
        }).filter(function (v) {
          return v;
        }) // @ts-ignore
        .every(function (v, i, arr) {
          return v === arr[0];
        })) {
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

          sendRequestResultMap["delete"](requestId);
        } else if (sendRequestResultMap.size === 1) {
          // We don't have a requestId but since only one is being executed we
          // can assume this is the one.
          var value = sendRequestResultMap.entries().next().value;
          resultTarget = value[1]; // Remember to cleanup to avoid memory leak and for future
          // requests like this to be resolved.

          sendRequestResultMap["delete"](value[0]);
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
      });
      return Promise.resolve();
    }

    return Promise.reject(new Error("Browser integration not initialized"));
  }
  /**
   * Internal helper that returns an array of valid event keys that correspond to the event specificator
   * and are known to exist in our event listener map.
   * Nb. For internal use only - may be changed at any time.
   */

  function _getEvents(nameSpec) {
    if (Array.isArray(nameSpec)) {
      var allStrings = [].concat.apply([], nameSpec.map(function (a) {
        return _getEvents(a);
      }));
      var allUniqueStrings = Array.from(new Set(allStrings).values());
      return [].concat(allUniqueStrings);
    } else if (nameSpec instanceof RegExp) {
      return Array.from(eventListeners.keys()).filter(function (key) {
        return nameSpec.test(key);
      });
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
    var events = _getEvents(nameSpec);

    events.map(function (name) {
      var callbacks = eventListeners.get(name);

      if (!callbacks.find(function (c) {
        return c === callback;
      })) {
        callbacks.push(callback);
      }
    });
  }
  function removeEventListener(nameSpec, callback) {
    _getEvents(nameSpec).map(function (name) {
      var callbacks = eventListeners.get(name);
      var findIndex = callbacks.findIndex(function (c) {
        return c === callback;
      });

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
    if (includeBrowserMediaDeviceInfo === void 0) {
      includeBrowserMediaDeviceInfo = false;
    }

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
    if (includeBrowserMediaDeviceInfo === void 0) {
      includeBrowserMediaDeviceInfo = false;
    }

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
    if (args === void 0) {
      args = null;
    }

    if (requireInitializedCheck === void 0) {
      requireInitializedCheck = true;
    }

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
    if (args === void 0) {
      args = null;
    }

    if (requireInitializedCheck === void 0) {
      requireInitializedCheck = true;
    }

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

  function fillInMatchingMediaInfo(deviceInfo, potentialDongleDeviceInfos, mediaDevices) {
    function findMatchFromProductId(deviceInfo, mediaDeviceNameCandidates) {
      var explicitStr = "(0b0e:" + deviceInfo.productID.toString(16) + ")";
      return mediaDeviceNameCandidates.findIndex(function (c) {
        return c.indexOf(explicitStr) >= 0;
      });
    }

    function findBestMatchIndex(mediaDeviceNameCandidates) {
      if (mediaDeviceNameCandidates.length > 0) {
        // First try to see if the vendor and product id is mentioned in label (newer versions of chrome):
        var explicitIdx = findMatchFromProductId(deviceInfo, mediaDeviceNameCandidates);

        if (explicitIdx >= 0) {
          return explicitIdx;
        } // If device is not present in Chrome's device list, it could be a dongle-connected device, 
        // we then need to find the dongle's deviceInfo instead by iterating the full list of deviceInfos


        var dongleDeviceInfo = potentialDongleDeviceInfos.find(function (d) {
          return d.deviceID === deviceInfo.connectedDeviceID;
        });

        if (dongleDeviceInfo) {
          explicitIdx = findMatchFromProductId(dongleDeviceInfo, mediaDeviceNameCandidates);

          if (explicitIdx >= 0) {
            return explicitIdx;
          }
        }
      }

      return -1;
    } // Find matching pair input or output device.


    function findMatchingMediaDevice(groupId, kind, src) {
      return src.find(function (md) {
        return md.groupId == groupId && md.kind == kind;
      });
    }

    if (deviceInfo && deviceInfo.deviceName) {
      var groupId = undefined;
      var audioInputId = undefined;
      var audioOutputId = undefined;
      var label = undefined; // Filter out non Jabra input/output devices:

      var jabraMediaDevices = mediaDevices.filter(function (device) {
        return device.label && device.label.toLowerCase().includes("jabra") && (device.kind === "audioinput" || device.kind === "audiooutput");
      });
      var someJabraDeviceIndex = findBestMatchIndex(jabraMediaDevices.map(function (md) {
        return md.label;
      }));

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

    return Promise.all([_doGetSDKDevices(), navigator.mediaDevices.enumerateDevices()]).then(function (_ref) {
      var deviceInfos = _ref[0],
          mediaDevices = _ref[1];
      deviceInfos.forEach(function (deviceInfo) {
        fillInMatchingMediaInfo(deviceInfo, deviceInfos, mediaDevices);
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


    return Promise.all([_doGetActiveSDKDevice(), _doGetSDKDevices(), navigator.mediaDevices.enumerateDevices()]).then(function (_ref2) {
      var deviceInfo = _ref2[0],
          deviceInfos = _ref2[1],
          mediaDevices = _ref2[2];
      fillInMatchingMediaInfo(deviceInfo, deviceInfos, mediaDevices);
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
      var _combinedValue = arg;
      return [_combinedValue >> 16 & 255, _combinedValue >> 8 & 255, _combinedValue & 255];
    } else if (Array.isArray(arg)) {
      if (arg.length != 3) {
        throw new Error("Illegal argument - wrong dimension of number array (3 expected)");
      }

      return arg;
    } else {
      throw new Error("Illegal/missing argument - number array or hex string expected");
    }
  }

  var EventEmitter = /*#__PURE__*/function () {
    function EventEmitter() {
      /**
       * A map of event listeners
       *
       * @memberof EventEmitter
       */
      this.listeners = new Map();
    }
    /**
     * Add a function to be called when a specific type of event is emitted.
     *
     * @param {T} type
     * @param {EventEmitterListener<V>} listener
     * @memberof EventEmitter
     */


    var _proto = EventEmitter.prototype;

    _proto.addEventListener = function addEventListener(type, listener) {
      var listeners = this.listeners.get(type) || [];
      this.listeners.set(type, [].concat(listeners, [listener]));
    }
    /**
     * Add a function to be called when a specific type of event is emitted.
     *
     * @param {T} type
     * @param {EventEmitterListener<V>} listener
     * @memberof EventEmitter
     */
    ;

    _proto.on = function on(type, listener) {
      this.addEventListener(type, listener);
    }
    /**
     * Remove an event listener that was previously added.
     *
     * @param {T} type
     * @param {EventEmitterListener<V>} listener
     * @memberof EventEmitter
     */
    ;

    _proto.removeEventListener = function removeEventListener(type, listener) {
      var listeners = this.listeners.get(type) || [];
      this.listeners.set(type, listeners.filter(function (l) {
        return l !== listener;
      }));
    }
    /**
     * Remove an event listener that was previously added.
     *
     * @param {T} type
     * @param {EventEmitterListener<V>} listener
     * @memberof EventEmitter
     */
    ;

    _proto.off = function off(type, listener) {
      this.removeEventListener(type, listener);
    }
    /**
     * Emit an event of specific type, and supply what value to pass to the
     * listener.
     *
     * @param {T} type
     * @param {V} event
     * @returns
     * @memberof EventEmitter
     */
    ;

    _proto.emit = function emit(type, value) {
      var listeners = this.listeners.get(type);
      if (!listeners) return;
      listeners.forEach(function (listener) {
        listener(value);
      });
    };

    return EventEmitter;
  }();

  // This object defines the remapping between a DevLogEvent and an
  // AnalyticsEvent. The object key is the key that must be present in the
  // DevLogEvent, the key.eventType is the new event type given in AnalyticsEvent,
  // and key.valueType is the expected primitive type of the value, so it can be
  // parsed correctly
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
  /**
   * The AnalyticsEvent class represents events that occur, when the Jabra
   * headset reports analytics data.
   *
   * @export
   * @class AnalyticsEvent
   */

  var AnalyticsEvent = function AnalyticsEvent(type, value, timestamp) {
    this.type = type;
    this.value = value;
    this.timestamp = timestamp || Date.now();
  };
  /**
   * The createAnalyticsEvent function converts a jabra.DevLogEvent, to an
   * AnalyticsEvent. The event type and data value is parsed and sanitised before
   * the event is created.
   *
   * @export
   * @param {Jabra.DevLogEvent} event
   * @returns {(AnalyticsEvent | null)}
   */

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
        }

        return new AnalyticsEvent(translation.eventType, value, event.data.TimeStampMs);
      }
    }

    return null;
  }

  /**
   * The AnalyticsEventList class, is used to maintain and time ordered list of
   * events. Since there is no guarentee that analytics events will be received in
   * order, the add method of this class ensures that an event is inserted into
   * the list sorted. Besides that, it provides a convenient way to query events
   * in the list, using the methods newest or find.
   *
   * @export
   * @class AnalyticsEventList
   */
  var AnalyticsEventList = /*#__PURE__*/function () {
    function AnalyticsEventList() {
      // An array of events sorted by the time it was emitted.
      this.events = [];
    }
    /**
     * Add an AnalyticsEvent to the event list, the list will automatically keep
     * the list sorted by the time it was emitted
     *
     * @param {AnalyticsEvent} event
     * @returns {AnalyticsEvent}
     * @memberof AnalyticsEventList
     */


    var _proto = AnalyticsEventList.prototype;

    _proto.add = function add(event) {
      // Asuming this.events is sorted, add an event while maintaining order.
      // Find the index of the first event older than current event.
      var index = this.events.findIndex(function (e) {
        return event.timestamp < e.timestamp;
      }); // If event is older than any other event, add to back of event log

      if (index === -1) index = this.events.length; // Add all events before current event, current event, and all events after
      // current event

      this.events = [].concat(this.events.slice(0, index), [event], this.events.slice(index)); // Return parsed AnalyticsEvent

      return event;
    }
    /**
     * Get the newest event in the events log, optionally fitler by eventType
     *
     * @param {string} [eventType]
     * @returns newest event
     * @memberof AnalyticsEventList
     */
    ;

    _proto.newest = function newest(eventType) {
      // If eventType has been specified return last event with that type
      if (eventType) {
        for (var i = this.events.length - 1; i > 0; i--) {
          var event = this.events[i];
          if (event.type === eventType) return event;
        }

        return null;
      } // Else return last event of array


      return this.events[this.events.length - 1] || null;
    }
    /**
     * Find a subset of events based on an object of filter parameters.
     *
     * @param {AnalyticsEventLogListFilter} [filter]
     * @param {string} filter.eventType A space separated list of event types to filter on
     * @param {number} filter.limit Limit the result to a specified number of events
     * @param {AnalyticsEvent} filter.limitEvent Limit the result to a specifc event, and get all events up to the specified event
     * @param {AnalyticsEvent} filter.offsetEvent Offset the result to a specifc event, and get all events after the specified event
     * @param {object} filter.interval Filter events by an start and end time, and get all events within the specified interval
     * @returns matching list of events
     * @memberof AnalyticsEventList
     */
    ;

    _proto.find = function find(filter) {
      var events = this.events;

      if (filter) {
        var eventType = filter.eventType,
            limit = filter.limit,
            interval = filter.interval,
            limitEvent = filter.limitEvent,
            offsetEvent = filter.offsetEvent;

        if (limitEvent) {
          events = events.slice(0, this.events.indexOf(limitEvent));
        }

        if (offsetEvent) {
          events = events.slice(this.events.indexOf(offsetEvent));
        }

        if (eventType || interval) {
          events = events.filter(function (_ref) {
            var type = _ref.type,
                timestamp = _ref.timestamp;
            if (eventType && !eventType.includes(type)) return false;
            if (interval && interval.start && timestamp < interval.start) return false;
            if (interval && interval.end && timestamp > interval.end) return false;
            return true;
          });
        }

        if (limit) {
          events = limit > 0 ? events.slice(0, limit) : events.slice(limit);
        }
      }

      return events;
    };

    _proto.clear = function clear() {
      this.events = [];
    };

    return AnalyticsEventList;
  }();

  /**
   * WARNING: THE ANALYTICS APIS ARE PRE-RELEASE, AND SUBJECT TO CHANGE WITHOUT
   * WARNING IN FUTURE RELEASES. ONLY USE FOR EVALUATION PURPOSES.
   *
   * The Analytics will collect AnalyticsEvents and allow you to query data such
   * as speech status, speech time, and much more. To use the class, initialize an
   * instance of the class and use the start method to start collecting. The class
   * is an event emitter, so you can use addEventListener to listen to specific
   * AnalyticEvents. If you have multiple jabra devices connected and only want to
   * collect events from one of the devices supply a deviceID in the class
   * constructor.
   *
   * @export
   * @class Analytics
   * @extends {EventEmitter}
   */

  var Analytics = /*#__PURE__*/function (_EventEmitter) {
    _inheritsLoose(Analytics, _EventEmitter);

    /**
     * Creates an instance of Analytics. Supply a deviceID to only collect
     * analytics from that specific device.
     *
     * @param {(number | null)} [deviceID=null]
     * @memberof Analytics
     */
    function Analytics(deviceID) {
      var _this;

      if (deviceID === void 0) {
        deviceID = null;
      }

      _this = _EventEmitter.call(this) || this;
      /**
       * The event log containing all the events happening when analytics start
       *
       * @private
       * @memberof Analytics
       */

      _this.events = new AnalyticsEventList();
      addEventListener("devlog", function (devlogEvent) {
        // opt out if not running
        if (!_this.startTime || _this.stopTime) return; // If an deviceID is defined, and it doesn't match the one in the
        // devlogEvent, opt out

        if (deviceID && deviceID !== devlogEvent.data.deviceID) return; // Since devlog events can be recieved out of order, add event to the
        // event log, which will maintain an ordered list of events.

        var event = createAnalyticsEvent(devlogEvent);

        if (event) {
          _this.events.add(event);

          _this.emit(event.type, event);
        }
      });
      console.warn('WARNING: The Analytics APIs are pre-release and subject to change without warning in future releases. Only use for evaluation purposes.');
      return _this;
    }
    /**
     * Starts the analytics module
     *
     * @memberof Analytics
     */


    var _proto = Analytics.prototype;

    _proto.start = function start() {
      this.clear();
      this.startTime = Date.now();
      this.stopTime = undefined;
    }
    /**
     * Stops the analytics module
     *
     * @memberof Analytics
     */
    ;

    _proto.stop = function stop() {
      this.stopTime = Date.now();
    }
    /**
     * Clears the event history of the analytics module
     *
     * @memberof Analytics
     */
    ;

    _proto.clear = function clear() {
      this.events.clear();
    }
    /**
     * Get whether the transmitter or receiver is talking, and whether there's
     * crosstalk or silence
     *
     * @returns {SpeechStatus}
     * @memberof Analytics
     */
    ;

    _proto.getSpeechStatus = function getSpeechStatus() {
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
    }
    /**
     * Get time the transmitter or reciver has talked, and how long there's
     * been crosstalk or silence
     *
     * @param {number} [fromTime]
     * @param {number} [toTime]
     * @returns {SpeechTime}
     * @memberof Analytics
     */
    ;

    _proto.getSpeechTime = function getSpeechTime(fromTime, toTime) {
      var query = {
        eventType: "txspeech rxspeech"
      };

      if (fromTime && toTime) {
        query.interval = {
          start: fromTime,
          end: toTime
        };
      }

      var events = this.events.find(query);
      var startTime = fromTime || this.startTime || 0;
      var endTime = toTime || this.stopTime || Date.now();
      var txDuration = 0;
      var txStartEvent;
      var rxDuration = 0;
      var rxStartEvent;
      var crosstalkDuration = 0;
      var crosstalkStartEvent;

      if (fromTime && toTime) {
        var firstTXEventBeforeInterval = this.events.find({
          eventType: "txspeech",
          limitEvent: events[0],
          limit: -1
        })[0];
        var firstRXEventBeforeInterval = this.events.find({
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

      for (var _iterator = _createForOfIteratorHelperLoose(events), _step; !(_step = _iterator()).done;) {
        var event = _step.value;
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

            if (rxStartEvent) rxStartEvent = event;
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
            if (txStartEvent) txStartEvent = event;
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

      var calculatePercentage = function calculatePercentage(duration) {
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
    }
    /**
     * Get whether or not the headset is muted
     *
     * @returns {boolean} - muted status
     * @memberof Analytics
     */
    ;

    _proto.getMutedStatus = function getMutedStatus() {
      var event = this.events.newest("mute");
      return event ? event.value : false;
    }
    /**
     * Get the number of times the headset has been muted
     *
     * @returns {number} - muted count
     * @memberof Analytics
     */
    ;

    _proto.getMutedCount = function getMutedCount() {
      return this.events.find({
        eventType: "mute"
      }).filter(function (event) {
        return event.value;
      }).length;
    }
    /**
     * Get the boom arm position status
     *
     * @returns {(boolean | undefined)}
     * @memberof Analytics
     */
    ;

    _proto.getBoomArmStatus = function getBoomArmStatus() {
      var event = this.events.newest("boomarm");
      return event ? event.value : undefined;
    }
    /**
     * Get the number of times the boom arm has been misaligned
     *
     * @returns {number}
     * @memberof Analytics
     */
    ;

    _proto.getBoomArmMisalignedCount = function getBoomArmMisalignedCount() {
      return this.events.find({
        eventType: "boomarm"
      }).filter(function (event) {
        return event.value;
      }).length;
    }
    /**
     * Get the number of times the volume has been increased
     *
     * @returns {number}
     * @memberof Analytics
     */
    ;

    _proto.getVolumeUpCount = function getVolumeUpCount() {
      return this.events.find({
        eventType: "volumeup"
      }).filter(function (event) {
        return event.value;
      }).length;
    }
    /**
     * Get the number of times the volume has been decreased
     *
     * @returns {number}
     * @memberof Analytics
     */
    ;

    _proto.getVolumeDownCount = function getVolumeDownCount() {
      return this.events.find({
        eventType: "volumedown"
      }).filter(function (event) {
        return event.value;
      }).length;
    }
    /**
     * Get the audio exposure level
     *
     * @returns {number}
     * @memberof Analytics
     */
    ;

    _proto.getAudioExposure = function getAudioExposure(limit) {
      if (limit === void 0) {
        limit = -15;
      }

      return this.events.find({
        limit: limit,
        eventType: "rxacousticlevel"
      });
    }
    /**
     * Get the average audio exposure level over a time interval
     *
     * @returns {number}
     * @memberof Analytics
     */
    ;

    _proto.getAverageAudioExposure = function getAverageAudioExposure(fromTime, toTime) {
      return this.getAverageAcousticLevel("rxacousticlevel", fromTime, toTime);
    }
    /**
     * Get the average background noise level
     *
     * @returns {number}
     * @memberof Analytics
     */
    ;

    _proto.getBackgroundNoise = function getBackgroundNoise(limit) {
      if (limit === void 0) {
        limit = -15;
      }

      return this.events.find({
        limit: limit,
        eventType: "txacousticlevel"
      });
    }
    /**
     * Get the average background noise level over a time interval
     *
     * @returns {number}
     * @memberof Analytics
     */
    ;

    _proto.getAverageBackgroundNoise = function getAverageBackgroundNoise(fromTime, toTime) {
      return this.getAverageAcousticLevel("txacousticlevel", fromTime, toTime);
    }
    /**
     * Get the average acoustic level level over a time interval, a private method
     * used for getAverageAudioExposure and getAverageBackgroundNoise
     *
     * @returns {number}
     * @memberof Analytics
     */
    ;

    _proto.getAverageAcousticLevel = function getAverageAcousticLevel(eventType, fromTime, toTime) {
      var events = [];

      if (fromTime && toTime) {
        var eventsWithinInterval = this.events.find({
          eventType: eventType,
          interval: {
            start: fromTime,
            end: toTime
          }
        });
        var firstEventBeforeInterval = this.events.find({
          eventType: eventType,
          limitEvent: eventsWithinInterval[0],
          limit: -1
        });
        events = [].concat(firstEventBeforeInterval, eventsWithinInterval);
      } else {
        events = this.events.find({
          eventType: eventType
        });
      } // If no events was found, the headset hasn't reported an acoustic level yet


      if (events.length === 0) return 0; // If only one event was found, the average is the value of event

      if (events.length === 1) return events[0].value;
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
  }(EventEmitter);

  exports.Analytics = Analytics;
  exports.CommandError = CommandError;
  exports._getEvents = _getEvents;
  exports._setActiveDeviceId = _setActiveDeviceId;
  exports.addEventListener = addEventListener;
  exports.apiVersion = apiVersion;
  exports.getActiveDevice = getActiveDevice;
  exports.getDevices = getDevices;
  exports.getInstallInfo = getInstallInfo;
  exports.getUserDeviceMediaExt = getUserDeviceMediaExt;
  exports.hold = hold;
  exports.init = init;
  exports.isDeviceSelectedForInput = isDeviceSelectedForInput;
  exports.mute = mute;
  exports.offHook = offHook;
  exports.onHook = onHook;
  exports.removeEventListener = removeEventListener;
  exports.resume = resume;
  exports.ring = ring;
  exports.setActiveDeviceId = setActiveDeviceId;
  exports.setBusyLight = setBusyLight;
  exports.setMmiFocus = setMmiFocus;
  exports.setRemoteMmiLightAction = setRemoteMmiLightAction;
  exports.shutdown = shutdown;
  exports.trySetDeviceOutput = trySetDeviceOutput;
  exports.unmute = unmute;

})));
//# sourceMappingURL=jabra.umd.development.js.map
