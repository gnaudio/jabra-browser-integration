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
struct BatteryCombinedStatus {
  int levelInPercent;
  bool charging;
  bool batteryLow;

  static BatteryCombinedStatus empty() {
    return { 0, false, false };
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
	BatteryCombinedStatus battertyStatus;

	ExtraDeviceInfo(const std::string& serialNumber,
		const std::map<int, std::string>& electricSerialNumbers,
		const std::string& firmwareVersion,
		const bool skypeCertified,
		const BatteryCombinedStatus& battertyStatus)
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
			BatteryCombinedStatus::empty()
		);

		return instance;
	}
};

/**
 * Combination of core and extra information about a device.
 */
struct DeviceInfo {
  Jabra_DeviceInfo basicInfo;
  ExtraDeviceInfo extendedInfo;

  bool isEmpty() const { return basicInfo.deviceID != USHRT_MAX; }
  unsigned short getDeviceID() const { return basicInfo.deviceID; }
  std::string getDeviceName() const { return basicInfo.deviceName ? basicInfo.deviceName : "unknown device name"; }

  DeviceInfo(const Jabra_DeviceInfo& basicInfo, 
             const ExtraDeviceInfo& extendedInfo)
	  : basicInfo(basicInfo), 
	  extendedInfo(extendedInfo) {}

  /**
   * Empty device information for non-existing device.
   */
  static const DeviceInfo& empty() {
	  static DeviceInfo instance(
		  { USHRT_MAX, USHRT_MAX, nullptr, nullptr, nullptr, DeviceInfoError, false, nullptr, nullptr, nullptr, false, USB },
		  ExtraDeviceInfo::empty()
    );

	return instance;
  }
};