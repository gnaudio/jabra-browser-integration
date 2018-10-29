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
#include "CmdSetActiveDevice.h"

const char * const commandStr1 = "setactivedevice";
const char * const commandStr2 = "setactivedevice2";

CmdSetActiveDevice::CmdSetActiveDevice(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdSetActiveDevice::~CmdSetActiveDevice()
{
}

bool CmdSetActiveDevice::CanExecute(const Request& request)
{
  size_t index1 = request.message.find(commandStr1);
  size_t index2 = request.message.find(commandStr2);
  return (index2 == 0 || index1 == 0);
}

// This operation is old and because of backwards compatability getting input arguments 
// are complex, so this function lookup in both new and old places:
unsigned short CmdSetActiveDevice::GetArgumentId(const Request& request) {
  // First try to read value as proper json argument (new for v2.0):
  unsigned short id = defaultValue(request.args, SET_ACTIVE_DEVICE_COMMAND_ARG_ID, USHRT_MAX);

  // If unsuccessful, for orginal command fall back on old-style way of passing in parameter for backwards compatability.
  if (id == USHRT_MAX && request.message != commandStr2) {
    const unsigned int commandStrLen = std::string(commandStr1).length()+1; // Include legacy space after cmd.
    if (request.message.length() > commandStrLen) {
      std::string subString = request.message.substr(commandStrLen);
      try
      {
        id = std::stoi(subString);
      }
      catch (const std::invalid_argument& e)
      {
        m_headsetIntegrationService->Error(request, "legacy argument parse error", { std::make_pair(JSON_KEY_EXCEPTION, e.what()) });
      }

      LOG_INFO << "CmdSetActiveDevice: Id lookedup as legacy argument: " << id;
    }
  }

  return id;
}

void CmdSetActiveDevice::Execute(const Request& request)
{
  unsigned short id = GetArgumentId(request);

  if (request.message == commandStr2) {
    if (id != USHRT_MAX) { // New command without compatability - with event when finished.
      if (!m_headsetIntegrationService->SetCurrentDeviceId(id)) {
       m_headsetIntegrationService->Error(request, commandStr2, {
         { JSON_KEY_COMMAND, request.message },
         { JSON_KEY_JABRA_RETURN_ERRORCODE, Device_Unknown },
         { JSON_KEY_ERROR_MESSAGE, "no device with id = " + std::to_string(id) + " attached" }
       });
      } else {
        m_headsetIntegrationService->Event(request, commandStr2, {});
      }
    } else { // Argument missng
       m_headsetIntegrationService->Error(request, commandStr2, {
         { JSON_KEY_COMMAND, request.message },
         { JSON_KEY_JABRA_RETURN_ERRORCODE, Return_ParameterFail },
         { JSON_KEY_ERROR_MESSAGE, "Could not resolve active device argument" }
       });
    }
  } else { // Old command with compatability mode - no event when finished:
    if (id != USHRT_MAX) {
      if (!m_headsetIntegrationService->SetCurrentDeviceId(id)) {
          m_headsetIntegrationService->Error(request, "no device with id = " + std::to_string(id) + " attached", {});
      }
    } else {
      m_headsetIntegrationService->Error(request, "Could not resolve active device argument", {});
    }
  }
}
