#pragma once

#include "CmdInterface.h"
#include "HeadsetIntegrationService.h"

class CmdMute : public CmdInterface
{
public:
  CmdMute(HeadsetIntegrationService* headsetIntegrationService);
  ~CmdMute();

  virtual bool CanExecute(std::string cmd);
  virtual void Execute(std::string cmd);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

