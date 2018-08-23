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

#include "stdafx.h"
#include <string>
#include "CmdGetDevices.h"

CmdGetDevices::CmdGetDevices(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdGetDevices::~CmdGetDevices()
{
}

bool CmdGetDevices::CanExecute(const Request& request)
{
  return (request.message == "getdevices");
}

void CmdGetDevices::Execute(const Request& request)
{
  // Get devices as string for <= 0.5 compatability.
  std::string devicesAsString = m_headsetIntegrationService->GetDevicesAsString();

  // Get device info as proper map for > 0.5:
  customDataType data = {};
  const std::vector<Jabra_DeviceInfo> devices = m_headsetIntegrationService->GetDevices();
  for (std::vector<int>::size_type i = 0; i != devices.size(); i++) {
    const std::string deviceId = std::to_string(devices[i].deviceID);
    const std::string deviceName = std::string(devices[i].deviceName);
    data.insert(std::make_pair(deviceId, deviceName));
  }

  // Return both old and new device info.
  m_headsetIntegrationService->Event(request, "devices " + devicesAsString, data);
}
