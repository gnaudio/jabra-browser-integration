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
#include "Util.h"

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
  nlohmann::json j;

  const std::vector<DeviceInfo> devices = m_headsetIntegrationService->GetDevices();
  if (devices.size() == 0) {
	  j = nlohmann::json::array(); // Empty json array.
  }
  else {
	  for (std::vector<int>::size_type i = 0; i != devices.size(); i++) {
		  setDeviceInfo(j[i], devices[i], m_headsetIntegrationService->getDynamicDeviceInfo(devices[i]));
	  }
  }

  // For backward compatability with <= 0.5, also return devices extract as a string.
  std::string devicesAsString;

  for (std::vector<int>::size_type i = 0; i != devices.size(); i++) {

    if (devicesAsString.length() > 0) {
      devicesAsString += ",";
    }

    devicesAsString += std::to_string(devices[i].getDeviceID());
    devicesAsString += ",";
    devicesAsString += devices[i].getDeviceName();
  }


  // Return both old and new stype device info.
  m_headsetIntegrationService->Event(request, "devices " + devicesAsString, j);
}
