#include "stdafx.h"
#include "EventOffHook.h"

EventOffHook::EventOffHook(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

EventOffHook::~EventOffHook()
{
}

void EventOffHook::Execute(bool buttonInData)
{
  unsigned short deviceId = m_headsetIntegrationService->GetCurrentDeviceId();

  if (buttonInData)
  {
    if (m_headsetIntegrationService->GetRingerStatus(deviceId))
    {
      m_headsetIntegrationService->Event("acceptcall");
    }
  }
  else
  {
    if (m_headsetIntegrationService->GetHookStatus(deviceId))
    {
      m_headsetIntegrationService->Event("endcall");
    }
  }
}
