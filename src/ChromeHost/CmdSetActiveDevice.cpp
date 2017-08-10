#include "stdafx.h"
#include "CmdSetActiveDevice.h"

CmdSetActiveDevice::CmdSetActiveDevice(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdSetActiveDevice::~CmdSetActiveDevice()
{
}

bool CmdSetActiveDevice::CanExecute(std::string cmd)
{
  size_t index = cmd.find("setactivedevice ");
  return (index == 0);
}

void CmdSetActiveDevice::Execute(std::string cmd)
{
  std::string subString = cmd.substr(std::string("setactivedevice ").length());

  unsigned short id = 0;

  try
  {
    id = std::stoi(subString);
    m_headsetIntegrationService->SetCurrentDeviceId(id);
  }
  catch (const std::invalid_argument&)
  {
    m_headsetIntegrationService->Error("unable to set active device");
  }
}
