#include "stdafx.h"
#include "CmdOnHook.h"

CmdOnHook::CmdOnHook(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdOnHook::~CmdOnHook()
{
}

bool CmdOnHook::CanExecute(std::string cmd)
{
  return (cmd == "onhook");
}

void CmdOnHook::Execute(std::string cmd)
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

  Jabra_ReturnCode ret = Jabra_SetOffHook(deviceId, false);
  if (ret != Return_Ok)
  {
    m_headsetIntegrationService->Error("Unable to go onhook");
    return;
  }

  m_headsetIntegrationService->SetHookStatus(deviceId, false);
}