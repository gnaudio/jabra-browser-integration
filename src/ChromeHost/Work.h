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
#include <iostream>
#include <atomic>
#include "Util.h"
#include "Request.h"

class RequestWork;
class ButtonInDataTranslatedWork;
class DeviceAttachedWork;
class DeviceDeAttachedWork;
class DeviceDevLogWork;
class BusylightWork;
class HearThroughSettingWork;
class BatteryStatusWork;
class GNPButtonWork;
class RemoteMmiWork;

/**
 * A visitor interface that a class that process work should implement.
 * 
 * See GOF visitor pattern.
 */
class WorkProcessor
{
  public:
  virtual void processRequest(const RequestWork& work) = 0;
  virtual void processButtonInDataTranslated(const ButtonInDataTranslatedWork& work) = 0;
  virtual void processDeviceAttached(const DeviceAttachedWork& work) = 0;
  virtual void processDeviceDeAttached(const DeviceDeAttachedWork& work) = 0;
  virtual void processDevLog(const DeviceDevLogWork& work) = 0;
  virtual void processBusylight(const BusylightWork& work) = 0;
  virtual void processHearThroughSetting(const HearThroughSettingWork& work) = 0;
  virtual void processBatteryStatus(const BatteryStatusWork& work) = 0;
  virtual void processGnpButtons(const GNPButtonWork& work) = 0;
  virtual void processRemoteMmiWork(const RemoteMmiWork& work) = 0;
};

/**
 * Represents some action to do - either due to a user request or due to the device calling us.
 */
class Work {
  private:
  static std::atomic<unsigned long> workCount;
  const unsigned long workId;
  long long time;

  public:
  unsigned long getWorkId() const { return workId; }
  unsigned long long getTime() const { return time; }

  virtual void accept(WorkProcessor& visitor) const = 0;
  virtual void print(std::ostream& where) const = 0;

  Work();

  friend std::ostream& operator<<(std::ostream& out, const Work& work);
};

/**
 * A thread safe work queue
 */
typedef ThreadSafeQueue<Work> WorkQueue;

/**
 * Browser client request initiated work
 */
class RequestWork : public Work {
  public:
  const Request request;

  explicit RequestWork(const Request& request) : request(request) {}

  void accept(WorkProcessor& visitor) const override {
      visitor.processRequest(* this);
  }

  virtual void print(std::ostream& os) const override {
      os << "RequestWork[" << getWorkId() << " @ " << getTime() << "] " << request;
  }
};

/**
 * Abstract base class for all device initiated work
 */
class DeviceWork : public Work {
  public:
  const unsigned short deviceID;

  protected:
  DeviceWork(const unsigned short deviceID) : deviceID(deviceID) {}
};

class ButtonInDataTranslatedWork : public DeviceWork {
    public:
    const ButtonHidInfo data;

    explicit ButtonInDataTranslatedWork(const unsigned short deviceID, const Jabra_HidInput translatedInData, const bool buttonInData)
                                       : DeviceWork(deviceID), data(translatedInData, buttonInData) {}

    void accept(WorkProcessor& visitor) const override {
        visitor.processButtonInDataTranslated(* this);
    }

    void print(std::ostream& os) const override {
      os << "ButtonInDataTranslatedWork[" << getWorkId() << " @ " << getTime() << "] " << deviceID << " ," << data.translatedInData << " , " << data.buttonInData;
    }
};

class DeviceAttachedWork : public DeviceWork {
    public:
	const BasicDeviceInfo basicDeviceInfo;

    explicit DeviceAttachedWork(const BasicDeviceInfo& basicDeviceInfo) : DeviceWork(basicDeviceInfo.deviceID), basicDeviceInfo(basicDeviceInfo) {}

    void accept(WorkProcessor& visitor) const override {
        visitor.processDeviceAttached(* this);
    }

