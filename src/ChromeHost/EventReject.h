#pragma once

#include "EventInterface.h"
#include "HeadsetIntegrationService.h"

class EventReject : public EventInterface
{
public:
  EventReject(HeadsetIntegrationService* headsetIntegrationService);
  ~EventReject();

  void Execute(bool buttonInData);

protected:
  HeadsetIntegrationService* m_headsetIntegrationService;
};

