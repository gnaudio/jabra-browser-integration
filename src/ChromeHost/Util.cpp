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

#include "Util.h"
#include "Types.h"

// Generate json from device info - flatten and filter out empty stuff.
void setDeviceInfo(nlohmann::json& dest, const DeviceInfo& src, const DynamicDeviceInfo& dynSrc) {
	dest[JSON_KEY_DEVICEID] = src.getDeviceID();
	dest[JSON_KEY_DEVICENAME] = src.getDeviceName();

  // Low-level USB stuff is only exposed when debugging mode is enabled.
  #ifdef DEBUG_CHROMEHOST_INFO
    if (src.basicInfo.usbDevicePath.length() > 0) {
    dest["usbDevicePath"] = src.basicInfo.usbDevicePath;
    }

    if (src.basicInfo.parentInstanceId.length() > 0) {
    dest["parentInstanceId"] = src.basicInfo.parentInstanceId;
    }
  #endif

  dest["productID"] = src.basicInfo.productID;

  dest["errStatus"] = src.basicInfo.errStatus;

  if (src.basicInfo.dongleName.length() > 0) {
    dest["dongleName"] = src.basicInfo.dongleName;
  }

  if (src.basicInfo.variant.length() > 0) {
    dest["variant"] = src.basicInfo.variant;
  }

  if (src.basicInfo.serialNumber.length() > 0) {
    dest["serialNumber"] = src.basicInfo.serialNumber;
  }

  dest["isInFirmwareUpdateMode"] = src.basicInfo.isInFirmwareUpdateMode;
  dest["deviceConnection"] = src.basicInfo.deviceconnection;
  
  if (src.basicInfo.deviceconnection == "BT") {
    dest["isBTPaired"] = src.basicInfo.isBTPaired;
  }

  if ( src.extendedInfo.firmwareVersion.length() > 0) {
	  dest["firmwareVersion"] = src.extendedInfo.firmwareVersion;
  }
  
  if (!src.extendedInfo.electricSerialNumbers.empty()) {
	  dest["electricSerialNumbers"] = src.extendedInfo.electricSerialNumbers;
  }
  
  dest["skypeCertified"] = src.extendedInfo.skypeCertified;
  dest["deviceFeatures"] = src.extendedInfo.deviceFeatures;

  // Add dynamic data if any?
  if (dynSrc.supported) {
    if (dynSrc.connectedDeviceID.supported) {
      dest["connectedDeviceID"] = dynSrc.connectedDeviceID.value;
    }

    if (dynSrc.aliasDeviceID.supported) {
      dest["aliasDeviceID"] = dynSrc.aliasDeviceID.value;
    }

    if (dynSrc.battertyStatus.supported) {
      // Nested battery objects seems to break Chrome 69 (OR maybe through unlikely nlohmann::json), course Chrome stops
      // seeing outbounds messages after calling getDevices so we inline stuff instead:
      dest[JSON_KEY_BATTERY_LEVEL_PCT] = dynSrc.battertyStatus.levelInPercent;
      dest[JSON_KEY_BATTERY_CHARGING] = dynSrc.battertyStatus.charging;
      dest[JSON_KEY_BATTERY_LOW] = dynSrc.battertyStatus.batteryLow;
    }

    if (dynSrc.leftEarBudStatus.supported) {
      dest["leftEarBudStatus"] = dynSrc.leftEarBudStatus.value;
    }

    if (dynSrc.equalizerEnabled.supported) {
      dest["equalizerEnabled"] = dynSrc.equalizerEnabled.value;
    }

    if (dynSrc.busyLight.supported) {
      dest["busyLight"] = dynSrc.busyLight.value;
    }

  }
}
