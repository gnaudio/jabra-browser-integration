#pragma once

#include "EventInterface.h"
#include "HeadsetIntegrationService.h"

class EventLineBusy : public EventInterface
{
public:
  EventLineBusy(HeadsetIntegrationService* headsetIntegrationService);
  ~EventLineBusy();

  void Execute(bool buttonInData);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

