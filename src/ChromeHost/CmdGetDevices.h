#pragma once

#include "CmdInterface.h"
#include "HeadsetIntegrationService.h"

class CmdGetDevices : public CmdInterface
{
public:
  CmdGetDevices(HeadsetIntegrationService* headsetIntegrationService);
  ~CmdGetDevices();

  virtual bool CanExecute(std::string cmd);
  virtual void Execute(std::string cmd);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

