#include "stdafx.h"
#include "CmdGetVersion.h"

CmdGetVersion::CmdGetVersion(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdGetVersion::~CmdGetVersion()
{
}

bool CmdGetVersion::CanExecute(std::string cmd)
{
  return (cmd == "getversion");
}

void CmdGetVersion::Execute(std::string cmd)
{
  m_headsetIntegrationService->Event("Version 0.5");
}
