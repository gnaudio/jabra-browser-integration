import { BoundedQueue } from './queue';
import { MethodEntry, ClassEntry, ParameterEntry, DeviceInfo } from '@gnaudio/jabra-browser-integration';
import * as jabra from '@gnaudio/jabra-browser-integration';
import * as toastr from "toastr";

// References to our HTML elements.

export const testAppVersion = document.getElementById('testAppVersion') as HTMLSpanElement;
export const nodeSdkVersion = document.getElementById('nodeSdkVersion') as HTMLSpanElement;
export const electronHelperVersion = document.getElementById('electronHelperVersion') as HTMLSpanElement;
export const electronVersion = document.getElementById('electronVersion') as HTMLSpanElement;
export const nodeVersion = document.getElementById('nodeVersion') as HTMLSpanElement;
export const osType = document.getElementById('osType') as HTMLSpanElement;
export const nativeSdkVersion = document.getElementById('nativeSdkVersion') as HTMLSpanElement;

export const errorMsg = document.getElementById('errorMsg') as HTMLSelectElement;

export const initSDKBtn = document.getElementById('initSDKBtn') as HTMLButtonElement;
export const unInitSDKBtn = document.getElementById('unInitSDKBtn') as HTMLButtonElement;
export const devicesBtn = document.getElementById('devicesBtn') as HTMLButtonElement;
export const checkInstallBtn = document.getElementById('checkInstallBtn') as HTMLButtonElement;

export const apiReferenceBtn = document.getElementById('apiReference') as HTMLButtonElement;
export const setupUserMediaPlaybackBtn = document.getElementById('setupUserMediaPlaybackBtn') as HTMLButtonElement;
export const nativeSdkVersionContainer = document.getElementById('nativeSdkVersionContainer') as HTMLSpanElement;

export const player = document.getElementById('player') as HTMLAudioElement;

export const deviceSelector = document.getElementById('deviceSelector') as HTMLSelectElement;
export const apiClassSelector = document.getElementById('apiClassSelector') as HTMLSelectElement;
export const methodSelector = document.getElementById('methodSelector') as HTMLSelectElement;
export const showInternalsAndDeprecatedMethodsChk = document.getElementById('showInternalsAndDeprecatedMethodsChk') as HTMLInputElement;
export const invokeApiBtn = document.getElementById('invokeApiBtn') as HTMLButtonElement;
export const stressInvokeApiBtn = document.getElementById('stressInvokeApiBtn') as HTMLButtonElement;

export const methodHelp = document.getElementById('methodHelp') as HTMLDivElement;
export const methodSignature = document.getElementById('methodSignature') as HTMLDivElement;

export const txtParam1 = document.getElementById('txtParam1') as HTMLTextAreaElement;
export const txtParam2 = document.getElementById('txtParam2') as HTMLTextAreaElement;
export const txtParam3 = document.getElementById('txtParam3') as HTMLTextAreaElement;
export const txtParam4 = document.getElementById('txtParam4') as HTMLTextAreaElement;
export const txtParam5 = document.getElementById('txtParam5') as HTMLTextAreaElement;

export const param1Hint = document.getElementById('param1Hint') as HTMLSpanElement;
export const param2Hint = document.getElementById('param2Hint') as HTMLSpanElement;
export const param3Hint = document.getElementById('param3Hint') as HTMLSpanElement;
export const param4Hint = document.getElementById('param4Hint') as HTMLSpanElement;
export const param5Hint = document.getElementById('param5Hint') as HTMLSpanElement;

export const messagesCount = document.getElementById('messagesCount') as HTMLSpanElement;
export const clearMessageAreaBtn = document.getElementById('clearMessageAreaBtn') as HTMLButtonElement;
export const copyMessagesBtn = document.getElementById('copyMessages') as HTMLButtonElement;
export const toggleScrollMessageAreaBtn = document.getElementById('toggleScrollMessageAreaBtn') as HTMLButtonElement;
export const messageFilter = document.getElementById('messageFilter') as HTMLSelectElement;
export const messageArea = document.getElementById('messageArea') as HTMLTextAreaElement

export const errorsCount = document.getElementById('errorsCount') as HTMLSpanElement;
export const clearErrorAreaBtn = document.getElementById('clearErrorAreaBtn') as HTMLButtonElement;
export const toggleScrollErrorAreaBtn = document.getElementById('toggleScrollErrorAreaBtn') as HTMLButtonElement;
export const errorArea = document.getElementById('errorArea') as HTMLTextAreaElement;

export const logArea = document.getElementById('logArea') as HTMLTextAreaElement;
export const logCount = document.getElementById('logCount') as HTMLSpanElement;
export const clearlogAreaBtn = document.getElementById('clearlogAreaBtn') as HTMLButtonElement;
export const toggleLogAreaBtn = document.getElementById('toggleLogAreaBtn') as HTMLButtonElement;
export const logFilter = document.getElementById('logFilter') as HTMLSelectElement;

