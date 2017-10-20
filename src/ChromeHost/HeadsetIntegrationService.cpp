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

#include <climits>
#include "stdafx.h"
#include "HeadsetIntegrationService.h"
#include "CmdOffHook.h"
#include "CmdOnHook.h"
#include "CmdRing.h"
#include "CmdMute.h"
#include "CmdUnmute.h"
#include "CmdHold.h"
#include "CmdResume.h"
#include "CmdGetDevices.h"
#include "CmdGetActiveDevice.h"
#include "CmdSetActiveDevice.h"
#include "CmdGetVersion.h"
#include "EventMicMute.h"
#include "EventOffHook.h"
#include "EventOnline.h"
#include "EventLineBusy.h"
#include "EventReject.h"
#include "EventFlash.h"

HeadsetIntegrationService* g_thisHeadsetIntegrationService;

HeadsetIntegrationService::HeadsetIntegrationService()
{
  g_thisHeadsetIntegrationService = this;

  m_currentDeviceId = 0;

  m_commands.push_back(new CmdOffHook(this));
  m_commands.push_back(new CmdOnHook(this));
  m_commands.push_back(new CmdRing(this));
  m_commands.push_back(new CmdMute(this));
  m_commands.push_back(new CmdUnmute(this));
  m_commands.push_back(new CmdHold(this));
  m_commands.push_back(new CmdResume(this));

  m_commands.push_back(new CmdGetDevices(this));
  m_commands.push_back(new CmdGetActiveDevice(this));
  m_commands.push_back(new CmdSetActiveDevice(this));

  m_commands.push_back(new CmdGetVersion(this));

  m_events[Jabra_HidInput::Mute] = new EventMicMute(this);
  m_events[Jabra_HidInput::OffHook] = new EventOffHook(this);
  m_events[Jabra_HidInput::Online] = new EventOnline(this);
  m_events[Jabra_HidInput::LineBusy] = new EventLineBusy(this);
  m_events[Jabra_HidInput::RejectCall] = new EventReject(this);
  m_events[Jabra_HidInput::Flash] = new EventFlash(this);
}

HeadsetIntegrationService::~HeadsetIntegrationService()
{
  // TODO: Cleanup m_commands and m_events

  // Stop Jabra USB stack SDK
  Jabra_SetSoftphoneReady(false);
  Jabra_DisconnectFromJabraApplication();
  Jabra_Uninitialize();
}

void HeadsetIntegrationService::SendCmd(std::string msg)
{
  std::lock_guard<std::mutex> lock(m_mtx);

  using Iter = std::vector<CmdInterface*>::const_iterator;
  for (Iter it = m_commands.begin(); it != m_commands.end(); ++it) {
    if ((*it)->CanExecute(msg))
    {
      (*it)->Execute(msg);
      return;
    }
  }

  Error("Unknown cmd");
}

void HeadsetIntegrationService::AddHandler(std::function<void(std::string)> callback)
{
  m_callback = callback;
}

bool HeadsetIntegrationService::Start()
{
  Jabra_SetAppID(const_cast<char*>("HKiKNeRIdH/8s+aIRdIVuRoi0vs5TkCXaOmwIqr0rMM="));

  Jabra_Initialize(
    NULL,
    StaticJabraDeviceAttachedFunc,
    StaticJabraDeviceRemovedFunc,
    NULL,
    StaticButtonInDataTranslatedFunc,
    0
  );

  Jabra_ConnectToJabraApplication(
    "D6B42896-E65B-4EC1-A037-27C65E8CFDE1",
    "Google Chrome Browser"
  );

  Jabra_SetSoftphoneReady(true);

  return true;
}

unsigned short HeadsetIntegrationService::GetCurrentDeviceId()
{
  if (m_devices.size() == 0)
    return USHRT_MAX;

  return m_currentDeviceId;
}

void HeadsetIntegrationService::SetCurrentDeviceId(unsigned short id)
{
  m_currentDeviceId = id;
}

std::string HeadsetIntegrationService::GetDevicesAsString()
{
  std::string devicesAsString;

  for (std::vector<int>::size_type i = 0; i != m_devices.size(); i++) {

    if (devicesAsString.length() > 0) {
      devicesAsString += ",";
    }

    devicesAsString += std::to_string(m_devices[i].deviceID);
    devicesAsString += ",";
    devicesAsString += m_devices[i].deviceName;
  }

  return "devices " + devicesAsString;
}

void HeadsetIntegrationService::Error(std::string msg)
{
  m_callback("Error: " + msg);
}

void HeadsetIntegrationService::Event(std::string msg)
{
  m_callback("Event: " + msg);
}

void HeadsetIntegrationService::SetHookStatus(unsigned short id, bool mute)
{
  m_HookStatus[id] = mute;
}

bool HeadsetIntegrationService::GetHookStatus(unsigned short id)
{
  return m_HookStatus[id];
}

void HeadsetIntegrationService::SetRingerStatus(unsigned short id, bool ringer)
{
  m_RingerStatus[id] = ringer;
}

bool HeadsetIntegrationService::GetRingerStatus(unsigned short id)
{
  return m_RingerStatus[id];
}

void HeadsetIntegrationService::JabraDeviceAttachedFunc(Jabra_DeviceInfo deviceInfo)
{
  std::lock_guard<std::mutex> lock(m_mtx);

  m_devices.push_back(deviceInfo);
  std::string deviceName(deviceInfo.deviceName);
  Event("device attached");
}

void HeadsetIntegrationService::JabraDeviceRemovedFunc(unsigned short deviceID)
{
  std::lock_guard<std::mutex> lock(m_mtx);

  int index = -1;

  using Iter = std::vector<Jabra_DeviceInfo>::const_iterator;
  for (Iter it = m_devices.begin(); it != m_devices.end(); ++it) {
    index++;
    if ((*it).deviceID == deviceID)
    {
      std::string deviceName((*it).deviceName);
      Event("device detached");

      m_devices.erase(m_devices.begin() + index);

      break;
    }
  }

  // If the removed device was the active device, assign a new active device (if any)
  if (m_currentDeviceId == deviceID) {
    if (m_devices.size() >= 0) {
      SetCurrentDeviceId(m_devices[0].deviceID);
    }
  }
}

void HeadsetIntegrationService::ButtonInDataTranslatedFunc(unsigned short deviceID, Jabra_HidInput translatedInData, bool buttonInData)
{
  std::lock_guard<std::mutex> lock(m_mtx);

  // Only handle input data from current device
  if (deviceID != GetCurrentDeviceId())
    return;

  EventInterface *event = m_events[translatedInData];
  if (event != NULL)
  {
    event->Execute(buttonInData);
  }
  else
  {
    std::string inDatastring = std::to_string(translatedInData);

    Error("No handler impelmented for " + inDatastring);
  }
}

void HeadsetIntegrationService::StaticJabraDeviceAttachedFunc(Jabra_DeviceInfo deviceInfo)
{
  g_thisHeadsetIntegrationService->JabraDeviceAttachedFunc(deviceInfo);
}

void HeadsetIntegrationService::StaticJabraDeviceRemovedFunc(unsigned short deviceID)
{
  g_thisHeadsetIntegrationService->JabraDeviceRemovedFunc(deviceID);
}

void HeadsetIntegrationService::StaticButtonInDataTranslatedFunc(unsigned short deviceID, Jabra_HidInput translatedInData, bool buttonInData)
{
  g_thisHeadsetIntegrationService->ButtonInDataTranslatedFunc(deviceID, translatedInData, buttonInData);
}