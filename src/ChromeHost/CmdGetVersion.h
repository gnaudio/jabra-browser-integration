#pragma once

#include "CmdInterface.h"
#include "HeadsetIntegrationService.h"

class CmdGetVersion : public CmdInterface
{
public:
  CmdGetVersion(HeadsetIntegrationService* headsetIntegrationService);
  ~CmdGetVersion();

  virtual bool CanExecute(std::string cmd);
  virtual void Execute(std::string cmd);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

