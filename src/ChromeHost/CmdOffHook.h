#pragma once

#include "CmdInterface.h"
#include "HeadsetIntegrationService.h"

class CmdOffHook : public CmdInterface
{
public:
  CmdOffHook(HeadsetIntegrationService* headsetIntegrationService);
  ~CmdOffHook();

  virtual bool CanExecute(std::string cmd);
  virtual void Execute(std::string cmd);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

