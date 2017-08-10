#pragma once

#include "EventInterface.h"
#include "HeadsetIntegrationService.h"

class EventOffHook : public EventInterface
{
public:
  EventOffHook(HeadsetIntegrationService* headsetIntegrationService);
  ~EventOffHook();

  void Execute(bool buttonInData);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

