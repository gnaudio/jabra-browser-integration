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
#include <functional>
#include "App.h"

App::App() : transport(), headsetService()
{
  transport.AddHandler(std::bind(&App::OnTransportIcoming, this, std::placeholders::_1));
  headsetService.AddHandler(std::bind(&App::OnHeadsetIncoming, this, std::placeholders::_1));

  if (!headsetService.Start()) {
    // TODO: Should this be an error instead ?
    LOG_WARNING << "Headsets service initialization failed";
  }
}

App::~App()
{
}

void App::Start()
{
  // Blocking until the connection is closed
  transport.Start();

  // Stop headset service when we are finished.
  headsetService.Stop();
}

void App::OnTransportIcoming(const Request& request)
{
  // Route cmds to the headset service for processing
  headsetService.QueueRequest(request);
}

void App::OnHeadsetIncoming(const Response& response)
{
  transport.SendResponse(response);
}