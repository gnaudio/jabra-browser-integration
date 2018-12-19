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
#include "CmdSetMmiFocus.h"

CmdSetMmiFocus::CmdSetMmiFocus(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdSetMmiFocus::~CmdSetMmiFocus()
{
}

bool CmdSetMmiFocus::CanExecute(const Request& request)
{
  return (request.message == "setmmifocus");
}

void CmdSetMmiFocus::Execute(const Request& request)
{
  RemoteMmiType type = defaultValue(request.args, SET_MMIFOCUS_COMMAND_ARG_TYPE, MMI_TYPE_MFB);
  bool capture = defaultValue(request.args, SET_MMIFOCUS_COMMAND_ARG_CAPTURE, true);

  const unsigned short deviceId = m_headsetIntegrationService->GetCurrentDeviceId();
  if (deviceId == USHRT_MAX)
  {
	  m_headsetIntegrationService->Error(request, "No device", {});
    return;
  }

  Jabra_ReturnCode retv;
  bool captured = false;
  if (capture) { // Take focus with no filtering and high priority:
    retv = Jabra_GetRemoteMmiFocus(deviceId, type, (RemoteMmiInput)255, MMI_PRIORITY_HIGH);
    if (retv == Return_Ok) {
      captured = true;
    } else {
      Jabra_IsRemoteMmiInFocus(deviceId, type, &captured);
    }
  } else { // Release focus:
    retv = Jabra_ReleaseRemoteMmiFocus(deviceId, type);
    if (retv == Return_Ok) {
      captured = false;
    } else {
      Jabra_IsRemoteMmiInFocus(deviceId, type, &captured);
    }
  }

  if (retv == Return_Ok) {
    m_headsetIntegrationService->Event(request, "setmmifocus", {});
  } else {
    m_headsetIntegrationService->Error(request, "setmmifocus", {
      { JSON_KEY_COMMAND, request.message },
      { JSON_KEY_ERROR_MESSAGE, "setmmifocus failed" },
      { JSON_KEY_CAPTURED, captured },
      { JSON_KEY_JABRA_RETURN_ERRORCODE, retv },
	    { std::make_pair(JSON_KEY_DEVICEID, std::to_string(deviceId)) },
	    { std::make_pair(JSON_KEY_ACTIVEDEVICE, true) }
    });
  }
}
