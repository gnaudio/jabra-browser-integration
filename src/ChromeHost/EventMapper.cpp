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
#include "EventMapper.h"
#include "HeadsetIntegrationService.h"

const std::string SimpleEventMapper::mapperName = "SimpleEventMapper";
const std::string EventOffHookMapper::mapperName = "EventOffHookMapper";
const std::string EventOnHookMapper::mapperName = "EventOnHookMapper";

bool EventOffHookMapper::accept(const unsigned short deviceId, const ButtonHidInfo&) const {
  // Previous version looked at: (service->GetRingerStatus(deviceId));
  // This has been changed to allow initial an outgoing call from device after discussing with Felix.

  return !(service->GetHookStatus(deviceId));
}

bool EventOnHookMapper::accept(const unsigned short deviceId, const ButtonHidInfo&) const {
  return (service->GetHookStatus(deviceId));
}