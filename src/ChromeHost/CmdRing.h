#pragma once

#include "CmdInterface.h"
#include "HeadsetIntegrationService.h"

class CmdRing : public CmdInterface
{
public:
  CmdRing(HeadsetIntegrationService* headsetIntegrationService);
  ~CmdRing();

  virtual bool CanExecute(std::string cmd);
  virtual void Execute(std::string cmd);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

