#pragma once

#include "CmdInterface.h"
#include "HeadsetIntegrationService.h"

class CmdHold : public CmdInterface
{
public:
  CmdHold(HeadsetIntegrationService* headsetIntegrationService);
  ~CmdHold();

  virtual bool CanExecute(std::string cmd);
  virtual void Execute(std::string cmd);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

