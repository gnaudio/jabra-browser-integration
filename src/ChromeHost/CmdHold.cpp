#include "stdafx.h"
#include "CmdHold.h"

CmdHold::CmdHold(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdHold::~CmdHold()
{
}

bool CmdHold::CanExecute(std::string cmd)
{
  return (cmd == "hold");
}

void CmdHold::Execute(std::string cmd)
{
  unsigned deviceId = m_headsetIntegrationService->GetCurrentDeviceId();
  if (deviceId == USHRT_MAX)
  {
    m_headsetIntegrationService->Error("No device");
    return;
  }

  Jabra_GetLock(deviceId);

  Jabra_ReturnCode ret = Jabra_SetHold(deviceId, true);
  if (ret != Return_Ok)
  {
    m_headsetIntegrationService->Error("Unable to hold");
  }
}
