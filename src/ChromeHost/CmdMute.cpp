#include "stdafx.h"
#include "CmdMute.h"

CmdMute::CmdMute(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdMute::~CmdMute()
{
}

bool CmdMute::CanExecute(std::string cmd)
{
  return (cmd == "mute");
}

void CmdMute::Execute(std::string cmd)
{
  unsigned deviceId = m_headsetIntegrationService->GetCurrentDeviceId();
  if (deviceId == USHRT_MAX)
  {
    m_headsetIntegrationService->Error("No device");
    return;
  }

  Jabra_GetLock(deviceId);

  Jabra_ReturnCode ret = Jabra_SetMute(deviceId, true);
  if (ret != Return_Ok)
  {
    m_headsetIntegrationService->Error("Unable to mute");
  }
}
