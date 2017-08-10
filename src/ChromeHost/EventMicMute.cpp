#include "stdafx.h"
#include "EventMicMute.h"

EventMicMute::EventMicMute(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

EventMicMute::~EventMicMute()
{
}

void EventMicMute::Execute(bool buttonInData)
{
  m_headsetIntegrationService->Event(buttonInData ? "mute" : "unmute");
}
