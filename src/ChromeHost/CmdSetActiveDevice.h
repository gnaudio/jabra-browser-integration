#pragma once

#include "CmdInterface.h"
#include "HeadsetIntegrationService.h"

class CmdSetActiveDevice : public CmdInterface
{
public:
  CmdSetActiveDevice(HeadsetIntegrationService* headsetIntegrationService);
  ~CmdSetActiveDevice();

  virtual bool CanExecute(std::string cmd);
  virtual void Execute(std::string cmd);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

