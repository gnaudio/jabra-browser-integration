#include "stdafx.h"
#include "CmdUnmute.h"

CmdUnmute::CmdUnmute(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdUnmute::~CmdUnmute()
{
}

bool CmdUnmute::CanExecute(std::string cmd)
{
  return (cmd == "unmute");
}

void CmdUnmute::Execute(std::string cmd)
{
  unsigned deviceId = m_headsetIntegrationService->GetCurrentDeviceId();
  if (deviceId == USHRT_MAX)
  {
    m_headsetIntegrationService->Error("No device");
    return;
  }

  Jabra_GetLock(deviceId);

  Jabra_ReturnCode ret = Jabra_SetMute(deviceId, false);
  if (ret != Return_Ok)
  {
    m_headsetIntegrationService->Error("Unable to mute");
  }
}
