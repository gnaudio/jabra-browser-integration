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
#include "CmdSetBusyLight.h"
#include "EventMapper.h"

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

  m_commands = {
    new CmdOffHook(this),
    new CmdOnHook(this),
    new CmdRing(this),
    new CmdMute(this),
    new CmdUnmute(this),
    new CmdHold(this),
    new CmdResume(this),
    new CmdGetDevices(this),
    new CmdGetActiveDevice(this),
    new CmdSetActiveDevice(this),
    new CmdGetVersion(this),
    new CmdGetInstallInfo(this),
    new CmdSetBusyLight(this)
  };

  buttonEventMappings = { // Note this is for button events only - there are other events not mentioned here:
    { { Jabra_HidInput::Mute, true }, new SimpleEventMapper("mute") },
    { { Jabra_HidInput::Mute, false }, new SimpleEventMapper("unmute") },

    { { Jabra_HidInput::OffHook, true }, new EventOffHookMapper("acceptcall", this) },
    { { Jabra_HidInput::OffHook, false }, new EventOnHookMapper("endcall", this) },

    { { Jabra_HidInput::Online, true }, new SimpleEventMapper("online") },
    { { Jabra_HidInput::Online, false }, new SimpleEventMapper("offline") },

    { { Jabra_HidInput::LineBusy, true }, new SimpleEventMapper("linebusy") },
    { { Jabra_HidInput::LineBusy, false }, new SimpleEventMapper("linebusy") },

    { { Jabra_HidInput::RejectCall, true }, new SimpleEventMapper("reject") },
    { { Jabra_HidInput::RejectCall, false }, new SimpleEventMapper("reject") },

    { { Jabra_HidInput::Flash, true }, new SimpleEventMapper("flash") },
    { { Jabra_HidInput::Flash, false }, new SimpleEventMapper("flash") },

    { { Jabra_HidInput::Key0, true }, new SimpleEventMapper("key0") },
    { { Jabra_HidInput::Key0, false }, new SimpleEventMapper("key0") },

    { { Jabra_HidInput::Key1, true }, new SimpleEventMapper("key1") },
    { { Jabra_HidInput::Key1, false }, new SimpleEventMapper("key1") },

    { { Jabra_HidInput::Key2, true }, new SimpleEventMapper("key2") },
    { { Jabra_HidInput::Key2, false }, new SimpleEventMapper("key2") },

    { { Jabra_HidInput::Key3, true }, new SimpleEventMapper("key3") },
    { { Jabra_HidInput::Key3, false }, new SimpleEventMapper("key3") },

    { { Jabra_HidInput::Key4, true }, new SimpleEventMapper("key4") },
    { { Jabra_HidInput::Key4, false }, new SimpleEventMapper("key4") },

    { { Jabra_HidInput::Key5, true }, new SimpleEventMapper("key5") },
    { { Jabra_HidInput::Key5, false }, new SimpleEventMapper("key5") },

    { { Jabra_HidInput::Key6, true }, new SimpleEventMapper("key6") },
    { { Jabra_HidInput::Key6, false }, new SimpleEventMapper("key6") },

    { { Jabra_HidInput::Key7, true }, new SimpleEventMapper("key7") },
    { { Jabra_HidInput::Key7, false }, new SimpleEventMapper("key7") },

    { { Jabra_HidInput::Key8, true }, new SimpleEventMapper("key8") },
    { { Jabra_HidInput::Key8, false }, new SimpleEventMapper("key8") },

    { { Jabra_HidInput::Key9, true }, new SimpleEventMapper("key9") },
    { { Jabra_HidInput::Key9, false }, new SimpleEventMapper("key9") },

    { { Jabra_HidInput::KeyStar, true }, new SimpleEventMapper("keyStar") },
    { { Jabra_HidInput::KeyStar, false }, new SimpleEventMapper("keyStar") },

    { { Jabra_HidInput::KeyPound, true }, new SimpleEventMapper("keyPound") },
    { { Jabra_HidInput::KeyPound, false }, new SimpleEventMapper("keyPound") },

    { { Jabra_HidInput::KeyClear, true }, new SimpleEventMapper("keyClear") },
    { { Jabra_HidInput::KeyClear, false }, new SimpleEventMapper("keyClear") },
   
    { { Jabra_HidInput::SpeedDial, true }, new SimpleEventMapper("speedDial") },
    { { Jabra_HidInput::SpeedDial, false }, new SimpleEventMapper("speedDial") },

    { { Jabra_HidInput::VoiceMail, true }, new SimpleEventMapper("voiceMail") },
    { { Jabra_HidInput::VoiceMail, false }, new SimpleEventMapper("voiceMail") },

    { { Jabra_HidInput::OutOfRange, true }, new SimpleEventMapper("outOfRange") },
    { { Jabra_HidInput::OutOfRange, false }, new SimpleEventMapper("outOfRange") },
  
    { { Jabra_HidInput::PseudoOffHook, true }, new SimpleEventMapper("pseudoOffHook") },
    { { Jabra_HidInput::PseudoOffHook, false }, new SimpleEventMapper("pseudoOffHook") },

    { { Jabra_HidInput::Button1, true }, new SimpleEventMapper("button1") },
    { { Jabra_HidInput::Button1, false }, new SimpleEventMapper("button1") },

    { { Jabra_HidInput::Button2, true }, new SimpleEventMapper("button2") },
    { { Jabra_HidInput::Button2, false }, new SimpleEventMapper("button2") },

    { { Jabra_HidInput::Button3, true }, new SimpleEventMapper("button3") },
    { { Jabra_HidInput::Button3, false }, new SimpleEventMapper("button3") },

    { { Jabra_HidInput::VolumeUp, true }, new SimpleEventMapper("volumeUp") },
    { { Jabra_HidInput::VolumeUp, false }, new SimpleEventMapper("volumeUp") },

    { { Jabra_HidInput::VolumeDown, true }, new SimpleEventMapper("volumeDown") },
    { { Jabra_HidInput::VolumeDown, false }, new SimpleEventMapper("volumeDown") },

    { { Jabra_HidInput::FireAlarm, true }, new SimpleEventMapper("fireAlarm") },
    { { Jabra_HidInput::FireAlarm, false }, new SimpleEventMapper("fireAlarm") },

    { { Jabra_HidInput::JackConnection, true }, new SimpleEventMapper("jackConnection") },
    { { Jabra_HidInput::JackConnection, false }, new SimpleEventMapper("jackConnection") },

    { { Jabra_HidInput::QDConnection, true }, new SimpleEventMapper("qdConnection") },
    { { Jabra_HidInput::QDConnection, false }, new SimpleEventMapper("qdConnection") },

    { { Jabra_HidInput::QDConnection, true }, new SimpleEventMapper("headsetConnection") },
    { { Jabra_HidInput::QDConnection, false }, new SimpleEventMapper("headsetConnection") }
  };

  // Finally start worker thread to dispatch incomming work to visitor methods.
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

