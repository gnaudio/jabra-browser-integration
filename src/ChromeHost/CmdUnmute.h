#pragma once

#include "CmdInterface.h"
#include "HeadsetIntegrationService.h"

class CmdUnmute : public CmdInterface
{
public:
  CmdUnmute(HeadsetIntegrationService* headsetIntegrationService);
  ~CmdUnmute();

  virtual bool CanExecute(std::string cmd);
  virtual void Execute(std::string cmd);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

