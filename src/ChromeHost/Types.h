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
#include <vector>
#include <limits.h>
#include "json.hpp"
#include "SDK/Common.h"

struct ButtonHidInfo {
	const Jabra_HidInput translatedInData;
	const bool buttonInData;

	ButtonHidInfo(const Jabra_HidInput translatedInData, const bool buttonInData)
	             : translatedInData(translatedInData), buttonInData(buttonInData) {}
	
	bool operator ==(const ButtonHidInfo& rhs) const
    {
        return (translatedInData == rhs.translatedInData) && (buttonInData == rhs.buttonInData);
    }
	
	bool operator <(const ButtonHidInfo& rhs) const
    {
		if (translatedInData < rhs.translatedInData) {
			return true;
		} else if (translatedInData > rhs.translatedInData) {
			return false;
		} else {
			return (buttonInData < rhs.buttonInData);
		}
    }
};

#define MAX_BUTTON_EVENTS 16

struct GnpButtonEntry {
	unsigned short buttonTypeKey;
	unsigned short key;
	std::string value;

	friend std::ostream& operator<<(std::ostream& os, const GnpButtonEntry& v);  
};

void to_json(nlohmann::json& j, const GnpButtonEntry& e);

typedef std::vector<GnpButtonEntry> GnpButtonInfo;

/**
 * Just a triple of all battery status
 */
struct BatteryCombinedStatusInfo {
  bool supported;
  int levelInPercent;
  bool charging;
  bool batteryLow;

  static BatteryCombinedStatusInfo empty() {
    return { false, 100, false, false };
  }
};

template <class T>
struct Optional {
  bool supported;
  T value;
};

/**
* Basic static device information corresponding to what we get from Jabra_DeviceInfo.
*/
struct BasicDeviceInfo {
	unsigned short deviceID;
	unsigned short productID;
	unsigned short vendorID;
	std::string deviceName;
	std::string usbDevicePath;
	std::string parentInstanceId;
	Jabra_ErrorStatus errStatus;
	bool isDongle;
	std::string dongleName;
	std::string variant;
	std::string serialNumber;
    bool isInFirmwareUpdateMode;
    std::string deviceconnection;
	unsigned long connectionId;
    unsigned short parentDeviceId;

    private:
	BasicDeviceInfo() : deviceID(-1), productID(-1), vendorID(-1), errStatus(Device_NotFound), isDongle(false), isInFirmwareUpdateMode(false),
		                deviceconnection(""),connectionId(-1),parentDeviceId(-1) {}

    static std::string deviceConnectionToStr(DeviceConnectionType deviceconnection) {
		switch(deviceconnection) {
			case USB: return std::string("USB");
			case BT: return std::string("BT");
			default: return std::string("?");
		}
	}

	/*
	static std::string toHexString(short v) {
		std::stringstream sstream;
		sstream << std::hex << v;
		return sstream.str();
	}*/

    public:
	explicit BasicDeviceInfo(Jabra_DeviceInfo source) 
							: deviceID(source.deviceID),
							  productID(source.productID),
							  vendorID(source.vendorID),
							  deviceName(source.deviceName ? source.deviceName : ""),
							  usbDevicePath(source.usbDevicePath ? source.usbDevicePath : ""),
							  parentInstanceId(source.parentInstanceId ? source.parentInstanceId : ""),
							  errStatus(source.errStatus),
							  isDongle(source.isDongle),
							  dongleName(source.dongleName ? source.dongleName : ""),
							  variant(source.variant ? source.variant : ""),
							  serialNumber(source.serialNumber ? source.serialNumber : ""),
							  isInFirmwareUpdateMode(source.isInFirmwareUpdateMode),
							  deviceconnection(deviceConnectionToStr(source.deviceconnection)),
							  connectionId(source.connectionId),
							  parentDeviceId(source.parentDeviceId) {}

	/**
	* Empty device information for non-existing device.
	*/
	static const BasicDeviceInfo& empty() {
		static BasicDeviceInfo instance;
		return instance;
	}
};

/**
* All static device information not contained in BasicDeviceInfo.
*/
struct ExtraDeviceInfo {
	std::string serialNumber;
	std::map<int, std::string> electricSerialNumbers;
	std::string firmwareVersion;
	bool skypeCertified;
	std::vector<DeviceFeature> deviceFeatures;

	explicit ExtraDeviceInfo(const std::string& serialNumber,
							 const std::map<int, std::string>& electricSerialNumbers,
							 const std::string& firmwareVersion,
							 const bool skypeCertified,
							 const std::vector<DeviceFeature>& deviceFeatures)
							: serialNumber(serialNumber),
							  electricSerialNumbers(electricSerialNumbers),
						  	  firmwareVersion(firmwareVersion),
							  skypeCertified(skypeCertified),
							  deviceFeatures(deviceFeatures) {}

	/**
	* Empty device information for non-existing device.
	*/
	static const ExtraDeviceInfo& empty() {
		static ExtraDeviceInfo instance(
			"",
			{},
			"",
			false,
			{}		
		);

		return instance;
	}
};

/**
 * Combination of core and extra static information about a device.
 */
struct DeviceInfo {
  BasicDeviceInfo basicInfo;
  ExtraDeviceInfo extendedInfo;

  bool isEmpty() const { return basicInfo.deviceID == USHRT_MAX; }
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

/**
* Combination of device info that changes dynamically.
*/
struct DynamicDeviceInfo {
	public:
	bool supported;
    Optional<unsigned short> connectedDeviceID;
    Optional<unsigned short> aliasDeviceID;
	BatteryCombinedStatusInfo battertyStatus;
	Optional<bool> leftEarBudStatus;
	Optional<bool> equalizerEnabled;
	Optional<bool> busyLight;

	explicit DynamicDeviceInfo(const Optional<unsigned short>& connectedDeviceID,
	                           const Optional<unsigned short>& aliasDeviceID,
	                           const BatteryCombinedStatusInfo& battertyStatus,
							   const Optional<bool>& leftEarBudStatus,
							   const Optional<bool>& equalizerEnabled,
							   const Optional<bool>& busyLight)
						      : supported(true),
							    connectedDeviceID(connectedDeviceID),
								aliasDeviceID(aliasDeviceID),
							    battertyStatus(battertyStatus),
							    leftEarBudStatus(leftEarBudStatus),
								equalizerEnabled(equalizerEnabled),
								busyLight(busyLight) {}

	private:
	explicit DynamicDeviceInfo() : supported(false) {}


	public:
    /**
    * Empty device information for non-existing device.
    */
	static const DynamicDeviceInfo& empty() {
		static DynamicDeviceInfo instance;
		return instance;
	}
};