#pragma once

#include <string>
#include <functional>
#include <vector>
#include <map>
#include <mutex>
#include "CmdInterface.h"
#include "EventInterface.h"
#include "SDK/JabraNativeHid.h"

class HeadsetIntegrationService
{
public:
  HeadsetIntegrationService();
  ~HeadsetIntegrationService();

  void AddHandler(std::function<void(std::string)> callback);
  void SendCmd(std::string msg);

  bool Start();

  unsigned short GetCurrentDeviceId();
  void SetCurrentDeviceId(unsigned short id);
  std::string GetDevicesAsString();

  void Error(std::string msg);
  void Event(std::string msg);

  void SetHookStatus(unsigned short id, bool mute);
  bool GetHookStatus(unsigned short id);

  void SetRingerStatus(unsigned short id, bool ringer);
  bool GetRingerStatus(unsigned short id);

protected:
  std::map<Jabra_HidInput, EventInterface*> m_events;
  std::vector<CmdInterface*> m_commands;

  std::map<unsigned short, bool> m_HookStatus; // Since the Jabra USB stack SDK does not hold state - do it here
  std::map<unsigned short, bool> m_RingerStatus; // Since the Jabra USB stack SDK does not hold state - do it here

  std::function<void(std::string)> m_callback;
  std::vector<Jabra_DeviceInfo> m_devices;
  std::mutex m_mtx; // mutex for critical section
  unsigned short m_currentDeviceId;

  void JabraDeviceAttachedFunc(Jabra_DeviceInfo deviceInfo);
  void JabraDeviceRemovedFunc(unsigned short deviceID);
  void ButtonInDataTranslatedFunc(unsigned short deviceID, Jabra_HidInput translatedInData, bool buttonInData);

  static void StaticJabraDeviceAttachedFunc(Jabra_DeviceInfo deviceInfo);
  static void StaticJabraDeviceRemovedFunc(unsigned short deviceID);
  static void StaticButtonInDataTranslatedFunc(unsigned short deviceID, Jabra_HidInput translatedInData, bool buttonInData);
};