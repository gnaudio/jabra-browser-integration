#include "Util.h"
#include "Types.h"

void setDeviceInfo(nlohmann::json& dest, const DeviceInfo& src) {
	// Flatten nested structures:

	dest["deviceID"] = src.getDeviceID();
	dest["deviceName"] = src.getDeviceName();
    if (src.basicInfo.usbDevicePath) {
      dest["usbDevicePath"] = src.basicInfo.usbDevicePath;
    }
    if (src.basicInfo.parentInstanceId) {
      dest["parentInstanceId"] = src.basicInfo.parentInstanceId;
    }
    dest["productID"] = src.basicInfo.productID;
    dest["errStatus"] = src.basicInfo.errStatus;
    dest["isBTPaired"] = src.basicInfo.isBTPaired;
    if (src.basicInfo.dongleName) {
      dest["dongleName"] = src.basicInfo.dongleName;
    }
    if (src.basicInfo.variant) {
      dest["variant"] = src.basicInfo.variant;
    }
    if (src.basicInfo.serialNumber) {
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