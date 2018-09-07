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
#include "Util.h"
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

// Helper to avoid wierd lambda compiler error if executing directly.
static void logQueued(Work * work) {
  LOG_INFO << "Queuing " << *work;
}

HeadsetIntegrationService::HeadsetIntegrationService() 
   : workQueue()
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

  // Finally start worker thread to dispatch incomming work to visiter methods.
  workerThread = std::thread(&HeadsetIntegrationService::workerThreadRunner, this);
}

HeadsetIntegrationService::~HeadsetIntegrationService()
{
  Stop();

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

void HeadsetIntegrationService::QueueRequest(const Request& request)
{
  RequestWork * const work = new RequestWork(request);
  logQueued(work);
  workQueue.enqueue(work);
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
      [](Jabra_DeviceInfo rawBasicDeviceInfo) {
        BasicDeviceInfo basicDevicdInfo(rawBasicDeviceInfo);
        Jabra_FreeDeviceInfo(rawBasicDeviceInfo);
        Work * const work = new DeviceAttachedWork(basicDevicdInfo);
        logQueued(work);
        g_thisHeadsetIntegrationService->workQueue.enqueue(work);
      },
      [](unsigned short deviceID) {
        Work * const work = new DeviceDeAttachedWork(deviceID);
		logQueued(work);
        g_thisHeadsetIntegrationService->workQueue.enqueue(work);
      },
      NULL,
      [](unsigned short deviceID, Jabra_HidInput translatedInData, bool buttonInData) {
        Work * const work = new ButtonInDataTranslatedWork(deviceID, translatedInData, buttonInData);
		logQueued(work);
        g_thisHeadsetIntegrationService->workQueue.enqueue(work);
      },
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

  LOG_INFO << "Integration service started successfully";

  return true;
}

void HeadsetIntegrationService::Stop()
{
  LOG_INFO << "Stopping integration service";

  workQueue.stop();
  if (workerThread.joinable()) {
	  workerThread.join();
  }

  LOG_INFO << "Integration service sucessfully stopped";
}

void HeadsetIntegrationService::workerThreadRunner() {
  LOG_INFO << "workerThread started";

  // Execute all events and requests in a single thread. This means that no other code 
  // in this class (unlike the underlaying worker/workerQueue used) need to deal with
  // multi-threading  issues + that code can safely call back in SDK without conflicts 
  // with callbacks since they have terminated before this runner gets the work.

  while (!workQueue.closed()) {
    try {
      Work* const work = workQueue.dequeue();
      if (work) {
        LOG_INFO << "before executing work " << *work;
        work->accept(* this);
        LOG_INFO << "after executing work " << *work;
        delete work;
      }
    } catch (std::exception e) {
      if (!workQueue.closed()) {
        LOG_FATAL << "Fatal error in workerThreadRunner: " << e.what();
      } else {
		LOG_ERROR << "Error during queue closing: " << e.what();
      }
    } catch (...) {
      LOG_FATAL << "Fatal unknown error in workerThreadRunner";
    }
  }

  LOG_INFO << "workerThread stopped";
}

void HeadsetIntegrationService::visit(const RequestWork& work) {
  try {
    using Iter = std::vector<CmdInterface*>::const_iterator;
    for (Iter it = m_commands.begin(); it != m_commands.end(); ++it) {
      if ((*it)->CanExecute(work.request))
      {
        (*it)->Execute(work.request);
        return;
      }
    }

	  Error(work.request, "Unknown cmd " + work.request.message, {});
  } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in SendCmd with message " + work.request.message);
  } catch (...) {
	  LOG_ERROR << "Unknown error in SendCmd with message " + work.request.message;
  }
}

void HeadsetIntegrationService::visit(const ButtonInDataTranslatedWork& work) {
  try {
    // Only handle input data from current device
    if (work.deviceID != GetCurrentDeviceId())
      return;
        
    IF_LOG(plog::info) {
      LOG(plog::info) << "Received button translated notification with data " << work.translatedInData << " for device " << work.deviceID;
    }

    EventInterface *event = m_events[work.translatedInData];
    if (event != NULL)
    {
      event->Execute(work.buttonInData);
    }
    else
    {
      std::string inDatastring = std::to_string(work.translatedInData);
	    Error(Context::device(), "No button handler implemented for " + inDatastring, {});
    }
  } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in ButtonInDataTranslatedFunc");
    Error(Context::device(), "button translation failed", { std::make_pair("exception", e.what()) });
  } catch (...) {
	  LOG_ERROR << "Unknown error in ButtonInDataTranslatedFunc";
	  Error(Context::device(), "button translation failed", {});
  }
}

void HeadsetIntegrationService::visit(const DeviceAttachedWork& work) {
 try {
    unsigned short deviceId = work.basicDeviceInfo.deviceID;

    IF_LOG(plog::debug) {
      LOG(plog::debug) << "Received device " << deviceId << " attached notification";
    }

	  DeviceInfo deviceInfo(work.basicDeviceInfo, getExtraDeviceInfo(deviceId));
    m_devices.push_back(deviceInfo);
    std::string deviceName = deviceInfo.getDeviceName();

    IF_LOG(plog::info) {
      LOG(plog::info) << "Attaching device " << deviceName << " with id " << deviceName;
    }

    WorkQueue& queue = workQueue;
    Jabra_RegisterDevLogCallback([](unsigned short deviceID, const char* eventStrRaw) {
      if (eventStrRaw) {
        std::string eventStr(eventStrRaw);
        Jabra_FreeString((char *)eventStrRaw);
        Work * const work = new DeviceDevLogWork(deviceID, eventStr);
        logQueued(work);
        g_thisHeadsetIntegrationService->workQueue.enqueue(work);
      }
    });

    Jabra_ReturnCode errCode;
    if ((errCode = Jabra_EnableDevLog(deviceId, true)) != Return_Ok ) {
	    LOG_ERROR << "Failed enabling dev log with code " << errCode;
    }

	nlohmann::json j;
	setDeviceInfo(j, deviceInfo);

    Event(Context::device(), "device attached", j);
  } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in JabraDeviceAttachedFunc");
	  Error(Context::device(), "Device attachment registration failed", { std::make_pair("exception", e.what()) });
  } catch (...) {
	  LOG_ERROR << "Unknown error in JabraDeviceAttachedFunc: ";
	  Error(Context::device(), "Device attachment registration failed", {});
  }
}

