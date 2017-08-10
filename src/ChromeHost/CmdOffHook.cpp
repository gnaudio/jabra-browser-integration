#include "stdafx.h"
#include "CmdOffHook.h"

CmdOffHook::CmdOffHook(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdOffHook::~CmdOffHook()
{
}

bool CmdOffHook::CanExecute(std::string cmd)
{
  return (cmd == "offhook");
}

void CmdOffHook::Execute(std::string cmd)
{
  unsigned deviceId = m_headsetIntegrationService->GetCurrentDeviceId();
  if (deviceId == USHRT_MAX)
  {
    m_headsetIntegrationService->Error("No device");
    return;
  }

  Jabra_GetLock(deviceId);

  // Stop ringer
  if (m_headsetIntegrationService->GetRingerStatus(deviceId))
  {
    Jabra_SetRinger(deviceId, false);
    m_headsetIntegrationService->SetRingerStatus(deviceId, false);
  }

  Jabra_ReturnCode ret = Jabra_SetOffHook(deviceId, true);
  if (ret != Return_Ok)
  {
    m_headsetIntegrationService->Error("Unable to offhook");
    return;
  }

  m_headsetIntegrationService->SetHookStatus(deviceId, true);
}
