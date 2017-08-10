#pragma once

#include "EventInterface.h"
#include "HeadsetIntegrationService.h"

class EventOnline : public EventInterface
{
public:
  EventOnline(HeadsetIntegrationService* headsetIntegrationService);
  ~EventOnline();

  void Execute(bool buttonInData);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

