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
#include "Context.h"
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
#include "CmdGetInstallInfo.h"
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
  m_commands.push_back(new CmdGetInstallInfo(this));

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
  try {
    Jabra_SetSoftphoneReady(false);
    Jabra_DisconnectFromJabraApplication();
    Jabra_Uninitialize();
  } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in ~HeadsetIntegrationService");
  } catch (...) {
	  LOG_ERROR << "Unknown error in ~HeadsetIntegrationService";
  }
}

void HeadsetIntegrationService::SendCmd(const Request& request)
{
  try {
    std::lock_guard<std::mutex> lock(m_mtx);

    using Iter = std::vector<CmdInterface*>::const_iterator;
    for (Iter it = m_commands.begin(); it != m_commands.end(); ++it) {
      if ((*it)->CanExecute(request))
      {
        (*it)->Execute(request);
        return;
      }
    }

	  Error(request, "Unknown cmd " + request.message, {});
  } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in SendCmd with message " + request.message);
  } catch (...) {
	  LOG_ERROR << "Unknown error in SendCmd with message " + request.message;
  }
}

void HeadsetIntegrationService::AddHandler(std::function<void(const Response&)> callback)
{
  m_callback = callback;
}

bool HeadsetIntegrationService::Start()
{
  try {
    Jabra_SetAppID(const_cast<char*>("HKiKNeRIdH/8s+aIRdIVuRoi0vs5TkCXaOmwIqr0rMM="));

    if (!Jabra_Initialize(
      NULL,
      StaticJabraDeviceAttachedFunc,
      StaticJabraDeviceRemovedFunc,
      NULL,
      StaticButtonInDataTranslatedFunc,
      0
    )) {
      return false;
    }

    // TODO: Check for return value ?
    Jabra_ConnectToJabraApplication(
      "D6B42896-E65B-4EC1-A037-27C65E8CFDE1",
      "Google Chrome Browser"
    );

    Jabra_SetSoftphoneReady(true);
  } catch (const std::exception& e) {
    log_exception(plog::Severity::fatal, e, "initializing Jabra SDK");
	  return false;
  } catch (...) {
	  LOG_FATAL << "Fatal unknown error initializing Jabra SDK: ";
	  return false;
  }

  return true;
}

unsigned short HeadsetIntegrationService::GetCurrentDeviceId()
{
  if (m_devices.size() == 0)
    return USHRT_MAX;

  return m_currentDeviceId;
}

bool HeadsetIntegrationService::SetCurrentDeviceId(unsigned short id)
{
  bool found = false;
  for (auto device : m_devices) {
    if (device.deviceID == id) {
      found = true;
    }
  }

  if (found || id == 0) {
    m_currentDeviceId = id;
    return true;
  }

  return false;
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

  return devicesAsString;
}

const std::vector<Jabra_DeviceInfo> HeadsetIntegrationService::GetDevices() {
  return m_devices; // return copy.
}

void HeadsetIntegrationService::Error(const Context& context, std::string msg, customDataType data)
{ 
  IF_LOG(plog::error) {
    LOG(plog::error) << "Error: " << msg;
  }

  m_callback(Response(context, "", "Error: " + msg, data));
}

void HeadsetIntegrationService::Event(const Context& context, std::string msg, customDataType data)
{
  IF_LOG(plog::info) {
    LOG(plog::info) << "Event: " << msg;
  }

  m_callback(Response(context, "Event: " + msg, "", data));
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
  try {
    std::lock_guard<std::mutex> lock(m_mtx);

    IF_LOG(plog::debug) {
      LOG(plog::debug) << "Received device " << deviceInfo.deviceID << " attached notification";
    }

    m_devices.push_back(deviceInfo);
    std::string deviceName(deviceInfo.deviceName);

    IF_LOG(plog::info) {
      LOG(plog::info) << "Attaching device " << deviceInfo.deviceName << " with id " << deviceInfo.deviceID;
    }

	  Event(Context::device(), "device attached", { std::make_pair("id", std::to_string(deviceInfo.deviceID)) });
  } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in JabraDeviceAttachedFunc");
	  Error(Context::device(), "Device attachment registration failed", { std::make_pair("exception", e.what()) });
  } catch (...) {
	  LOG_ERROR << "Unknown error in JabraDeviceAttachedFunc: ";
	  Error(Context::device(), "Device attachment registration failed", {});
  }
}

void HeadsetIntegrationService::JabraDeviceRemovedFunc(unsigned short deviceID)
{
  try {
    std::lock_guard<std::mutex> lock(m_mtx);

    IF_LOG(plog::debug) {
      LOG(plog::debug) << "Received device " << deviceID << " removal notification";
    }

    int index = -1;
    bool found = false;

    using Iter = std::vector<Jabra_DeviceInfo>::const_iterator;
    for (Iter it = m_devices.begin(); it != m_devices.end(); ++it) {
      index++;
      if ((*it).deviceID == deviceID)
      {
        std::string deviceName((*it).deviceName);

		    Event(Context::device(), "device detached", { std::make_pair("id", std::to_string(deviceID)) });

        m_devices.erase(m_devices.begin() + index);
        
        IF_LOG(plog::info) {
          LOG(plog::info) << "Sucessfully deattached device " << deviceName << " with id " << deviceID;
        }

        found = true;
        break;
      }
    }

    if (!found) {
      IF_LOG(plog::warning) {
        LOG(plog::warning) << "Unknown device with " << deviceID << " removed";
      }
    }

    // If the removed device was the active device, assign a new active device (if any)
    if (m_currentDeviceId == deviceID)
    {
      if (m_devices.size() == 0) 
      {
        SetCurrentDeviceId(0);
      }
      else
      {
        SetCurrentDeviceId(m_devices[0].deviceID);
      }
    }
  } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in JabraDeviceRemovedFunc");
    Error(Context::device(), "Device removal registration failed", { std::make_pair("exception", e.what()) });
  } catch (...) {
	  LOG_ERROR << "Unknown error in JabraDeviceRemovedFunc";
	  Error(Context::device(), "Device removal registration failed", {});
  }
}

void HeadsetIntegrationService::ButtonInDataTranslatedFunc(unsigned short deviceID, Jabra_HidInput translatedInData, bool buttonInData)
{
  try {
    std::lock_guard<std::mutex> lock(m_mtx);

    // Only handle input data from current device
    if (deviceID != GetCurrentDeviceId())
      return;
        
    IF_LOG(plog::info) {
      LOG(plog::info) << "Received button translated notification with data " << translatedInData << " for device " << deviceID;
    }

    EventInterface *event = m_events[translatedInData];
    if (event != NULL)
    {
      event->Execute(buttonInData);
    }
    else
    {
      std::string inDatastring = std::to_string(translatedInData);
	    Error(Context::device(), "No button handler impelmented for " + inDatastring, {});
    }
  } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in ButtonInDataTranslatedFunc");
    Error(Context::device(), "button translation failed", { std::make_pair("exception", e.what()) });
  } catch (...) {
	  LOG_ERROR << "Unknown error in ButtonInDataTranslatedFunc";
	  Error(Context::device(), "button translation failed", {});
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