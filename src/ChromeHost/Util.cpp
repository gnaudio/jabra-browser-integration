#include "Util.h"

void setDeviceInfo(nlohmann::json& dest, const Jabra_DeviceInfo& src) {
    dest["deviceID"] = src.deviceID;
    dest["deviceName"] = src.deviceName ? src.deviceName : "unknown device";
    if (src.usbDevicePath) {
      dest["usbDevicePath"] = src.usbDevicePath;
    }
    if (src.parentInstanceId) {
      dest["parentInstanceId"] = src.parentInstanceId;
    }
    dest["productID"] = src.deviceID;
    dest["errStatus"] = src.errStatus;
    dest["isBTPaired"] = src.isBTPaired;
    if (src.dongleName) {
      dest["dongleName"] = src.dongleName;
    }
    if (src.variant) {
      dest["variant"] = src.variant;
    }
    if (src.serialNumber) {
      dest["serialNumber"] = src.serialNumber;
    }
    dest["isInFirmwareUpdateMode"] = src.isInFirmwareUpdateMode;
    dest["deviceConnection"] = src.deviceconnection;
}