void HeadsetIntegrationService::visit(const DeviceDeAttachedWork& work) {
 try {
    IF_LOG(plog::debug) {
      LOG(plog::debug) << "Received device " << work.deviceID << " removal notification";
    }

    int index = -1;
    bool found = false;

    using Iter = std::vector<DeviceInfo>::const_iterator;
    for (Iter it = m_devices.begin(); it != m_devices.end(); ++it) {
      index++;
      if ((*it).getDeviceID() == work.deviceID) {
		nlohmann::json j;
		setDeviceInfo(j, (*it));

		Event(Context::device(), "device detached", j);

		std::string backupDeviceName = (*it).getDeviceName();
        m_devices.erase(m_devices.begin() + index);
        
        IF_LOG(plog::info) {
          LOG(plog::info) << "Successfully deattached device " << backupDeviceName << " with id " << work.deviceID;
        }

        found = true;
        break;
      }
    }

    if (!found) {
      IF_LOG(plog::warning) {
        LOG(plog::warning) << "Unknown device with " << work.deviceID << " removed";
      }
    }

    // If the removed device was the active device, assign a new active device (if any)
    if (m_currentDeviceId == work.deviceID)
    {
      if (m_devices.size() == 0) 
      {
        SetCurrentDeviceId(0);
      }
      else
      {
        SetCurrentDeviceId(m_devices[0].getDeviceID());
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

void HeadsetIntegrationService::visit(const DeviceDevLogWork& work) {
 try {
    nlohmann::json j = nlohmann::json::parse(work.eventStr);
    g_thisHeadsetIntegrationService->Event(Context::device(), "devlog", j);
  } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in DevLogCallback");
    g_thisHeadsetIntegrationService->Error(Context::device(), "parsing devlog failed", { std::make_pair("exception", e.what()) });
  } catch (...) {
	  LOG_ERROR << "Unknown error in DevLogCallback";
	  g_thisHeadsetIntegrationService->Error(Context::device(), "parsing devlog failed", {});
  }
}

const DeviceInfo& HeadsetIntegrationService::GetCurrentDevice() {
  for (const DeviceInfo& device : m_devices) {
    if (device.getDeviceID() == m_currentDeviceId) {
      return device;
    }
  }

  // Return empty structure indicating NO device:
  return DeviceInfo::empty();
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
  for (const DeviceInfo& device : m_devices) {
    if (device.getDeviceID() == id) {
      found = true;
    }
  }

  if (found || id == 0) {
    m_currentDeviceId = id;
    return true;
  }

  return false;
}

const std::vector<DeviceInfo> HeadsetIntegrationService::GetDevices() {
  return m_devices; // return copy.
}

void HeadsetIntegrationService::Error(const Context& context, const std::string& msg, const nlohmann::json& data)
{ 
  IF_LOG(plog::error) {
    LOG(plog::error) << "Error: " << msg;
  }

  m_callback(Response(context, "", "Error: " + msg, data));
}

void HeadsetIntegrationService::Event(const Context& context, const std::string& msg, const nlohmann::json& data)
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

ExtraDeviceInfo HeadsetIntegrationService::getExtraDeviceInfo(const unsigned short deviceId) 
{
  // Serial number:
  char serialNumberChars[128];
  if (Jabra_GetSerialNumber(deviceId, serialNumberChars, sizeof(serialNumberChars)) != Return_Ok) {
    serialNumberChars[0]=0;
  }

  // Construct ESNs:
  std::map<int, std::string> electricSerialNumbers;

  Map_Int_String * esns = Jabra_GetMultiESN(deviceId);
  if (esns) {
    for (int i=0; i < esns->length; ++i) {
		if (esns->entries[i].value) {
			electricSerialNumbers[esns->entries[i].key] = esns->entries[i].value;
		}
    }
    Jabra_FreeMap(esns);
  }

  // Firmware version:
  char firmwareChars[128];
  if (Jabra_GetFirmwareVersion(deviceId, firmwareChars, sizeof(firmwareChars)) != Return_Ok) {
    firmwareChars[0];
  }

  // Skype certification:
  bool skypeCertified = Jabra_IsCertifiedForSkypeForBusiness(deviceId);

  // BatteryStatus
  BatteryCombinedStatusInfo batteryStatus;
  if (Jabra_GetBatteryStatus(deviceId, &batteryStatus.levelInPercent, &batteryStatus.charging, &batteryStatus.batteryLow) != Return_Ok) {
    batteryStatus = BatteryCombinedStatusInfo::empty();
  }

    // Put everything together:
	return ExtraDeviceInfo(serialNumberChars,
                         electricSerialNumbers,
                         firmwareChars,
                         skypeCertified,
                         batteryStatus);
}

