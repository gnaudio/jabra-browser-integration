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

const char * const EVENT_BUSY_LIGHT = "busylight";
const char * const EVENT_HEARTHROUGH = "hearThrough";
const char * const EVENT_BATTERYSTATUS = "batteryStatus";
const char * const EVENT_DEVLOG = "devlog";
const char * const EVENT_DEVICE_ATTACHED = "device attached";
const char * const EVENT_DEVICE_DEATTACHED = "device detached";

const char * const EVENT_GNPBUTTON = "gnpButton";
const char * const EVENT_MMI = "mmi";

const char * const SET_BUSYLIGHT_COMMAND_ARG_BUSY = "busy";
const char * const SET_ACTIVE_DEVICE_COMMAND_ARG_ID = "id";

const char * const SET_MMIFOCUS_COMMAND_ARG_TYPE = "type";
const char * const SET_MMIFOCUS_COMMAND_ARG_CAPTURE = "capture";

const char * const SET_REMOTE_MMI_LIGHT_COMMAND_ARG_TYPE = "type";
const char * const SET_REMOTE_MMI_LIGHT_COMMAND_ARG_COLOR = "color";
const char * const SET_REMOTE_MMI_LIGHT_COMMAND_ARG_EFFECT = "effect";

const char * const JSON_KEY_COMMAND = "command";
const char * const JSON_KEY_EXCEPTION = "exception";
const char * const JSON_KEY_JABRA_RETURN_ERRORCODE = "returnErrorCode";
const char * const JSON_KEY_ERROR_MESSAGE = "errormsg";
const char * const JSON_KEY_CAPTURED = "captured";

const char * const JSON_KEY_DEVICEID = "deviceID";
const char * const JSON_KEY_ACTIVEDEVICE = "activeDevice";
const char * const JSON_KEY_DEVICENAME = "deviceName";

const char * const JSON_KEY_SIMPLE_VALUE = "value";
const char * const JSON_KEY_JSON_MS_TIME = "TimeStampMs";

const char * const JSON_KEY_BUTTONINDATA = "buttonInData";
const char * const JSON_KEY_TRANSLATEDINDATA = "translatedInData";
const char * const JSON_KEY_RINGER_STATUS = "ringing";
const char * const JSON_KEY_HOOK_STATUS = "isOffHook";

const char * const JSON_KEY_VERSION_LEGACY = "version";
const char * const JSON_KEY_VERSION_CHROMEHOST = "version_chromehost";
const char * const JSON_KEY_VERSION_NATIVESDK = "version_nativesdk";

const char * const JSON_KEY_LOGPATH = "chromehost_logpath";

const char * const JSON_KEY_BATTERY_LEVEL_PCT = "batteryLevelInPercent"; 
const char * const JSON_KEY_BATTERY_CHARGING = "batteryCharging"; 
const char * const JSON_KEY_BATTERY_LOW = "batteryLow"; 

const char * const JSON_KEY_TYPE = "type";
const char * const JSON_KEY_ACTION = "action"; 
