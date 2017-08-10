#include "stdafx.h"
#include "EventFlash.h"

EventFlash::EventFlash(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}
EventFlash::~EventFlash()
{
}

void EventFlash::Execute(bool buttonInData)
{
  m_headsetIntegrationService->Event(buttonInData ? "flash" : "flash");
}
