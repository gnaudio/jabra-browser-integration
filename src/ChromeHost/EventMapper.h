
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

#pragma once

#include <string>
#include "stdafx.h"

class HeadsetIntegrationService;

class EventMapper {
 public:
 virtual const std::string& getMapperName() const = 0;
 virtual const std::string& getEventName() const = 0;
 virtual bool accept(const unsigned short deviceId, const ButtonHidInfo&) const = 0;
};

class SimpleEventMapper : public EventMapper
{
  private:
  const std::string eventName;
  const static std::string mapperName;

  public:
  SimpleEventMapper(const std::string& eventName) : eventName(eventName) {}

  const std::string& getEventName() const override {
    return eventName;
  }

  const std::string& getMapperName() const override {
    return mapperName;
  }

  bool accept(const unsigned short deviceId, const ButtonHidInfo&) const override {
      return true;
  }
};

class EventOffHookMapper : public SimpleEventMapper
{
  private:
  const static std::string mapperName;
  HeadsetIntegrationService * const service; 

  public:
  EventOffHookMapper(const std::string& eventName, HeadsetIntegrationService * const service) : SimpleEventMapper(eventName), service(service) {}

  const std::string& getMapperName() const override {
    return mapperName;
  }

  bool accept(const unsigned short deviceId, const ButtonHidInfo&) const override;
};

class EventOnHookMapper : public SimpleEventMapper
{
  private:
  const static std::string mapperName;
  HeadsetIntegrationService * const service; 

  public:
  EventOnHookMapper(const std::string& eventName, HeadsetIntegrationService * const service) : SimpleEventMapper(eventName), service(service) {}

  const std::string& getMapperName() const override {
    return mapperName;
  }

  bool accept(const unsigned short deviceId, const ButtonHidInfo&) const override;
};
