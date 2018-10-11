/// <reference path="../../JavaScriptLibrary/jabra.browser.integration-2.0.d.ts" />

// Help text for command followed by help for parameters.
const commandTxtHelp = {
  getDevices: ["", "includeBrowserMediaDeviceInfo?: boolean"],
  getActiveDevice: ["", "includeBrowserMediaDeviceInfo?: boolean"],
  setActiveDeviceId: ["", "id: integer"],
  setMmiFocus: ["", "type: RemoteMmiType", "capture: boolean"],
  setRemoteMmiLightAction: ["", "type: RemoteMmiType", "color: hex-string", "effect: RemoteMmiSequence"],
  setBusyLight: ["", "busy: boolean"],
  trySetDeviceOutput: ["Requires prior call to getUserDeviceMediaExt - parameters setup internally"], 
  isDeviceSelectedForInput: ["Requires prior call to getUserDeviceMediaExt - parameters setup internally"],
  getUserDeviceMediaExt: ["", "constraints?: MediaStreamConstraints (JSON)"],

  init: ["Initialize API (must be called prior to anything else) - remember to call addEventListener also if called directly or GUI won't be updated with events/errors!!"],
  shutdown: ["De-Initialize API (incl. unsubscribe everything) - may optionally be called when finished using API."],
  addEventListener: ["Must be called for events/errors to be shown in this app. 2nd eventListener argument setup internally. Call with /.*/ argument to pass all events)", 
                     "nameSpec: string | RegExp | Array<string | RegExp>"],
  removeEventListener: ["2nd eventListener argument setup internally. Call with /.*/ argument to remove all events)", 
                        "nameSpec: string | RegExp | Array<string | RegExp>"]
};

