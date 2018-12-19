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
#include "CmdSetRemoteMmiLightAction.h"

static const char * const command = "setremotemmilightaction";

CmdSetRemoteMmiLightAction::CmdSetRemoteMmiLightAction(HeadsetIntegrationService* headsetIntegrationService)
{
  m_headsetIntegrationService = headsetIntegrationService;
}

CmdSetRemoteMmiLightAction::~CmdSetRemoteMmiLightAction()
{
}

bool CmdSetRemoteMmiLightAction::CanExecute(const Request& request)
{
  return (request.message == command);
}

void CmdSetRemoteMmiLightAction::Execute(const Request& request)
{
  RemoteMmiType type = defaultValue(request.args, SET_REMOTE_MMI_LIGHT_COMMAND_ARG_TYPE, MMI_TYPE_MFB);
  RemoteMmiSequence effect = defaultValue(request.args, SET_REMOTE_MMI_LIGHT_COMMAND_ARG_EFFECT, MMI_LED_SEQUENCE_OFF);
  nlohmann::json colorArray = defaultValue(request.args, SET_REMOTE_MMI_LIGHT_COMMAND_ARG_COLOR, nlohmann::json::array());

  uint8_t red = 0;
  uint8_t green = 0;
  uint8_t blue = 0;
  
  if (colorArray.is_array() && colorArray.size()) {
    red = colorArray[0];
    green = colorArray[1];
    blue = colorArray[2];
  }

  RemoteMmiActionOutput output = {
    red,
    green,
    blue,
    effect
  };

  const unsigned short deviceId = m_headsetIntegrationService->GetCurrentDeviceId();
  if (deviceId == USHRT_MAX)
  {
	  m_headsetIntegrationService->Error(request, "No device", {});
    return;
  }

  Jabra_ReturnCode retv;
  if ((retv=Jabra_SetRemoteMmiAction(deviceId, type, output)) != Return_Ok) {
      m_headsetIntegrationService->Error(request, command, { 
        { JSON_KEY_JABRA_RETURN_ERRORCODE, retv},
        { JSON_KEY_ERROR_MESSAGE, "setremotemmilightaction failed" },
        { JSON_KEY_COMMAND, request.message },
		{ std::make_pair(JSON_KEY_DEVICEID, std::to_string(deviceId)) },
		{ std::make_pair(JSON_KEY_ACTIVEDEVICE, true) }
      });
  } else {
      m_headsetIntegrationService->Event(request, command, {});
  }
}
