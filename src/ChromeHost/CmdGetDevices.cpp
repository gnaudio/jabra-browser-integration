#include "stdafx.h"
#include "CmdGetDevices.h"

CmdGetDevices::CmdGetDevices(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdGetDevices::~CmdGetDevices()
{
}

bool CmdGetDevices::CanExecute(std::string cmd)
{
  return (cmd == "getdevices");
}

void CmdGetDevices::Execute(std::string cmd)
{
  std::string devicesAsString = m_headsetIntegrationService->GetDevicesAsString();
  m_headsetIntegrationService->Event(devicesAsString);
}