void HeadsetIntegrationService::processRequest(const RequestWork& work) {
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

void HeadsetIntegrationService::processButtonInDataTranslated(const ButtonInDataTranslatedWork& work) {
  try {
    // Only handle input data from current device
    if (work.deviceID != GetCurrentDeviceId())
      return;
        
    IF_LOG(plog::info) {
      LOG(plog::info) << "Received button translated notification with data " << work.data.translatedInData << " for device " << work.deviceID;
    }

    const EventMapper * mapper = buttonEventMappings[work.data];
    if (mapper) {
      if (mapper->accept(work.deviceID, work.data)) {
       std::string outputEventName = mapper->getEventName();
       Event(Context::device(), outputEventName, { { "deviceID", work.deviceID }, { "buttonInData", work.data.buttonInData }, { "translatedInData", work.data.translatedInData } });
      }
    } else {
      std::string inDatastring = std::to_string(work.data.translatedInData);
	    Error(Context::device(), "No mappings specified for button event " + inDatastring + " with buttonInData = " + std::to_string(work.data.buttonInData), {});
    }
  } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in processButtonInDataTranslated");
    Error(Context::device(), "button translation failed", { std::make_pair("exception", e.what()) });
  } catch (...) {
	  LOG_ERROR << "Unknown error in processButtonInDataTranslated";
	  Error(Context::device(), "button translation failed", {});
  }
}

