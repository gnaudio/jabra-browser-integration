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

#include "stdafx.h"
#include <regex>
#include <functional>
#include <utility>
#include <mutex>
#include <thread>
#include "CmdInterface.h"
#include "Request.h"
#include "Response.h"
#include "Work.h"
#include "EventMapper.h"

/**
 * Manages device handling incomming requests (from browser api)
 * and events (from device).
 * 
 * All requests/events are put directly in a common thread-safe work
 * queue and than retrived in a single seperate thread. This internal
 * thread pulls the work and displatch it to the appropiate visit methods.
 * This means that code for actions and modifications is single-threaded.
 */
class HeadsetIntegrationService : public WorkProcessor
{
  public:
  HeadsetIntegrationService();
  ~HeadsetIntegrationService();

  void processRequest(const RequestWork& work) override;
  void processButtonInDataTranslated(const ButtonInDataTranslatedWork& work) override;
  void processDeviceAttached(const DeviceAttachedWork& work) override;
  void processDeviceDeAttached(const DeviceDeAttachedWork& work) override;
  void processDevLog(const DeviceDevLogWork& work) override;
  void processBusylight(const BusylightWork& work) override;
  void processHearThroughSetting(const HearThroughSettingWork& work) override;
  void processBatteryStatus(const BatteryStatusWork& work) override;
  void processGnpButtons(const GNPButtonWork& work) override;
  void processRemoteMmiWork(const RemoteMmiWork& work) override;

  void AddHandler(std::function<void(const Response&)> callback);
  void QueueRequest(const Request& request);

  bool Start();
  void Stop();

  const DeviceInfo& GetCurrentDevice();
  unsigned short GetCurrentDeviceId();
  bool HasCurrentDeviceId();
  bool SetCurrentDeviceId(unsigned short id);

  const std::vector<DeviceInfo>& GetDevices();
  const std::vector<DeviceInfo> GetDevices(std::function<bool(const DeviceInfo&)> filter);

  void Error(const Context& context, const std::string& msg, const nlohmann::json& data);
  void Event(const Context& context, const std::string& msg, const nlohmann::json& data);

  void SetHookStatus(unsigned short id, bool mute);
  bool GetHookStatus(unsigned short id);

  void SetRingerStatus(unsigned short id, bool ringer);
  bool GetRingerStatus(unsigned short id);

  DynamicDeviceInfo getDynamicDeviceInfo(const DeviceInfo& device);
    
  protected:
  WorkQueue workQueue;
  std::thread workerThread;
  void workerThreadRunner();

  std::map<ButtonHidInfo, EventMapper *> buttonEventMappings;
  std::vector<CmdInterface*> m_commands;

  std::map<unsigned short, bool> m_HookStatus; // Since the Jabra USB stack SDK does not hold state - do it here
  std::map<unsigned short, bool> m_RingerStatus; // Since the Jabra USB stack SDK does not hold state - do it here

  std::function<void(const Response& txt)> m_callback;
  std::vector<DeviceInfo> m_devices;
  unsigned short m_currentDeviceId;
  bool hasPostAttachRegistrations;

  const std::regex timePartDevlogRegEx;
  std::map<unsigned short, std::string> lastTimeCleanedDevLogEventStrMap;

  ExtraDeviceInfo getExtraDeviceInfo(const unsigned short deviceId);
};