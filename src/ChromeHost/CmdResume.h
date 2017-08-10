#pragma once

#include "CmdInterface.h"
#include "HeadsetIntegrationService.h"

class CmdResume : public CmdInterface
{
public:
  CmdResume(HeadsetIntegrationService* headsetIntegrationService);
  ~CmdResume();

  virtual bool CanExecute(std::string cmd);
  virtual void Execute(std::string cmd);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

