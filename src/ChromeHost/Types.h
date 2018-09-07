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

#pragma once

#include <string>
#include <map>
#include "SDK/Common.h"

/**
 * Just a triple of all battery status
 */
struct BatteryCombinedStatusInfo {
  int levelInPercent;
  bool charging;
  bool batteryLow;

  static BatteryCombinedStatusInfo empty() {
    return { 0, false, false };
  }
};

struct BasicDeviceInfo {
	unsigned short deviceID;
	unsigned short productID;
	std::string deviceName;
	std::string usbDevicePath;
	std::string parentInstanceId;
	Jabra_ErrorStatus errStatus;
	bool isBTPaired;
	std::string dongleName;
	std::string variant;
	std::string serialNumber;
    bool isInFirmwareUpdateMode;
    DeviceConnectionType deviceconnection;

    private:
	BasicDeviceInfo() : deviceID(-1), productID(-1), errStatus(Device_NotFound), isBTPaired(false), isInFirmwareUpdateMode(false),
		                deviceconnection(USB) {}

    public:
	explicit BasicDeviceInfo(Jabra_DeviceInfo source) 
							: deviceID(source.deviceID),
							  productID(source.productID),
							  deviceName(source.deviceName ? source.deviceName : ""),
							  usbDevicePath(source.usbDevicePath ? source.usbDevicePath : ""),
							  parentInstanceId(source.parentInstanceId ? source.parentInstanceId : ""),
							  errStatus(source.errStatus),
							  isBTPaired(source.isBTPaired),
							  dongleName(source.dongleName ? source.dongleName : ""),
							  variant(source.variant ? source.variant : ""),
							  serialNumber(source.serialNumber ? source.serialNumber : ""),
							  isInFirmwareUpdateMode(source.isInFirmwareUpdateMode),
							  deviceconnection(source.deviceconnection) {}

	/**
	* Empty device information for non-existing device.
	*/
	static const BasicDeviceInfo& empty() {
		static BasicDeviceInfo instance;
		return instance;
	}
};

/**
* All device information not contained in Jabra_DeviceInfo.
*/
struct ExtraDeviceInfo {
	std::string serialNumber;
	std::map<int, std::string> electricSerialNumbers;
	std::string firmwareVersion;
	bool skypeCertified;
	BatteryCombinedStatusInfo battertyStatus;

	explicit ExtraDeviceInfo(const std::string& serialNumber,
							 const std::map<int, std::string>& electricSerialNumbers,
							 const std::string& firmwareVersion,
							 const bool skypeCertified,
							 const BatteryCombinedStatusInfo& battertyStatus)
							: serialNumber(serialNumber),
							  electricSerialNumbers(electricSerialNumbers),
						  	  firmwareVersion(firmwareVersion),
							  skypeCertified(skypeCertified),
							  battertyStatus(battertyStatus) {}

	/**
	* Empty device information for non-existing device.
	*/
	static const ExtraDeviceInfo& empty() {
		static ExtraDeviceInfo instance(
			"",
			{},
			"",
			false,
			BatteryCombinedStatusInfo::empty()
		);

		return instance;
	}
};

/**
 * Combination of core and extra information about a device.
 */
struct DeviceInfo {
  BasicDeviceInfo basicInfo;
  ExtraDeviceInfo extendedInfo;

  bool isEmpty() const { return basicInfo.deviceID != USHRT_MAX; }
  unsigned short getDeviceID() const { return basicInfo.deviceID; }
  std::string getDeviceName() const { return basicInfo.deviceName; }

  explicit DeviceInfo(const BasicDeviceInfo& basicInfo, 
                      const ExtraDeviceInfo& extendedInfo)
					 : basicInfo(basicInfo), 
					   extendedInfo(extendedInfo) {}

  /**
   * Empty device information for non-existing device.
   */
  static const DeviceInfo& empty() {
	  static DeviceInfo instance(
		  BasicDeviceInfo::empty(),
		  ExtraDeviceInfo::empty()
      );

	return instance;
  }
};