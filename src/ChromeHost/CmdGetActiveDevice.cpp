/*
Jabra Browser Integration
https://github.com/gnaudio/jabra-browser-integration

MIT License

Copyright (c) 2017 GN Audio A/S (Jabra)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

#include <climits>
#include "stdafx.h"
#include "CmdGetActiveDevice.h"
#include "Util.h"

CmdGetActiveDevice::CmdGetActiveDevice(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdGetActiveDevice::~CmdGetActiveDevice()
{
}

bool CmdGetActiveDevice::CanExecute(const Request& request)
{
  return (request.message == "getactivedevice");
}

void CmdGetActiveDevice::Execute(const Request& request)
{
  const DeviceInfo& deviceInfo = m_headsetIntegrationService->GetCurrentDevice();

  if (deviceInfo.isEmpty())
  {
	  m_headsetIntegrationService->Event(request, "activedevice -1", nlohmann::json::value_t::object);
  } else {
    nlohmann::json j;
	  setDeviceInfo(j, deviceInfo, m_headsetIntegrationService->getDynamicDeviceInfo(deviceInfo));
    m_headsetIntegrationService->Event(request, "activedevice " + std::to_string(deviceInfo.getDeviceID()), j);
  }
}