// DOM loaded
document.addEventListener('DOMContentLoaded', function () {
  let initSDKBtn = document.getElementById('initSDKBtn');
  let unInitSDKBtn = document.getElementById('unInitSDKBtn');
  let checkInstallBtn = document.getElementById('checkInstallBtn');

  let devicesBtn = document.getElementById('devicesBtn');
  let deviceSelector = document.getElementById('deviceSelector');
  let changeActiveDeviceBtn = document.getElementById('changeActiveDeviceBtn');

  let setupUserMediaPlaybackBtn = document.getElementById('setupUserMediaPlaybackBtn');

  let methodSelector = document.getElementById('methodSelector');
  let filterInternalsAndDeprecatedMethodsChk = document.getElementById('filterInternalsAndDeprecatedMethodsChk');
  let invokeApiBtn = document.getElementById('invokeApiBtn');

  let txtParam1 = document.getElementById('txtParam1');
  let txtParam2 = document.getElementById('txtParam2');
  let txtParam3 = document.getElementById('txtParam3');
  let txtParam4 = document.getElementById('txtParam4');
  let txtParam5 = document.getElementById('txtParam5');

  let methodHelp = document.getElementById('methodHelp');  
  let param1Hint = document.getElementById('param1Hint');
  let param2Hint = document.getElementById('param2Hint');
  let param3Hint = document.getElementById('param3Hint');
  let param4Hint = document.getElementById('param4Hint');
  let param5Hint = document.getElementById('param5Hint');    

  let clearMessageAreaBtn = document.getElementById('clearMessageAreaBtn');
  let clearErrorAreaBtn = document.getElementById('clearErrorAreaBtn');
  let clearlogAreaBtn = document.getElementById('clearlogAreaBtn');

  let toggleScrollMessageAreaBtn = document.getElementById('toggleScrollMessageAreaBtn');
  let toggleScrollErrorAreaBtn = document.getElementById('toggleScrollErrorAreaBtn');
  let toggleLogAreaBtn = document.getElementById('toggleLogAreaBtn');

  let messageArea = document.getElementById('messageArea');
  let errorArea = document.getElementById('errorArea');
  let logArea = document.getElementById('logArea');

  let installCheckResult = document.getElementById('installCheckResult');
  let clientlibVersionTxt = document.getElementById('clientlibVersionTxt');
  let otherVersionTxt = document.getElementById('otherVersionTxt');

  let player = document.getElementById('player');

  let variables = {
    "audioElement": player
  }

  let scrollMessageArea = true;
  let scrollErrorArea = true;
  let scrollLogArea = true;

  // Populate dropdown with api methods:
  function setupApiMethods(filtered) {
    function isFunction(obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    };
  
    
    while (methodSelector.options.length > 0) {
      methodSelector.remove(0);
    }

    // Advanced methods not available for normal testing (yet)
    let untestable = [                         
    ];

    // Filterd out by default (in addition to methods starting with underscore):
    let internals = [
      "init", 
      "shutdown",
      "addEventListener",
      "removeEventListener"
    ];

    // Add all other methods as testable api's.
    Object.entries(jabra).forEach(([key, value]) => {
      if (isFunction(value) && !untestable.includes(key)) {
        if (!filtered || (filtered && !(key.startsWith("_") || internals.includes(key)))) {
          var opt = document.createElement('option');
          opt.value = key;
          opt.innerHTML = key;
          methodSelector.appendChild(opt);
        }
      }
    });
  }

  // Setup available methods initially
  setupApiMethods(filterInternalsAndDeprecatedMethodsChk.checked);

  // Change available methods when filter toggled.
  filterInternalsAndDeprecatedMethodsChk.onchange = ( () => {
    setupApiMethods(filterInternalsAndDeprecatedMethodsChk.checked);
    setupApiHelp();
  });

  // Make sure we log anything by default unless overridden by the user.
  // Useful for testing with old <=0.5 versions.
  jabra.logLevel = 255;

  // Setup SDK and setup event listeners when asked.
  initSDKBtn.onclick = () => {
    commandEffect("init", jabra.init()).then(() => {
      return commandEffect("addEventListener", jabra.addEventListener(/.*/, eventListener));
    }).then( () => {});
  };

  // Close API when asked.
  unInitSDKBtn.onclick = () => {
    let result = jabra.shutdown();
    commandEffect("shutdown", result).then( () => {});
  };

  // Event listener that listen to everything from our SDK:
  function eventListener(event) {
    if (event && event.error) {
      addError(event);
    } else {
      addEventMessage(event);
    }
  }

  checkInstallBtn.onclick = () => {
    let result = jabra.getInstallInfo();
    commandEffect("getInstallInfo", result).then( () => {});
  };

  // Fillout devices dropdown when asked.
  devicesBtn.onclick = () => {
    let result = jabra.getDevices();
    commandEffect("getDevices", result).then( () => {});
  };

  // Setup user media for playback (getUserDeviceMediaExt + trySetDeviceOutput)
  setupUserMediaPlaybackBtn.onclick = () => {
    commandEffect("getUserDeviceMediaExt", jabra.getUserDeviceMediaExt({})).then((value) => {
      return commandEffect("trySetDeviceOutput",  jabra.trySetDeviceOutput(player, value.deviceInfo));
    }).then(() => {});
  };
  
  // Change active device
  changeActiveDeviceBtn.onclick = () => {
    let id = deviceSelector.value;

    // Using old deprecated version so it works with previous chromehost.
    jabra._setActiveDeviceId_deprecated(id);
  };

  // Update hints for API call:
  methodSelector.onchange = () => {
    setupApiHelp();
  };

  // Setup hints to help out with API use:
  function setupApiHelp() {
    param1Hint.innerText = "";
    param2Hint.innerText = "";
    param3Hint.innerText = "";
    param4Hint.innerText = "";
    param5Hint.innerText = "";
    methodHelp.innerText = "";
    txtParam1.style="";
    txtParam2.style="";
    txtParam3.style="";
    txtParam4.style="";
    txtParam5.style="";

    function getInputStyle(optional) {
      return optional ? "border:1px solid #00ff00" : "border:1px solid #ff0000";
    }

    let apiFuncName = methodSelector.options[methodSelector.selectedIndex].value;
    var help = commandTxtHelp[apiFuncName];
    if (help) {
      if (help.length>0) {
        methodHelp.innerText = help[0];
      }

      if (help.length>1) {
        param1Hint.innerText = help[1];
        txtParam1.style = getInputStyle(help[1].includes("?:"));
      }
      if (help.length>2) {
        param2Hint.innerText = help[2];
        txtParam2.style = getInputStyle(help[2].includes("?:"));
      }
      if (help.length>3) {
        param3Hint.innerText = help[3];
        txtParam3.style = getInputStyle(help[3].includes("?:"));
      }
      if (help.length>4) {
        param4Hint.innerText = help[4];
        txtParam4.style = getInputStyle(help[4].includes("?:"));
      }
      if (help.length>5) {
        param5Hint.innerText = help[5];
        txtParam5.style = getInputStyle(help[5].includes("?:"));
      }
    }
  }

  // Display hints for initial selected value (if any):
  setupApiHelp();

  // Call into user selected API method.
  invokeApiBtn.onclick = () => {
    let apiFuncName = methodSelector.options[methodSelector.selectedIndex].value;
    let apiFunc = jabra[apiFuncName];
    let result;

    let arg1 = undefined;
    let arg2 = undefined;
    let arg3 = undefined;
    let arg4 = undefined;
    let arg5 = undefined;

    function convertParam(value) {
      // Peek and if we can find signs of an advanced structure than evaluate it otherwise return as string.
      if (value.trim().startsWith("[") 
          || value.trim().startsWith("/") 
          || value.trim().startsWith('"') 
          || value.trim().startsWith("'") 
          || value.trim().startsWith("{")
          || value.trim() === "true" 
          || value.trim() === "false") {
        return eval(value);
      } else { // Assume string otherwise.
        return value;
      }
    }

    // Setup arguments for special calls that have special needs:
    if (apiFuncName === "trySetDeviceOutput") {
      arg1 = variables.audioElement;
      arg2 = variables.deviceInfo;
      if (!arg1 || !arg2) {
        addError("Prior call of getUserDeviceMediaExt required to setup custom arguments in this test application");
        return;
      }
    } else if (apiFuncName === "isDeviceSelectedForInput") {
      arg1 = variables.mediaStream;
      arg2 = variables.deviceInfo;
      if (!arg1 || !arg2) {
        addError("Prior call of getUserDeviceMediaExt required to setup custom arguments in this test application");
        return;
      }      
    } else if (apiFuncName === "getUserDeviceMediaExt") {
      try {
        arg1 = convertParam(txtParam1.value || "{}");
      } catch (err) {
        addError("Value of text parameter 1 should be a parse-able json object for this api method")
        return;
      }
    } else if (apiFuncName === "getDevices") {
      try {
        arg1 = convertParam(txtParam1.value || "false");
      } catch (err) {
        addError("Value of text parameter 1 should be a parse-able json object for this api method")
        return;
      }      
    }  else if (apiFuncName === "addEventListener" || apiFuncName === "removeEventListener") {
      arg1 = convertParam(txtParam1.value);
      arg2 = eventListener;
    } else {
      // Setup arguments for trivial calls that just use text as input.
      arg1 = convertParam(txtParam1.value);
      arg2 = convertParam(txtParam2.value);
      arg3 = convertParam(txtParam3.value);
      arg4 = convertParam(txtParam4.value);
      arg5 = convertParam(txtParam5.value);
    }

    try {
      result = apiFunc.call(jabra, arg1, arg2, arg3, arg4, arg5);
      commandEffect(apiFuncName, result).then(() => {});
    } catch (err) {
      addError(err);
    }
  };

  // Update state with result from previously executed command and return promise with result.
  function commandEffect(apiFuncName, result) {
    if (result instanceof Promise) {
      return result.then((value) => {
        addStatusMessage("Api call " + apiFuncName + " succeeded.");

        // Handle special calls that must have side effects in this test application:
        if (apiFuncName === "init") {
            // Use the Jabra library
            addStatusMessage("Jabra library initialized successfully")
            initSDKBtn.disabled = true;
            unInitSDKBtn.disabled = false;
            checkInstallBtn.disabled = false;
            devicesBtn.disabled = false;
            setupUserMediaPlaybackBtn.disabled = false;

            toastr.info("Jabra library initialized successfully");
        } else if (apiFuncName === "shutdown") {
          initSDKBtn.disabled = false;
          unInitSDKBtn.disabled = true;
          checkInstallBtn.disabled = true;
          devicesBtn.disabled = true;
          changeActiveDeviceBtn.disabled = true;
          setupUserMediaPlaybackBtn.disabled = true;
  
          while (deviceSelector.options.length > 0) {                
            deviceSelector.remove(0);
          }
  
          variables = {
            "audioElement": player
          }
  
          toastr.info("Jabra library uninitialized");
  
          addResponseMessage(result);
        } else if (apiFuncName === "getUserDeviceMediaExt") {
          // Store result for future use in new API calls that needs them.
          variables.mediaStream = value.stream;
          variables.deviceInfo = value.deviceInfo;

          // Configure player to use stream
          player.srcObject =  value.stream;

          // Print prettyfied result:
          addResponseMessage({ stream: (value.stream ? "<MediaStream instance>" : value.stream), "deviceInfo": value.deviceInfo });
          addStatusMessage("NB: Storing stream and deviceinfo to use for subsequent API calls!");
        } else if (apiFuncName === "getInstallInfo") {
          if (value.installationOk) {
            installCheckResult.innerHTML = " Installation is ok.";
            installCheckResult.style.color = "green";
          } else {
            installCheckResult.innerHTML = " Installation is not up to date or in-consistent - please upgrade for full functionality and new bug fixes.";
            installCheckResult.style.color = "red";
          }
    
          otherVersionTxt.innerHTML = ", Browser extension v" + (value.version_browserextension || "?")
                                    + ", Native chromehost v" + (value.version_chromehost || "?")
                                    + ", Native platform SDK v" + (value.version_nativesdk || "?");
    
          addResponseMessage(value);
        } else if (apiFuncName === "getDevices") {
          while (deviceSelector.options.length > 0) {
            deviceSelector.remove(0);
          }
    
          // Normally one should not need to check for legacy_result, but for this
          // special test page we would like it to work with older extensions/chromehosts
          // while at the same time using newest JS API. This is not normally
          // supported so we need special code to deal with legazy result formats as well.
          // Do not do this yourself - upgrade dependencies or use older API.
    
          if (!Array.isArray(value) && value && value.legacy_result) {
            let devicesAry = value.legacy_result.split(",");
            for (var i = 0; i < devicesAry.length; i += 2){
              Object.entries(value).forEach(([key, v]) => {
                var opt = document.createElement('option');
                opt.value = devicesAry[i];
                opt.innerHTML = devicesAry[i+1];
                deviceSelector.appendChild(opt);
              });
            }
          } else {
            // Decode device information normally - recommended way going forward.
            value.forEach(device => {
              var opt = document.createElement('option');
              opt.value = device.deviceID;
              opt.innerHTML = device.deviceName;
              deviceSelector.appendChild(opt);
            });
          }
    
          if (deviceSelector.options.length == 0) {
            addError("No devices found");
          } else {
            changeActiveDeviceBtn.disabled = false;
          }

          addResponseMessage(value);
        } else { // Default handling of general API call:
          // Just print output if there is any:
          if (value != undefined && value != null) {
            addResponseMessage(value);
          }
        }

        return value;
      }).catch((error) => {
        addStatusMessage("Api call " + apiFuncName + " failed.");

        if (apiFuncName === "getInstallInfo" && !checkInstallBtn.disabled) {
          installCheckResult.innerHTML = " Failed verifying installation. Likely because installation is not working or too old to support verification.";
          installCheckResult.style.color = "red";
        } else if (apiFuncName === "getDevices") {
          while (deviceSelector.options.length > 0) {
            deviceSelector.remove(0);
          }
        }

        addError(error);

        return undefined;
      });
    } else { // Unpromised result:
      addStatusMessage("Api call " + apiFuncName + " completed.");

      if (result != undefined && result != null) { // Default handling of general API call:
        addResponseMessage(result);
      }

      return Promise.resolve(result);
    }
  }

  toggleScrollMessageAreaBtn.onclick = () => {
    scrollMessageArea = !scrollMessageArea;
    toggleScrollMessageAreaBtn.value = scrollMessageArea ? "Scroll ON" : "Scroll OFF";
  };

  toggleScrollErrorAreaBtn.onclick = () => {
    scrollErrorArea = !scrollErrorArea;
    toggleScrollErrorAreaBtn.value = scrollErrorArea ? "Scroll ON" : "Scroll OFF";
  };

  toggleLogAreaBtn.onclick = () => {
    scrollLogArea = !scrollLogArea;
    toggleLogAreaBtn.value = scrollLogArea ? "Scroll ON" : "Scroll OFF";
  };

  clearMessageAreaBtn.onclick = () => {
    messageArea.value="";
  };

  clearErrorAreaBtn.onclick = () => {
    errorArea.value="";
  };

  clearlogAreaBtn.onclick = () => {
    logArea.value="";
  };

  function addError(err) {  
    let txt;
    if (typeof err === 'string' || err instanceof String) {
      txt = "error string: " + err;
    } else if (err instanceof Error) {
      txt = err.name + " : " + err.message;
    } else {
      txt = "error object: " + JSON.stringify(err, null, 2);
    }
    errorArea.value = errorArea.value + "\n" + txt;
    if (scrollErrorArea) {
      errorArea.scrollTop = errorArea.scrollHeight;
    }
  }

  function addStatusMessage(msg) {
    let txt = (typeof msg === 'string' || msg instanceof String) ? msg : "Status: " + JSON.stringify(msg, null, 2);
    messageArea.value = messageArea.value + "\n" + txt;
    if (scrollMessageArea) {
      messageArea.scrollTop = messageArea.scrollHeight;
    }
  }

  function addResponseMessage(msg) {
    let txt = (typeof msg === 'string' || msg instanceof String) ? "response string: " + msg : "response object: " + JSON.stringify(msg, null, 2);
    messageArea.value = messageArea.value + "\n" + txt;
    if (scrollMessageArea) {
      messageArea.scrollTop = messageArea.scrollHeight;
    }
  }

  function addEventMessage(msg) {
    let txt = (typeof msg === 'string' || msg instanceof String) ? "event string: " + msg : "event object: " + JSON.stringify(msg, null, 2);
    messageArea.value = messageArea.value + "\n" + txt;
    if (scrollMessageArea) {
      messageArea.scrollTop = messageArea.scrollHeight;
    }
  }

  // Copy console output to log area:
  var console = window.console
  if (console) {
    function replaceStr(str, ...placeholders) {
      var count = 0;
      // return str;
      return str.replace(/%s/g, () => placeholders[count++]);
    }
    function intercept(method){
        var original = console[method]
        console[method] = function() {
          original.apply(console, arguments);

          let txt = replaceStr.apply(this, arguments);          
          logArea.value = logArea.value + "\n" + txt;
          if (scrollLogArea) {
            logArea.scrollTop = logArea.scrollHeight;
          }
        }
    }
    var methods = ['log', 'warn', 'error']
    for (var i = 0; i < methods.length; i++)
        intercept(methods[i])
  }

  function getChromeVersion () {     
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/(([0-9]+\.?)*)/);
    return raw ? raw[2] : "?";
  }

  function getOS() {
    if (window.navigator.userAgent.indexOf("Windows")) {
      return "Windows"
    } else if (window.navigator.userAgent.indexOf("Mac")) {
      return "MacOS"
    } else if (window.navigator.userAgent.indexOf("Linux")) {
      return "Linux";
    } else {
      return "?"
    }
  }
  
  // Update initial status texts.
  clientlibVersionTxt.innerHTML = jabra.apiVersion;
  browserAndOsVersionTxt.innerHTML = "Chrome v" + getChromeVersion() + ", " + getOS();
}, false);