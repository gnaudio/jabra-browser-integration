#pragma once

#include "EventInterface.h"
#include "HeadsetIntegrationService.h"

class EventMicMute : public EventInterface
{
public:
  EventMicMute(HeadsetIntegrationService* headsetIntegrationService);
  ~EventMicMute();

  void Execute(bool buttonInData);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

