#pragma once

#include "CmdInterface.h"
#include "HeadsetIntegrationService.h"

class CmdGetActiveDevice : public CmdInterface
{
public:
  CmdGetActiveDevice(HeadsetIntegrationService* headsetIntegrationService);
  ~CmdGetActiveDevice();

  virtual bool CanExecute(std::string cmd);
  virtual void Execute(std::string cmd);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

