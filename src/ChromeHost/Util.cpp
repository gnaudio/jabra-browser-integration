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

void setDeviceInfo(nlohmann::json& dest, const DeviceInfo& src) {
	// Flatten nested structures:

	dest["deviceID"] = src.getDeviceID();
	dest["deviceName"] = src.getDeviceName();
    if (src.basicInfo.usbDevicePath.length() > 0) {
      dest["usbDevicePath"] = src.basicInfo.usbDevicePath;
    }
    if (src.basicInfo.parentInstanceId.length() > 0) {
      dest["parentInstanceId"] = src.basicInfo.parentInstanceId;
    }
    dest["productID"] = src.basicInfo.productID;
    dest["errStatus"] = src.basicInfo.errStatus;
    dest["isBTPaired"] = src.basicInfo.isBTPaired;
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


	dest["firmwareVersion"] = src.extendedInfo.firmwareVersion;
	dest["serialNumber"] = src.extendedInfo.serialNumber;
	dest["electricSerialNumbers"] = src.extendedInfo.electricSerialNumbers;
	dest["battertyStatus"]["levelInPercent"] = src.extendedInfo.battertyStatus.levelInPercent;
	dest["battertyStatus"]["charging"] = src.extendedInfo.battertyStatus.charging;
	dest["battertyStatus"]["batteryLow"] = src.extendedInfo.battertyStatus.batteryLow;
	dest["skypeCertified"] = src.extendedInfo.skypeCertified;
}
