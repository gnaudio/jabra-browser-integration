#pragma once

#include "NativeMessagingTransport.h"
#include "HeadsetIntegrationService.h"

class App
{
public:
  App();
  ~App();

  void Start();

protected:
  static NativeMessagingTransport transport;
  static HeadsetIntegrationService headsetService;
  static void OnTransportIcoming(std::string txt);
  static void OnHeadsetIncoming(std::string txt);

};