void HeadsetIntegrationService::processDeviceAttached(const DeviceAttachedWork& work) {
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

    Jabra_RegisterDevLogCallback([](unsigned short deviceID, const char* eventStrRaw) {
      if (eventStrRaw) {
        std::string eventStr(eventStrRaw);
        Jabra_FreeString((char *)eventStrRaw);
        Work * const work = new DeviceDevLogWork(deviceID, eventStr);
        logQueued(work);
        g_thisHeadsetIntegrationService->workQueue.enqueue(work);
      }
    });

    Jabra_RegisterBusylightEvent([](unsigned short deviceID, const bool busy) {
       Work * const work = new BusylightWork(deviceID, busy);
       g_thisHeadsetIntegrationService->workQueue.enqueue(work);
    });

    Jabra_RegisterBatteryStatusUpdateCallback([](unsigned short deviceID, int levelInPercent, bool charging, bool batteryLow) {
        Work * const work = new BatteryStatusWork(deviceID, levelInPercent, charging, batteryLow);
        g_thisHeadsetIntegrationService->workQueue.enqueue(work);
    });


    Jabra_ReturnCode errCode;
    if ((errCode = Jabra_EnableDevLog(deviceId, true)) != Return_Ok ) {
	    LOG_ERROR << "Failed enabling dev log with code " << errCode;
    }

	  nlohmann::json j;

    DynamicDeviceInfo dynDevicdeInfo = getDynamicDeviceInfo(deviceId);
	  setDeviceInfo(j, deviceInfo, dynDevicdeInfo);

    Event(Context::device(), "device attached", j);
  } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in processDeviceAttached");
	  Error(Context::device(), "Device attachment registration failed", { std::make_pair("exception", e.what()) });
  } catch (...) {
	  LOG_ERROR << "Unknown error in processDeviceAttached: ";
	  Error(Context::device(), "Device attachment registration failed", {});
  }
}

void HeadsetIntegrationService::processDeviceDeAttached(const DeviceDeAttachedWork& work) {
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
        setDeviceInfo(j, (*it), DynamicDeviceInfo::empty());

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
    log_exception(plog::Severity::error, e, "in processDeviceDeAttached");
    Error(Context::device(), "Device removal registration failed", { std::make_pair("exception", e.what()) });
  } catch (...) {
	  LOG_ERROR << "Unknown error in processDeviceDeAttached";
	  Error(Context::device(), "Device removal registration failed", {});
  }
}

void HeadsetIntegrationService::processDevLog(const DeviceDevLogWork& work) {
 try {
    nlohmann::json eventData = nlohmann::json();
    eventData["deviceID"] = work.deviceID;
    eventData["event"] = nlohmann::json::parse(work.eventStr);
    g_thisHeadsetIntegrationService->Event(Context::device(), "devlog", eventData);
  } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in processDevLog");
    g_thisHeadsetIntegrationService->Error(Context::device(), "parsing devlog failed", { std::make_pair("exception", e.what()) });
  } catch (...) {
	  LOG_ERROR << "Unknown error in processDevLog";
	  g_thisHeadsetIntegrationService->Error(Context::device(), "parsing devlog failed", {});
  }
}

void HeadsetIntegrationService::processBusylight(const BusylightWork& work) {
 try {
    Event(Context::device(), "busylight", { std::make_pair("value", work.busy), std::make_pair("deviceID", work.deviceID) });
 } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in processBusylight");
    g_thisHeadsetIntegrationService->Error(Context::device(), "busylight event failed", { std::make_pair("exception", e.what()) });
 } catch (...) {
	  LOG_ERROR << "Unknown error in processBusylight";
	  g_thisHeadsetIntegrationService->Error(Context::device(), "busylight event failed", {});
 }
}

