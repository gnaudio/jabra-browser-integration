#include "stdafx.h"
#include "CmdRing.h"

CmdRing::CmdRing(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdRing::~CmdRing()
{
}

bool CmdRing::CanExecute(std::string cmd)
{
  return (cmd == "ring");
}

void CmdRing::Execute(std::string cmd)
{
  unsigned deviceId = m_headsetIntegrationService->GetCurrentDeviceId();
  if (deviceId == USHRT_MAX)
  {
    m_headsetIntegrationService->Error("No device");
    return;
  }

  Jabra_GetLock(deviceId);

  Jabra_ReturnCode ret = Jabra_SetRinger(deviceId, true);
  if (ret != Return_Ok)
  {
    m_headsetIntegrationService->Error("Unable to set ringer");
    return;
  }

  m_headsetIntegrationService->SetRingerStatus(deviceId, true);
}
