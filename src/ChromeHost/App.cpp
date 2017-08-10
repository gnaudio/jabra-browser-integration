#include "stdafx.h"
#include "App.h"

NativeMessagingTransport App::transport;
HeadsetIntegrationService App::headsetService;

App::App()
{
  transport.AddHandler(OnTransportIcoming);
  headsetService.AddHandler(OnHeadsetIncoming);
  headsetService.Start();
}

App::~App()
{
}

void App::Start()
{
  // Blocking until the connection is closed
  transport.Start();
}

void App::OnTransportIcoming(std::string txt)
{
  // Route cmds to the headset service for processing
  headsetService.SendCmd(txt);
}

void App::OnHeadsetIncoming(std::string txt)
{
  transport.SendText(txt);
//  transport.SendText("From headset service: <" + txt + ">");
}