void HeadsetIntegrationService::processHearThroughSetting(const HearThroughSettingWork& work) {
 try {
    Event(Context::device(), "hearThrough", { std::make_pair("value", work.status), std::make_pair("deviceID", work.deviceID) });
 } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in processHearThroughSetting");
    g_thisHeadsetIntegrationService->Error(Context::device(), "hearthorugh setting event failed", { std::make_pair("exception", e.what()) });
 } catch (...) {
	  LOG_ERROR << "Unknown error in processHearThroughSetting";
	  g_thisHeadsetIntegrationService->Error(Context::device(), "hearthorugh setting event failed", {});
 }
}

void HeadsetIntegrationService::processBatteryStatus(const BatteryStatusWork& work) {
 try {
    Event(Context::device(), "batteryStatus", {
      std::make_pair("batteryLevelInPercent", work.status.levelInPercent),
      std::make_pair("batteryCharging", work.status.charging),
      std::make_pair("batteryLow", work.status.batteryLow),            
      std::make_pair("deviceID", work.deviceID) 
    });
 } catch (const std::exception& e) {
    log_exception(plog::Severity::error, e, "in processHearThroughSetting");
    g_thisHeadsetIntegrationService->Error(Context::device(), "hearthorugh setting event failed", { std::make_pair("exception", e.what()) });
 } catch (...) {
	  LOG_ERROR << "Unknown error in processHearThroughSetting";
	  g_thisHeadsetIntegrationService->Error(Context::device(), "hearthorugh setting event failed", {});
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

  // Device features:
  unsigned int deviceFeaturesCount;
  std::vector<DeviceFeature> deviceFeatures;
  const DeviceFeature * rawDeviceFeatures;
  if ((rawDeviceFeatures = Jabra_GetSupportedFeatures(deviceId, &deviceFeaturesCount)) != nullptr) {
    for (unsigned int i=0; i<deviceFeaturesCount; ++i) {
      deviceFeatures.push_back(rawDeviceFeatures[i]);
    }

    Jabra_FreeSupportedFeatures(rawDeviceFeatures);
  }
 
  // Put everything together:
  return ExtraDeviceInfo(serialNumberChars,
                         electricSerialNumbers,
                         firmwareChars,
                         skypeCertified,
                         deviceFeatures);
}

DynamicDeviceInfo HeadsetIntegrationService::getDynamicDeviceInfo(const unsigned short deviceId) 
{ 
  BatteryCombinedStatusInfo batteryStatus;
  if (Jabra_GetBatteryStatus(deviceId, &batteryStatus.levelInPercent, &batteryStatus.charging, &batteryStatus.batteryLow) == Return_Ok) {
    batteryStatus.supported = true;
  } else {
    batteryStatus = BatteryCombinedStatusInfo::empty();
  }

  OptionalStatus leftEarBudStatus;
  leftEarBudStatus.supported = Jabra_IsLeftEarbudStatusSupported(deviceId);
  if (leftEarBudStatus.supported) {
    leftEarBudStatus.status= Jabra_GetLeftEarbudStatus(deviceId);
  }

  OptionalStatus equalizerEnabled;
  equalizerEnabled.supported = Jabra_IsEqualizerSupported(deviceId);
  if (equalizerEnabled.supported) {
    equalizerEnabled.status = Jabra_IsEqualizerEnabled(deviceId);
  }

  OptionalStatus busyLight;
  busyLight.supported = Jabra_IsBusylightSupported(deviceId);
  if (busyLight.supported) {
      busyLight.status = Jabra_GetBusylightStatus(deviceId);
  }

  return DynamicDeviceInfo(batteryStatus, leftEarBudStatus, equalizerEnabled, busyLight);
}

