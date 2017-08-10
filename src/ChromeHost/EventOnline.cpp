#include "stdafx.h"
#include "EventOnline.h"

EventOnline::EventOnline(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

EventOnline::~EventOnline()
{
}

void EventOnline::Execute(bool buttonInData)
{
  m_headsetIntegrationService->Event(buttonInData ? "online" : "offline");
}
