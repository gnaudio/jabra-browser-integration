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
#include <functional>
#include <vector>
#include <map>
#include <utility>
#include <mutex>
#include "CmdInterface.h"
#include "EventInterface.h"
#include "SDK/JabraNativeHid.h"
#include "SDK/JabraDeviceConfig.h"
#include "Request.h"
#include "Response.h"

class HeadsetIntegrationService
{
  public:
  HeadsetIntegrationService();
  ~HeadsetIntegrationService();

  void AddHandler(std::function<void(const Response&)> callback);
  void SendCmd(const Request& request);

  bool Start();

  unsigned short GetCurrentDeviceId();
  bool SetCurrentDeviceId(unsigned short id);
  std::string GetDevicesAsString();
  const std::vector<Jabra_DeviceInfo> GetDevices();

  void Error(const Context& context, std::string msg, customDataType data);
  void Event(const Context& context, std::string msg, customDataType data);

  void SetHookStatus(unsigned short id, bool mute);
  bool GetHookStatus(unsigned short id);

  void SetRingerStatus(unsigned short id, bool ringer);
  bool GetRingerStatus(unsigned short id);

  protected:
  std::map<Jabra_HidInput, EventInterface*> m_events;
  std::vector<CmdInterface*> m_commands;

  std::map<unsigned short, bool> m_HookStatus; // Since the Jabra USB stack SDK does not hold state - do it here
  std::map<unsigned short, bool> m_RingerStatus; // Since the Jabra USB stack SDK does not hold state - do it here

  std::function<void(const Response& txt)> m_callback;
  std::vector<Jabra_DeviceInfo> m_devices;
  std::mutex m_mtx; // mutex for critical section
  unsigned short m_currentDeviceId;

  void JabraDeviceAttachedFunc(Jabra_DeviceInfo deviceInfo);
  void JabraDeviceRemovedFunc(unsigned short deviceID);
  void ButtonInDataTranslatedFunc(unsigned short deviceID, Jabra_HidInput translatedInData, bool buttonInData);

  static void StaticJabraDeviceAttachedFunc(Jabra_DeviceInfo deviceInfo);
  static void StaticJabraDeviceRemovedFunc(unsigned short deviceID);
  static void StaticButtonInDataTranslatedFunc(unsigned short deviceID, Jabra_HidInput translatedInData, bool buttonInData);
  static void StaticDevLogCallback(unsigned short deviceID, const char* eventStr);
};