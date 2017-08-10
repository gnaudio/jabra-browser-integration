#include "stdafx.h"
#include "EventLineBusy.h"

EventLineBusy::EventLineBusy(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

EventLineBusy::~EventLineBusy()
{
}

void EventLineBusy::Execute(bool buttonInData)
{
  m_headsetIntegrationService->Event(buttonInData ? "online" : "offline");
}