export const enableLogging = document.getElementById('enableLogging') as HTMLInputElement;
export const copyLog = document.getElementById('copyLog') as HTMLButtonElement;
export const copyMessages = document.getElementById('copyMessages') as HTMLButtonElement;

export const installCheckResult = document.getElementById('installCheckResult') as HTMLButtonElement;
export const clientlibVersionTxt = document.getElementById('clientlibVersionTxt') as HTMLSpanElement;
export const otherVersionTxt = document.getElementById('otherVersionTxt') as HTMLSpanElement;
export const browserAndOsVersionTxt = document.getElementById('browserAndOsVersionTxt') as HTMLSpanElement;

export const devLogStatus = document.getElementById('devLogStatus') as HTMLSpanElement;
export const boomArmStatus = document.getElementById('boomArmStatus') as HTMLSpanElement;
export const txStatus = document.getElementById('txStatus') as HTMLSpanElement;
export const txPeakStatus = document.getElementById('txPeakStatus') as HTMLSpanElement;
export const rxStatus = document.getElementById('rxStatus') as HTMLSpanElement;
export const rxPeakStatus = document.getElementById('rxPeakStatus') as HTMLSpanElement;
export const txSpeechStatus = document.getElementById('txSpeechStatus') as HTMLSpanElement;
export const rxSpeechStatus = document.getElementById('rxSpeechStatus') as HTMLSpanElement;

export function initStaticVersionInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const testApp_version_txt = urlParams.get('testAppVersion') || "?";
  const nodesdk_version_txt = urlParams.get('nodeSdkVersion') || "?";
  const electronHelper_version_txt = urlParams.get('electronHelperVersion') || "?";
  const electron_version_txt = urlParams.get('electronVersion') || "?";
  const node_version_txt = urlParams.get('nodeVersion') || "?";
  const os_type_txt = urlParams.get('osType') || "?";

  testAppVersion.innerText = testApp_version_txt;
  nodeSdkVersion.innerText = nodesdk_version_txt;
  electronHelperVersion.innerText = electronHelper_version_txt;
  electronVersion.innerText = electron_version_txt;
  nodeVersion.innerText = node_version_txt;
  osType.innerText = os_type_txt;
}
 
// Utility to show errors prominently in the window. 
export function showError(err: string | String | Error) {
    let msg: string;
    if (err instanceof Error) {
      msg = err.toString();
    } else if ((typeof err === 'string') || (err instanceof String)) {
      msg = err.toString(); 
    } else {
      msg = JSON.stringify(err);
    }

    // Add nodes to show the error message
    errorMsg.innerText = msg;

    // Also show as notification.
    toastr.error(msg);
}

export function addDevice(device: DeviceInfo) {
    const opt = document.createElement('option');
    opt.value = device.deviceID.toString();
    opt.innerHTML = device.deviceName;
    deviceSelector.appendChild(opt);

    devicesSideEffects();
}

export function removeDevice(device: DeviceInfo) {
    let found = false;
    let i = 0;
    while (deviceSelector.options.length > i && !found) {
      if (deviceSelector.options[i].value === device.deviceID.toString()) {
          deviceSelector.remove(i);
          found = true;
      }

      ++i;
    }

    devicesSideEffects();
}

// Configures GUI depending on which Jabra devices are present.
export function setupDevices(value: ReadonlyArray<DeviceInfo> | any) {
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

  devicesSideEffects();
}

export function removeDevices() {
  while (deviceSelector.options.length > 0) {
    deviceSelector.remove(0);
  }
}

function devicesSideEffects() {
  // enable/disable stuff here.

  invokeApiBtn.disabled = deviceSelector.options.length === 0;

  let notificationText = (deviceSelector.options.length === 0) ? "No Jabra device found - Please insert a Jabra Device!" : "";
  errorMsg.innerText = notificationText;
}

export function setupApiClasses(apiClasses: ClassEntry[]) {
  while (apiClassSelector.options.length > 0) {
    apiClassSelector.remove(0);
  }

  apiClasses.forEach(clazz => {
    const opt = document.createElement('option');
    opt.value = clazz.name;
    opt.innerHTML = clazz.name;
    apiClassSelector.appendChild(opt);
  });
}

export function setupApiMethods(meta: ClassEntry | undefined) {
  while (methodSelector.options.length > 0) {
    methodSelector.remove(0);
  }

  function filterMethod(funcMeta: MethodEntry): boolean {
     if (!showInternalsAndDeprecatedMethodsChk.checked)   {
        return !(funcMeta.name.startsWith("_") || funcMeta.name === "init" || funcMeta.name === "shutdown" || funcMeta.name === "addEventListener" || funcMeta.name === "removeEventListener");
    } else {
      return true;
    }
  }

  if (meta) {
    const sortedMethods = meta.methods.filter(m => filterMethod(m)).sort((a,b) => a.name.localeCompare(b.name));
    sortedMethods.forEach(methodMeta => {
      var opt = document.createElement('option');
      opt.value = methodMeta.name;
      opt.innerHTML = methodMeta.name;
      methodSelector.appendChild(opt);
    });
  }
}


