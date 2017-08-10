#pragma once

#include "CmdInterface.h"
#include "HeadsetIntegrationService.h"

class CmdOnHook : public CmdInterface
{
public:
  CmdOnHook(HeadsetIntegrationService* headsetIntegrationService);
  ~CmdOnHook();

  virtual bool CanExecute(std::string cmd);
  virtual void Execute(std::string cmd);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

