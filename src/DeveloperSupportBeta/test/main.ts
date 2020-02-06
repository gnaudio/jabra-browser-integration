import { BoundedQueue } from './queue';
import { MethodEntry, ClassEntry, ParameterEntry } from '@gnaudio/jabra-browser-integration';
import * as jabra from '@gnaudio/jabra-browser-integration';
import * as toastr from "toastr";
import * as _apiMeta from '@gnaudio/jabra-browser-integration/dist/api-meta.json';

const apiMeta: ClassEntry[] = (_apiMeta as any).default; // workaround for browserify json import problem.
const jabraMeta: ClassEntry = apiMeta.find((c) => c.name === "jabra")!;
const analyticsMeta: ClassEntry = apiMeta.find((c) => c.name === "Analytics")!;

// DOM loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log("jabraMeta is " + JSON.stringify(jabraMeta, null,3));
  console.log("analyticsMeta is " + JSON.stringify(analyticsMeta, null,3));

  const stressWaitInterval = 1000;
  const maxQueueSize = 1000;

  const initSDKBtn = document.getElementById('initSDKBtn') as HTMLButtonElement;
  const unInitSDKBtn = document.getElementById('unInitSDKBtn') as HTMLButtonElement;;
  const checkInstallBtn = document.getElementById('checkInstallBtn') as HTMLButtonElement;

  const devicesBtn = document.getElementById('devicesBtn') as HTMLButtonElement;
  const deviceSelector = document.getElementById('deviceSelector') as HTMLSelectElement;
  const changeActiveDeviceBtn = document.getElementById('changeActiveDeviceBtn') as HTMLButtonElement;

  const setupUserMediaPlaybackBtn = document.getElementById('setupUserMediaPlaybackBtn') as HTMLButtonElement;

  const methodSelector = document.getElementById('methodSelector') as HTMLSelectElement;
  const apiClassSelector = document.getElementById('apiClassSelector') as HTMLSelectElement;

  const filterInternalsAndDeprecatedMethodsChk = document.getElementById('filterInternalsAndDeprecatedMethodsChk') as HTMLInputElement;
  const invokeApiBtn = document.getElementById('invokeApiBtn') as HTMLButtonElement;
  const stressInvokeApiBtn = document.getElementById('stressInvokeApiBtn') as HTMLButtonElement;

  const txtParam1 = document.getElementById('txtParam1') as HTMLTextAreaElement;
  const txtParam2 = document.getElementById('txtParam2') as HTMLTextAreaElement;
  const txtParam3 = document.getElementById('txtParam3') as HTMLTextAreaElement;
  const txtParam4 = document.getElementById('txtParam4') as HTMLTextAreaElement;
  const txtParam5 = document.getElementById('txtParam5') as HTMLTextAreaElement;

  const methodHelp = document.getElementById('methodHelp') as HTMLDivElement;  
  const param1Hint = document.getElementById('param1Hint') as HTMLSpanElement;
  const param2Hint = document.getElementById('param2Hint') as HTMLSpanElement;
  const param3Hint = document.getElementById('param3Hint') as HTMLSpanElement;
  const param4Hint = document.getElementById('param4Hint') as HTMLSpanElement;
  const param5Hint = document.getElementById('param5Hint') as HTMLSpanElement;

  const clearMessageAreaBtn = document.getElementById('clearMessageAreaBtn') as HTMLButtonElement;
  const clearErrorAreaBtn = document.getElementById('clearErrorAreaBtn') as HTMLButtonElement;
  const clearlogAreaBtn = document.getElementById('clearlogAreaBtn') as HTMLButtonElement;

  const toggleScrollMessageAreaBtn = document.getElementById('toggleScrollMessageAreaBtn') as HTMLButtonElement;
  const toggleScrollErrorAreaBtn = document.getElementById('toggleScrollErrorAreaBtn') as HTMLButtonElement;
  const toggleLogAreaBtn = document.getElementById('toggleLogAreaBtn') as HTMLButtonElement;

  const messageFilter = document.getElementById('messageFilter') as HTMLSelectElement;
  const logFilter = document.getElementById('logFilter') as HTMLSelectElement;
  const messagesCount = document.getElementById('messagesCount') as HTMLSpanElement;

  const messageArea = document.getElementById('messageArea') as HTMLTextAreaElement;
  const errorArea = document.getElementById('errorArea') as HTMLTextAreaElement;

  const errorsCount = document.getElementById('errorsCount') as HTMLSpanElement;

  const logArea = document.getElementById('logArea') as HTMLTextAreaElement;
  const logCount = document.getElementById('logCount') as HTMLSpanElement;

  const enableLogging = document.getElementById('enableLogging') as HTMLInputElement;
  const copyLog = document.getElementById('copyLog') as HTMLButtonElement;
  const copyMessages = document.getElementById('copyMessages') as HTMLButtonElement;

  const installCheckResult = document.getElementById('installCheckResult') as HTMLButtonElement;
  const clientlibVersionTxt = document.getElementById('clientlibVersionTxt') as HTMLSpanElement;
  const otherVersionTxt = document.getElementById('otherVersionTxt') as HTMLSpanElement;
  const browserAndOsVersionTxt = document.getElementById('browserAndOsVersionTxt') as HTMLSpanElement;

  const player = document.getElementById('player') as HTMLAudioElement;

  const apiReference = document.getElementById('apiReference') as HTMLButtonElement;
  let apiReferenceWindow: Window | undefined | null = undefined;

  let devLogStatus = document.getElementById('devLogStatus') as HTMLSpanElement;
  let boomArmStatus = document.getElementById('boomArmStatus') as HTMLSpanElement;
  let txStatus = document.getElementById('txStatus') as HTMLSpanElement;
  let txPeakStatus = document.getElementById('txPeakStatus') as HTMLSpanElement;
  let rxStatus = document.getElementById('rxStatus') as HTMLSpanElement;
  let rxPeakStatus = document.getElementById('rxPeakStatus') as HTMLSpanElement;
  let txSpeechStatus = document.getElementById('txSpeechStatus') as HTMLSpanElement;
  let rxSpeechStatus = document.getElementById('rxSpeechStatus') as HTMLSpanElement;

  let variables = {
    "audioElement": player,
    "mediaStream": undefined,
    "deviceInfo": undefined
  }
  
  let boomArm = undefined;
  let txDb = undefined;
  let txPeakDb = undefined;
  let rxDb = undefined;
  let rxPeakDb = undefined;
  let rxSpeech = undefined;
  let txSpeech = undefined;

  let scrollMessageArea = true;
  let scrollErrorArea = true;
  let scrollLogArea = true;

  let errors = new BoundedQueue<string>(maxQueueSize);
  let messages = new BoundedQueue<string>(maxQueueSize);
  let logs = new BoundedQueue<string>(maxQueueSize);

  let stressInvokeCount : number | undefined = undefined;
  let stressInterval: any | undefined  = undefined;

  // Help text for command followed by help for parameters:
  const commandTxtHelp: any = {
    getDevices: ["", "includeBrowserMediaDeviceInfo?: boolean"],
    getActiveDevice: ["", "includeBrowserMediaDeviceInfo?: boolean"],
    setActiveDeviceId: ["", "id: integer"],
    _setActiveDeviceId: ["", "id: integer"],
    setMmiFocus: ["Used to customize (capture) button behavior", "type: RemoteMmiType (integer)", "capture: boolean"],
    setRemoteMmiLightAction: ["Requires button to be captured using prior call to setMmiFocus", "type: RemoteMmiType (integer)", "color: RGB number (ex. #ffffff)", "effect: RemoteMmiSequence (integer)"],
    setBusyLight: ["", "busy: boolean"],
    trySetDeviceOutput: ["Requires prior call to getUserDeviceMediaExt - parameters setup internally"], 
    isDeviceSelectedForInput: ["Requires prior call to getUserDeviceMediaExt - parameters setup internally"],
    getUserDeviceMediaExt: ["Cause browser to access the microphone and devlog events to start (if supported)", "constraints?: MediaStreamConstraints (JSON)"],

    init: ["Initialize API (must be called prior to anything else) - remember to call addEventListener also if called directly or GUI won't be updated with most events/errors!!"],
    shutdown: ["De-Initialize API (incl. unsubscribe everything) - may optionally be called when finished using API."],
    addEventListener: ["Must be called for events/errors to be shown in this app. 2nd eventListener argument setup internally. Call with /.*/ argument to pass all events/errors)", 
                      "nameSpec: string | RegExp | Array<string | RegExp>"],
    removeEventListener: ["2nd eventListener argument setup internally. Call with /.*/ argument to remove all events)", 
                          "nameSpec: string | RegExp | Array<string | RegExp>"],
    __default__: [""]
  };

  // Convert value to argument.
  // Nb. meta data is only available if the API expects a parameter (For testing purpoeses,
  // this tool supports passing parameters even if the API does not expect so).
  function convertParam(value: string, meta?: ParameterEntry): any {
    let tValue = value.trim();

    // If no parameter is expected, we interpret empty string as "undefined"
    if (tValue.length == 0 && !meta) {
      return undefined;
    }
    
    // Remove leading zero from numbers to avoid intreprenting them as octal.
    if (/0[0-9a-fA-F]+/.test(tValue)) {
      while (tValue.startsWith("0")) tValue=tValue.substring(1);
    }

    // Re-intreprent # prefixed numbers as hex number
    if (/#[0-9a-fA-F]+/.test(tValue)) {
      tValue = "0x" + tValue.substring(1);
    }

    // Peek and if we can find signs of non-string than evaluate it otherwise return as string.
    if (tValue.startsWith("[")
        || tValue.startsWith("/")
        || tValue.startsWith('"')
        || tValue.startsWith("'")
        || tValue.startsWith("{")
        || tValue.toLowerCase() === "true"
        || tValue.toLowerCase() === "false"
        || (tValue.length>0 && !isNaN(tValue as any))) {
      return eval("("+tValue+")"); // Normally dangerous but since this is a test app it is acceptable.
    } else { // Assume string otherwise.
      return value;
    }
  }

  // Resolves arguments for different API methods. All methods that require
  // complex values or have default values should be explicitly handled here:
  const commandArgs: { [name: string]: () => any[] } = {
    trySetDeviceOutput: () => [ variables.audioElement, variables.deviceInfo ],
    isDeviceSelectedForInput: () => [ variables.mediaStream, variables.deviceInfo ],
    getUserDeviceMediaExt: () => [ convertParam(txtParam1.value || "{}") ],
    getDevices: () => [ convertParam(txtParam1.value || "false") ],
    addEventListener: () => [ convertParam(txtParam1.value), eventListener ],
    removeEventListener: () => [ convertParam(txtParam1.value), eventListener ],
    getActiveDevice: () => [  convertParam(txtParam1.value || "false") ],
    __default__: () => [ convertParam(txtParam1.value), convertParam(txtParam2.value), convertParam(txtParam3.value), convertParam(txtParam4.value), convertParam(txtParam5.value) ],
  };


  // Populate dropdown with api methods:
  function setupApiMethods(filtered: any) {
    function isFunction(obj: any) {
      return !!(obj && obj.constructor && obj.call && obj.apply && !/^\s*class\s+/.test(obj.toString()));
    };
  
    
    while (methodSelector.options.length > 0) {
      methodSelector.remove(0);
    }

    // Put any methods that are not available for testing here
    let untestable = ["Analytics", "CommandError"];

    // Internals below are filtered out by default (in addition 
    // to methods starting with underscore):
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
  filterInternalsAndDeprecatedMethodsChk.onchange = (() => {
    setupApiMethods(filterInternalsAndDeprecatedMethodsChk.checked);
    setupApiHelp();
  });

  // Make sure we log anything by default unless overridden by the user.
  // Useful for testing with old <=0.5 versions.
  (jabra as any).logLevel = 255;

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
  function eventListener(event: any) {
    if (event && event.error) {
      addError(event);
    } else {
      addEventMessage(event);
    }

    // Look for add/remove events here instead of a seperate
    // event listener as this test page needs a fixed
    // eventhandler for other testing purposes:
    if (event && event.message && event.data) {
      let deviceIdStr = event.data.deviceID.toString();
      let deviceName = event.data.deviceName;

      if (event.message === "device attached") {
        var opt = document.createElement('option');
        opt.value = deviceIdStr;
        opt.innerHTML = deviceName;
        deviceSelector.appendChild(opt);
      } else if (event.message === "device detached") {
        let found = false;
        let i = 0;
        while (deviceSelector.options.length > i && !found) {
          if (deviceSelector.options[i].value === deviceIdStr) {
              deviceSelector.remove(i);
              found = true;
          }

          ++i;
        }
      }

      changeActiveDeviceBtn.disabled = deviceSelector.options.length === 0;
    }

    // Watch for interesting status in devlog events:
    if (event && event.message === "devlog") {
      (devLogStatus as any).style = "display: block";

      let boomArmEvent = event.data["Boom Position Guidance OK"];
      if (boomArmEvent !== undefined) {
          boomArm = (boomArmEvent.toString().toLowerCase() === "true");
          boomArmStatus.innerText = boomArm.toString();
      }
  
      let txLevelEvent = event.data["TX Acoustic Logging Level"];
      if (txLevelEvent !== undefined) {
          txDb = parseInt(txLevelEvent);
          txStatus.innerText = txDb.toString()+"db";
      }

      let txPeakLevelEvent = event.data["TX Acoustic Logging Peak"];
      if (txPeakLevelEvent !== undefined) {
          txPeakDb = parseInt(txPeakLevelEvent);
          txPeakStatus.innerText = txPeakDb.toString()+"db";
      }

      let rxLevelEvent = event.data["RX Acoustic Logging Level"];
      if (rxLevelEvent !== undefined) {
          rxDb = parseInt(rxLevelEvent);
          rxStatus.innerText = rxDb.toString()+"db";
      }

      let rxPeakLevelEvent = event.data["RX Acoustic Logging Peak"];
      if (rxPeakLevelEvent !== undefined) {
          rxPeakDb = parseInt(rxPeakLevelEvent);
          rxPeakStatus.innerText = rxPeakDb.toString()+"db";
      }

      let txSpeechEvent = event.data["Speech_Analysis_TX"];
      if (txSpeechEvent !== undefined) {
          txSpeech = (txSpeechEvent.toString().toLowerCase() === "true");
          txSpeechStatus.innerText = txSpeech.toString();
      }

      let rxSpeechEvent = event.data["Speech_Analysis_RX"];
      if (rxSpeechEvent !== undefined) {
          rxSpeech = (rxSpeechEvent.toString().toLowerCase() === "true");
          rxSpeechStatus.innerText = rxSpeech.toString();
      }
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
    commandEffect("_setActiveDeviceId", jabra._setActiveDeviceId(id)).then(() => {});
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
    (txtParam1 as any).style="";
    (txtParam2 as any).style="";
    (txtParam3 as any).style="";
    (txtParam4 as any).style="";
    (txtParam5 as any).style="";

    function getInputStyle(optional: boolean) {
      return optional ? "border:1px solid #00ff00" : "border:1px solid #ff0000";
    }

    let apiFuncName = methodSelector.options[methodSelector.selectedIndex].value;
    var help: string[] | undefined = commandTxtHelp[apiFuncName];
    if (!help) {
      help = commandTxtHelp["__default__"];
    }

    if (help) {
      if (help.length>0) {
        methodHelp.innerText = help[0];
      }

      if (help.length>1) {
        param1Hint.innerText = help[1];
        (txtParam1 as any).style = getInputStyle(help[1].includes("?:"));
      }
      if (help.length>2) {
        param2Hint.innerText = help[2];
        (txtParam2 as any).style = getInputStyle(help[2].includes("?:"));
      }
      if (help.length>3) {
        param3Hint.innerText = help[3];
        (txtParam3 as any).style = getInputStyle(help[3].includes("?:"));
      }
      if (help.length>4) {
        param4Hint.innerText = help[4];
        (txtParam4 as any).style = getInputStyle(help[4].includes("?:"));
      }
      if (help.length>5) {
        param5Hint.innerText = help[5];
        (txtParam5 as any).style = getInputStyle(help[5].includes("?:"));
      }
    }
  }

  // Display hints for initial selected value (if any):
  setupApiHelp();

  // Invoke API once:
  invokeApiBtn.onclick = () => {
    invokeSelectedApi(methodSelector.options[methodSelector.selectedIndex].value)
  };

  // Invoke API repeatedly:
  stressInvokeApiBtn.onclick = () => {
    let sucess = true;
    let stopped = false;
    if (stressInvokeApiBtn.value.toLowerCase().includes("stop")) {
      stopStressInvokeApi(sucess);
      stopped = true;
    } else {
      const apiFuncName = methodSelector.options[methodSelector.selectedIndex].value;
      stressInvokeCount = 1;
      stressInvokeApiBtn.value = "Stop";
      stressInterval = setInterval(() => {
        if (sucess && stressInterval) {
          try {
            invokeSelectedApi(apiFuncName).then( () => {
              stressInvokeApiBtn.value = "Stop stress test (" + apiFuncName + " success count # " + stressInvokeCount + ")";
              ++stressInvokeCount!;
            }).catch( () => {
              stressInvokeApiBtn.value = "Stop stress test (" + apiFuncName + " failed at count # " + stressInvokeCount + ")";
              sucess = false;
              stopStressInvokeApi(sucess);
            });
          } catch (err) {
            stressInvokeApiBtn.value = "Stop stress test (" + apiFuncName + " failed with exception at count # " + stressInvokeCount + ")";
            sucess = false;
            stopStressInvokeApi(sucess);
          }
        }
      }, stressWaitInterval);
    }
  };

  // Stop stress testing. Leave button with status if failure until repeated stop.
  function stopStressInvokeApi(success: boolean) {
    if (stressInterval) {
        clearInterval(stressInterval);
        stressInterval = undefined;
    }
    if (success) {
        stressInvokeApiBtn.value = "Invoke repeatedly (stress test)";
    }
  }

  // Call into user selected API method.
  function invokeSelectedApi(apiFuncName: string) {
    const apiFunc = (jabra as any)[apiFuncName];

    let argsResolver = commandArgs[apiFuncName];
    if (!argsResolver) {
      argsResolver = commandArgs["__default__"];
    }

    const args = argsResolver();

    try {
      let result = apiFunc.call(jabra, ...args);
      return commandEffect(apiFuncName, result).then(() => {});
    } catch (err) {
      addError(err);
      return Promise.reject(err);
    }
  }

  // Update state with result from previously executed command and return promise with result.
  function commandEffect(apiFuncName: string, result: Promise<any> | any) {
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
            "audioElement": player,
            "mediaStream": undefined,
            "deviceInfo": undefined
          }
  
          toastr.info("Jabra library uninitialized");
  
          addResponseMessage(result);
        } else if (apiFuncName === "getUserDeviceMediaExt") {
          // Store result for future use in new API calls that needs them.
          variables.mediaStream = value.stream;
          variables.deviceInfo = value.deviceInfo;

          // Configure player to use stream
          player.srcObject =  value.stream;
          player.muted = false;

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
            value.forEach((device: jabra.DeviceInfo) => {
              var opt = document.createElement('option');
              opt.value = device.deviceID.toString();
              opt.innerHTML = device.deviceName;
              deviceSelector.appendChild(opt);
            });
          }
    
          if (deviceSelector.options.length == 0) {
            addError("No devices found");
          }

          changeActiveDeviceBtn.disabled = deviceSelector.options.length === 0;

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
    messages.clear();
    messageArea.value="";
    messagesCount.innerText = "0";
  };

  clearErrorAreaBtn.onclick = () => {
    errors.clear();
    errorArea.value="";
    errorsCount.innerText = "0";
  };

  clearlogAreaBtn.onclick = () => {
    logs.clear();
    logArea.value="";
    logCount.innerText = "0";
  };

  function messageFilterAllows(str: string) {
    return messageFilter.value === "" || str.toLocaleLowerCase().includes(messageFilter.value.toLocaleLowerCase());
  }

  function logFilterAllows(str: string) {
    return logFilter.value === "" || str.toLocaleLowerCase().includes(logFilter.value.toLocaleLowerCase());
  }

  function addError(err: string | Error) {  
    let txt;
    if (typeof err === 'string' || err instanceof String) {
      txt = "error string: " + err;
    } else if (err instanceof Error) {
      txt = err.name + " : " + err.message;
    } else {
      txt = "error object: " + JSON.stringify(err, null, 2);
    }

    errors.push(txt);
    updateErrorArea();
  }

  function updateErrorArea() {
    let filteredErrorsArray = errors.getAll();
    errorsCount.innerText = filteredErrorsArray.length.toString();
    errorArea.value = filteredErrorsArray.join("\n");
    if (scrollErrorArea) {
      errorArea.scrollTop = errorArea.scrollHeight;
    }
  }

  function addStatusMessage(msg: string | any) {
    let txt = (typeof msg === 'string' || msg instanceof String) ? msg.toString() : "Status: " + JSON.stringify(msg, null, 2);
    messages.push(txt);
    updateMessageArea();
  }

  function addResponseMessage(msg: string | any) {
    let txt = (typeof msg === 'string' || msg instanceof String) ? "response string: " + msg.toString() : "response object: " + JSON.stringify(msg, null, 2);
    messages.push(txt);
    updateMessageArea();
  }

  function addEventMessage(msg: string | any) {
    let txt = (typeof msg === 'string' || msg instanceof String) ? "event string: " + msg.toString() : "event object: " + JSON.stringify(msg, null, 2);
    messages.push(txt);
    updateMessageArea();
  }

  function updateMessageArea() {
    let filteredMessagesArray = messages.getAll().filter(txt => messageFilterAllows(txt));
    messageArea.value = filteredMessagesArray.join("\n");
    messagesCount.innerText = filteredMessagesArray.length.toString();
    if (scrollMessageArea) {
        messageArea.scrollTop = messageArea.scrollHeight;
    }
  }

  copyMessages.onclick = () => {
    let clipText = messages.getAll().filter(txt => messageFilterAllows(txt)).join("\n");
    navigator.clipboard.writeText(clipText)
    .then(() => {})
    .catch(err => {
      addError("Could not copy to clipboard");
    });
  };

  messageFilter.oninput = () => {
    updateMessageArea();
  };

  // Copy console output to log area:
  const orgConsole = window.console as any;
  if (orgConsole) {
    function replaceStr(str: any, ...placeholders: any[]): any {
      var count = 0;
      return (str && (typeof str === 'string') || (str instanceof String)) ? str.replace(/%s/g, () => placeholders[count++]): str;
    }
    function intercept(method: any){
        const originalMethod = orgConsole[method];       
        orgConsole[method] = function() {
          // @ts-ignore
          originalMethod.apply(orgConsole, arguments);

          if (enableLogging.checked) {
            // @ts-ignore
            let v = replaceStr.apply(this, arguments);
            if ((typeof v === 'string') || (v instanceof String)) {
              logs.push(v.toString());
            } else if (v !== null && v !== undefined) {
              logs.push(v.toString())
            }
            updateLogArea();
          }
        }
    }
    var methods = ['log', 'warn', 'error']
    for (var i = 0; i < methods.length; i++)
        intercept(methods[i])
  }

  function updateLogArea() {
    let filteredLogArray = logs.getAll().filter(txt => logFilterAllows(txt));
    logCount.innerText = filteredLogArray.length.toString();
    logArea.value =filteredLogArray.join("\n");
    if (scrollLogArea) {
      logArea.scrollTop = logArea.scrollHeight;
    }
  }

  logFilter.oninput = () => {
    updateLogArea();
  };
  
  copyLog.onclick = () => {
    let filteredLogArray = logs.getAll().filter(txt => logFilterAllows(txt));
    let clipText = filteredLogArray.join("\n");
    navigator.clipboard.writeText(clipText)
    .then(() => {})
    .catch(err => {
      addError("Could not copy to clipboard");
    });
  };

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

  // Open Api reference with syntax highlightning in new window.
  apiReference.onclick = () => {
   fetch('../../JavaScriptLibrary/jabra.browser.integration-3.0.d.ts')
    .then(response => response.text())
    .then(text => {
      let header = "<!DOCTYPE html><title>Jabra Typescript Api</title><link rel=\"stylesheet\" href=\"default.css\">" +
                   "<script src=\"highlight.pack.js\"></script><script>hljs.initHighlightingOnLoad();</script>";

      let html = header + "<pre><code class=\"typescript\">" + text + "</code></pre>";

      if (apiReferenceWindow) {
        let oldWindow = apiReferenceWindow;
        apiReferenceWindow = undefined; 
        oldWindow.close();
      }

      apiReferenceWindow = window.open("", "JabraTypescriptApi", "menubar=no;location=no;toolbar=no;status=no;personalbar=no");
      if (apiReferenceWindow) {
        apiReferenceWindow.document.open();
        apiReferenceWindow.document.write(html);
        apiReferenceWindow.document.close();
        apiReferenceWindow.focus();
      }
    });
  };

}, false);