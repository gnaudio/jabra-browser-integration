#include "stdafx.h"
#include "CmdGetActiveDevice.h"

CmdGetActiveDevice::CmdGetActiveDevice(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdGetActiveDevice::~CmdGetActiveDevice()
{
}

bool CmdGetActiveDevice::CanExecute(std::string cmd)
{
  return (cmd == "getactivedevice");
}

void CmdGetActiveDevice::Execute(std::string cmd)
{
  unsigned short id = m_headsetIntegrationService->GetCurrentDeviceId();
  if (id == USHRT_MAX)
  {
    m_headsetIntegrationService->Event("activedevice -1");
    return;
  }

  std::string activeDevice = "activedevice " + std::to_string(id);
  m_headsetIntegrationService->Event(activeDevice);
}
