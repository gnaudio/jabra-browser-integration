#pragma once

#include "EventInterface.h"
#include "HeadsetIntegrationService.h"

class EventFlash : public EventInterface
{
public:
  EventFlash(HeadsetIntegrationService* headsetIntegrationService);
  ~EventFlash();

  void Execute(bool buttonInData);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

