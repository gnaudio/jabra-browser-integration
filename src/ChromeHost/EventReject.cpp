#include "stdafx.h"
#include "EventReject.h"

EventReject::EventReject(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

EventReject::~EventReject()
{
}

void EventReject::Execute(bool buttonInData)
{
  m_headsetIntegrationService->Event(buttonInData ? "reject" : "reject");
}
