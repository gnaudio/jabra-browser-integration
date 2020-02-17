import { BoundedQueue } from './queue';
import { MethodEntry, ClassEntry, ParameterEntry, DeviceInfo, Analytics } from '@gnaudio/jabra-browser-integration';
import * as jabra from '@gnaudio/jabra-browser-integration';
import * as toastr from "toastr";
import * as _apiMeta from '@gnaudio/jabra-browser-integration/dist/api-meta.json';
import { initSDKBtn, unInitSDKBtn, devicesBtn, checkInstallBtn, deviceSelector, methodSelector, 
         setupUserMediaPlaybackBtn, showInternalsAndDeprecatedMethodsChk, stressInvokeApiBtn, invokeApiBtn, 
         txtParam1, txtParam2, txtParam3, txtParam4, txtParam5,
         param1Hint, param2Hint, param3Hint, param4Hint, param5Hint, methodHelp, 
         clearMessageAreaBtn, clearErrorAreaBtn, clearlogAreaBtn, toggleScrollMessageAreaBtn, 
         toggleScrollErrorAreaBtn, toggleLogAreaBtn, messageFilter, logFilter, messagesCount, 
         errorArea, errorsCount, logArea, logCount, messageArea, copyMessages, enableLogging, copyLog,
         txStatus, txPeakStatus, rxStatus, rxPeakStatus, txSpeechStatus, rxSpeechStatus, devLogStatus, 
         boomArmStatus, player, apiReferenceBtn, installCheckResult, clientlibVersionTxt, 
         browserAndOsVersionTxt, otherVersionTxt, addDevice, removeDevice, setupApiClasses, setupApiMethods, setupDevices, removeDevices, apiClassSelector, methodSignature } from './guihelper';

// Setup meta references.
const apiMeta: ClassEntry[] = (_apiMeta as any).default; // workaround for browserify json import problem.

// Main jabra api.
const jabraApiMeta: ClassEntry = apiMeta.find((c) => c.name === "jabra")!;