    void print(std::ostream& os) const override {
      os << "DeviceAttachedWork[" << getWorkId() << " @ " << getTime() << "] " << basicDeviceInfo.deviceID;
    }
};

class DeviceDeAttachedWork : public DeviceWork {
    public:
    explicit DeviceDeAttachedWork(const unsigned short deviceID) : DeviceWork(deviceID) {}

    void accept(WorkProcessor& visitor) const override {
        visitor.processDeviceDeAttached(* this);
    }

    void print(std::ostream& os) const override {
      os << "DeviceDeAttachedWork[" << getWorkId() << " @ " << getTime() << "] " << deviceID;
    }
};

class DeviceDevLogWork : public DeviceWork {
    public:
    const std::string eventStr;

    explicit DeviceDevLogWork(const unsigned short deviceID, const std::string& eventStr) : DeviceWork(deviceID), eventStr(eventStr) {}

    void accept(WorkProcessor& visitor) const override {
        visitor.processDevLog(* this);
    }

    void print(std::ostream& os) const override {
      os << "DeviceDevLogWork[" << getWorkId() << " @ " << getTime() << "] " << eventStr;
    }
};

class BusylightWork : public DeviceWork {
    public:
    const bool busy;

    explicit BusylightWork(const unsigned short deviceID, const bool busy) : DeviceWork(deviceID), busy(busy) {}

    void accept(WorkProcessor& visitor) const override {
        visitor.processBusylight(* this);
    }

    void print(std::ostream& os) const override {
      os << "BusylightWork[" << getWorkId() << " @ " << getTime() << "] " << busy;
    }
};

class HearThroughSettingWork : public DeviceWork {
    public:
    const bool status;

    explicit HearThroughSettingWork(const unsigned short deviceID, const bool status) : DeviceWork(deviceID), status(status) {}

    void accept(WorkProcessor& visitor) const override {
        visitor.processHearThroughSetting(* this);
    }

    void print(std::ostream& os) const override {
      os << "HearThroughSettingWork[" << getWorkId() << " @ " << getTime() << "] " << status;
    }
};

class BatteryStatusWork : public DeviceWork {
    public:
    const BatteryCombinedStatusInfo status;

    explicit BatteryStatusWork(const unsigned short deviceID, const int levelInPercent, const bool charging, const bool batteryLow) : DeviceWork(deviceID), status { true, levelInPercent, charging, batteryLow } {}

    void accept(WorkProcessor& visitor) const override {
        visitor.processBatteryStatus(* this);
    }

    void print(std::ostream& os) const override {
      os << "BatteryStatusWork[" << getWorkId() << " @ " << getTime() << "] level=" << status.levelInPercent << ", charging= " << status.charging << ", low= " << status.batteryLow;
    }
};

class GNPButtonWork : public DeviceWork {
    public:
    const std::vector<GnpButtonEntry> buttonEntries;

    explicit GNPButtonWork(const unsigned short deviceID, const std::vector<GnpButtonEntry>& buttonEntries) : DeviceWork(deviceID), buttonEntries(buttonEntries) {}

    void accept(WorkProcessor& visitor) const override {
        visitor.processGnpButtons(* this);
    }

    void print(std::ostream& os) const override {
      os << "GNPButtonWork[" << getWorkId() << " @ " << getTime() << "] buttonEntries=" << buttonEntries;
    }
};


class RemoteMmiWork : public DeviceWork {
    public:
    const RemoteMmiType type;
    const RemoteMmiInput action;

    explicit RemoteMmiWork(const unsigned short deviceID, const RemoteMmiType type, const RemoteMmiInput action) 
                          : DeviceWork(deviceID), type(type), action(action) {}

    void accept(WorkProcessor& visitor) const override {
        visitor.processRemoteMmiWork(* this);
    }

    void print(std::ostream& os) const override {
      os << "GNPButtonWork[" << getWorkId() << " @ " << getTime() << "], type= " << type << " , action= " << action;
    }
};


