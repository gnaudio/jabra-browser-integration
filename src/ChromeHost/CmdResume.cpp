#include "stdafx.h"
#include "CmdResume.h"

CmdResume::CmdResume(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdResume::~CmdResume()
{
}

bool CmdResume::CanExecute(std::string cmd)
{
  return (cmd == "resume");
}

void CmdResume::Execute(std::string cmd)
{
  unsigned deviceId = m_headsetIntegrationService->GetCurrentDeviceId();
  if (deviceId == USHRT_MAX)
  {
    m_headsetIntegrationService->Error("No device");
    return;
  }

  Jabra_GetLock(deviceId);

  Jabra_ReturnCode ret = Jabra_SetHold(deviceId, false);
  if (ret != Return_Ok)
  {
    m_headsetIntegrationService->Error("Unable to resume");
  }
}