// DOM loaded
document.addEventListener('DOMContentLoaded', function () {
  setupApiClasses(apiMeta);
  updateApiMethods();

  const stressWaitInterval = 1000;
  const maxQueueSize = 1000;

  let apiReferenceWindow: Window | undefined | null = undefined;

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
 
  let currentDeviceAnalyticsSingleton: Analytics | null = null;

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
  
  const commandArgs: { [name: string]: (method: MethodEntry) => any[] } = {
    trySetDeviceOutput: (method: MethodEntry) => [ variables.audioElement, variables.deviceInfo ],
    isDeviceSelectedForInput: (method: MethodEntry) => [ variables.mediaStream, variables.deviceInfo ],
    getUserDeviceMediaExt: (method: MethodEntry) => [ convertParam(txtParam1.value || "{}") ],
    getDevices: (method: MethodEntry) => [ convertParam(txtParam1.value || "false") ],
    addEventListener: (method: MethodEntry) => [ convertParam(txtParam1.value), eventListener ],
    removeEventListener: (method: MethodEntry) => [ convertParam(txtParam1.value), eventListener ],
    getActiveDevice: (method: MethodEntry) => [  convertParam(txtParam1.value || "false") ],
    __default__: (method: MethodEntry) => [ convertParam(txtParam1.value, method.parameters.length>0 ? method.parameters[0] : undefined),
                                            convertParam(txtParam2.value, method.parameters.length>1 ? method.parameters[1] : undefined),
                                            convertParam(txtParam3.value, method.parameters.length>2 ? method.parameters[2] : undefined),
                                            convertParam(txtParam4.value, method.parameters.length>3 ? method.parameters[3] : undefined),
                                            convertParam(txtParam5.value, method.parameters.length>4 ? method.parameters[4] : undefined) ],
  };

  function getCurrentApiClassObject(): object {
    const clazzName = apiClassSelector.value.toLowerCase();
    const deviceId = Number.parseInt(deviceSelector.value);
    switch (clazzName) {
      case "jabra": 
           return jabra; 
           break;
      case "analytics":
           if (currentDeviceAnalyticsSingleton === null) {
            currentDeviceAnalyticsSingleton = new Analytics(deviceId);
           }
           return currentDeviceAnalyticsSingleton;
           break;
      default: throw new Error("Unknown Api Class '" + clazzName + "'");
    }    
  }

  function getCurrentApiMeta(): ClassEntry | undefined {
    const clazzName = apiClassSelector.value;
    return apiMeta.find((c) => c.name === clazzName);
  }

  function getCurrentMethodMeta(): MethodEntry | undefined {
    const currentApiObjectMeta = getCurrentApiMeta();
    if (currentApiObjectMeta) {
        let selectedMethodName = methodSelector.value;
        return currentApiObjectMeta.methods.find(method => method.name === selectedMethodName);
    } else {
        return undefined;
    }
  }

  function updateApiMethods() {
    const currentApiObjectMeta = getCurrentApiMeta();
    setupApiMethods(currentApiObjectMeta);
    setupApiHelp();
  }

  deviceSelector.onchange = (() => {
    currentDeviceAnalyticsSingleton?.stop();
    currentDeviceAnalyticsSingleton = null;
    const deviceId = Number.parseInt(deviceSelector.value);
    commandEffect("setActiveDeviceId", [ deviceId.toString() ], jabra.setActiveDeviceId(deviceId)).then( () => {});
  });

  apiClassSelector.onchange = ((e) => {
      updateApiMethods();
  });
  
  // Change available methods when filter toggled.
  showInternalsAndDeprecatedMethodsChk.onchange = (() => {
    updateApiMethods();
  });

  // Make sure we log anything by default unless overridden by the user.
  // Useful for testing with old <=0.5 versions.
  (jabra as any).logLevel = 255;

  // Setup SDK and setup event listeners when asked.
  initSDKBtn.onclick = () => {
    commandEffect("init", [], jabra.init()).then(() => {
      return commandEffect("addEventListener", ["/.*/"], jabra.addEventListener(/.*/, eventListener));
    }).then( () => {});
  };

  // Close API when asked.
  unInitSDKBtn.onclick = () => {
    let result = jabra.shutdown();
    commandEffect("shutdown", [], result).then( () => {});
  };

  // Event listener that listen to everything from our SDK:
  function eventListener(event: any) {
    if (event && event.error) {
      addError(undefined, event);
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
        addDevice(event.data);

        updateApiMethods();
      } else if (event.message === "device detached") {
        removeDevice(event.data);

        updateApiMethods();
      }

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
    commandEffect("getInstallInfo", [], result).then( () => {});
  };

  // Fillout devices dropdown when asked.
  devicesBtn.onclick = () => {
    let result = jabra.getDevices();
    commandEffect("getDevices", [], result).then( () => {});
  };
  // Setup user media for playback (getUserDeviceMediaExt + trySetDeviceOutput)
  setupUserMediaPlaybackBtn.onclick = () => {
    commandEffect("getUserDeviceMediaExt", ["{}"], jabra.getUserDeviceMediaExt({})).then((value) => {
      return commandEffect("trySetDeviceOutput", ["<player>", "<deviceInfo>"], jabra.trySetDeviceOutput(player, value.deviceInfo));
    }).then(() => {});
  };
  
  // Update hints for API call:
  methodSelector.onchange = () => {
    setupApiHelp();
  };

  // Producable printable version of parameter
  function paramToString(param: any): string {
    if (param === null) {
      return "<null>";
    } else if (param === undefined) {
      return "<undefined>"
    } else if ((param !== Object(param)) || param.hasOwnProperty('toString')) {
      return param.toString();
    } else {
      return JSON.stringify(param, null, 2);
    }
  }

  // Setup hints to help out with API use:
  function setupApiHelp() {
    const meta = getCurrentMethodMeta();

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

    function getTypeHint(pMeta: ParameterEntry) {
      return pMeta.tsType + (pMeta.tsType !== pMeta.jsType ? " (" + pMeta.jsType + ")" : "");
    }

    if (meta) {
      methodSignature.innerText = meta.name + "( " + meta.parameters.map(p => p.name + (p.optional ? "?": "") + ": " + p.tsType).join(", ") + "): " + meta.tsType;
      methodHelp.innerText = meta.documentation;

      if (meta.parameters.length>=1) {
        param1Hint.innerText = getTypeHint(meta.parameters[0]);
        (txtParam1 as any).style = getInputStyle(meta.parameters[0].optional);
      }
      if (meta.parameters.length>=2) {
        param2Hint.innerText =  getTypeHint(meta.parameters[1]);
        (txtParam2 as any).style = getInputStyle(meta.parameters[1].optional);
      }
      if (meta.parameters.length>=3) {
        param3Hint.innerText =  getTypeHint(meta.parameters[2]);
        (txtParam3 as any).style =  getInputStyle(meta.parameters[2].optional);
      }
      if (meta.parameters.length>=4) {
        param4Hint.innerText =  getTypeHint(meta.parameters[3]);
        (txtParam4 as any).style =  getInputStyle(meta.parameters[3].optional);
      }
      if (meta.parameters.length>=5) {
        param5Hint.innerText =  getTypeHint(meta.parameters[4]);
        (txtParam5 as any).style =  getInputStyle(meta.parameters[4].optional);
      }
    }
  }

  // Display hints for initial selected value (if any):
  setupApiHelp();

  // Invoke API once:
  invokeApiBtn.onclick = () => {
    const meta = getCurrentMethodMeta();
    const currentApiObject = getCurrentApiClassObject(); 
    if (meta) {
        invokeSelectedApi(currentApiObject, meta);
    } else {
        addError("User error", "No device/api selected to invoke");
    }
  };

  // Invoke API repeatedly:
  stressInvokeApiBtn.onclick = () => {
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
      
      let sucess = true;
      let stopped = false;
      if (stressInvokeApiBtn.value.toLowerCase().includes("stop")) {
        stopStressInvokeApi(sucess);
        stopped = true;
      } else {
        const funcMeta = getCurrentMethodMeta();
        const currentApiObject = getCurrentApiClassObject(); 
        if (!currentApiObject || !funcMeta) {
          addError("User error", "No device/api selected to invoke");
          return;
        }

        stressInvokeCount = 1;
        stressInvokeApiBtn.value = "Stop";
        stressInterval = setInterval(() => {
          if (sucess && stressInterval && funcMeta) {
            try {
              invokeSelectedApi(currentApiObject, funcMeta).then( () => {
                stressInvokeApiBtn.value = "Stop stress test (" + funcMeta!.name + " success count # " + stressInvokeCount + ")";
                ++stressInvokeCount!;
              }).catch( () => {
                stressInvokeApiBtn.value = "Stop stress test (" + funcMeta!.name + " failed at count # " + stressInvokeCount + ")";
                sucess = false;
                stopStressInvokeApi(sucess);
              });
            } catch (err) {
              stressInvokeApiBtn.value = "Stop stress test (" + funcMeta!.name + " failed with exception at count # " + stressInvokeCount + ")";
              sucess = false;
              stopStressInvokeApi(sucess);
            }
          }
        }, stressWaitInterval);
      }
  };

  // Call into user selected API method.
  function invokeSelectedApi(currentApiObject: object, method: MethodEntry) {
    if (currentApiObject && method) {
      const apiFunc = (currentApiObject as any)[method.name];

      let argsResolver = commandArgs[method.name];
      if (!argsResolver) {
          argsResolver = commandArgs["__default__"];
      }

      let args: any[];
      try {
        args = argsResolver(method);
        while(args.length>0 && args[args.length-1] === undefined){
          args.pop();
        } 
      } catch (err) {
        addError("Parameter input error", err);
        return Promise.reject(err);
      }

      try {
          const result = apiFunc.call(getCurrentApiClassObject(), ...args);
          return commandEffect(method.name, args.map(a => paramToString(a)), result).then(() => {});
      } catch (err) {
          addError("Command execution error",  err);
          return Promise.reject(err);
      }
    } else {
        addError("invokeSelectedApi", "No api selected to execute");
        return Promise.reject(new Error("No api selected to execute"));
    }
  }

  // Update state with result from previously executed command and return promise with result.
  function commandEffect(apiFuncName: string, argDescriptions: any[], result: Promise<any> | any) {
    let apiCallDescription = apiFuncName + "(" + argDescriptions.join(", ") + ")";
    addStatusMessage("Api call " + apiCallDescription + " executed.");

    if (result instanceof Promise) {
      return result.then((value) => {
        // Handle special calls that must have side effects in this test application:
        if (apiFuncName === "init") {
          // Use the Jabra library
          addStatusMessage("Jabra library initialized successfully")
          initSDKBtn.disabled = true;
          unInitSDKBtn.disabled = false;
          checkInstallBtn.disabled = false;
          invokeApiBtn.disabled = false;
          stressInvokeApiBtn.disabled = false;
          devicesBtn.disabled = false;
          setupUserMediaPlaybackBtn.disabled = false;

          currentDeviceAnalyticsSingleton?.stop();
          currentDeviceAnalyticsSingleton = null;
          toastr.info("Jabra library initialized successfully");
        } else if (apiFuncName === "shutdown") {
          initSDKBtn.disabled = false;
          unInitSDKBtn.disabled = true;
          checkInstallBtn.disabled = true;
          devicesBtn.disabled = true;
          invokeApiBtn.disabled = true;
          stressInvokeApiBtn.disabled = true;
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
          setupDevices(value);
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
          removeDevices();
        }

        addError("commandEffect", error);

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

  function addError(context: string | undefined, err: string | Error) {  
    let txt;
    if (typeof err === 'string' || err instanceof String) {
      txt = err;
    } else if (err instanceof Error) {
      txt = err.name + " : " + err.message;
    } else if (err === undefined) {
      txt = undefined;
    } else {
      txt = JSON.stringify(err, null, 2);
    }
  
    if (context !== undefined) {
      errors.push(txt ? (context + ": " + txt) : context);
    } else if (txt !== undefined) {
      errors.push(txt.toString());
    }

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
      addError("copyMessages", "Could not copy to clipboard");
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
      addError("copyLog", "Could not copy to clipboard");
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
  apiReferenceBtn.onclick = () => {
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