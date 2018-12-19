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
#include <stdlib.h>

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
    dest["isDongle"] = src.basicInfo.isDongle;
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

/**
 * Modified version of BSD/MIT licensed code by Markus Kuhn:
 * 
 * The utf8_check() function scans the '\0'-terminated string starting
 * at s. It returns false for the first malformed
 * or overlong UTF-8 sequence found, or true if the string contains
 * only correct UTF-8. It also spots UTF-8 sequences that could cause
 * trouble if converted to UTF-16, namely surrogate characters
 * (U+D800..U+DFFF) and non-Unicode positions (U+FFFE..U+FFFF). This
 * routine is very likely to find a malformed sequence if the input
 * uses any other encoding than UTF-8. It therefore can be used as a
 * very effective heuristic for distinguishing between UTF-8 and other
 * encodings.
 *
 * I wrote this code mainly as a specification of functionality; there
 * are no doubt performance optimizations possible for certain CPUs.
 *
 * Markus Kuhn <http://www.cl.cam.ac.uk/~mgk25/> -- 2005-03-30
 * License: http://www.cl.cam.ac.uk/~mgk25/short-license.html (BSD & MIT etc).
 */

static bool utf8string_check(unsigned char *s)
{
  if (!s) {
    return false;
  }

  while (*s) {
    if (*s < 0x80)
      /* 0xxxxxxx */
      s++;
    else if ((s[0] & 0xe0) == 0xc0) {
      /* 110XXXXx 10xxxxxx */
      if ((s[1] & 0xc0) != 0x80 ||
	  (s[0] & 0xfe) == 0xc0)                        /* overlong? */
	return false;
      else
	s += 2;
    } else if ((s[0] & 0xf0) == 0xe0) {
      /* 1110XXXX 10Xxxxxx 10xxxxxx */
      if ((s[1] & 0xc0) != 0x80 ||
	  (s[2] & 0xc0) != 0x80 ||
	  (s[0] == 0xe0 && (s[1] & 0xe0) == 0x80) ||    /* overlong? */
	  (s[0] == 0xed && (s[1] & 0xe0) == 0xa0) ||    /* surrogate? */
	  (s[0] == 0xef && s[1] == 0xbf &&
	   (s[2] & 0xfe) == 0xbe))                      /* U+FFFE or U+FFFF? */
	return false;
      else
	s += 3;
    } else if ((s[0] & 0xf8) == 0xf0) {
      /* 11110XXX 10XXxxxx 10xxxxxx 10xxxxxx */
      if ((s[1] & 0xc0) != 0x80 ||
	  (s[2] & 0xc0) != 0x80 ||
	  (s[3] & 0xc0) != 0x80 ||
	  (s[0] == 0xf0 && (s[1] & 0xf0) == 0x80) ||    /* overlong? */
	  (s[0] == 0xf4 && s[1] > 0x8f) || s[0] > 0xf4) /* > U+10FFFF? */
	return s;
      else
	s += 4;
    } else
      return false;
  }

  return true;
}