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

/**
 * A visitor interface that a class that process work should implement.
 * 
 * See GOF visitor pattern.
 */
class WorkVisitor
{
  public:
  virtual void visit(const RequestWork& work) = 0;
  virtual void visit(const ButtonInDataTranslatedWork& work) = 0;
  virtual void visit(const DeviceAttachedWork& work) = 0;
  virtual void visit(const DeviceDeAttachedWork& work) = 0;
  virtual void visit(const DeviceDevLogWork& work) = 0;
};

/**
 * Represents some action to do - either due to a user request or due to the device calling us.
 */
class Work {
  private:
  static std::atomic<unsigned long> workCount;
  const unsigned long workId;

  public:
  unsigned long getWorkId() const { return workId; }

  virtual void accept(WorkVisitor& visitor) const = 0;
  virtual void print(std::ostream& where) const = 0;

  Work() : workId(++workCount) {}

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

  void accept(WorkVisitor& visitor) const override {
      visitor.visit(* this);
  }

  virtual void print(std::ostream& os) const override {
      os << "RequestWork[" << getWorkId() << "] " << request;
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
    const Jabra_HidInput translatedInData;
    const bool buttonInData;

    explicit ButtonInDataTranslatedWork(const unsigned short deviceID, const Jabra_HidInput translatedInData, const bool buttonInData) : DeviceWork(deviceID), translatedInData(translatedInData), buttonInData(buttonInData) {}

    void accept(WorkVisitor& visitor) const override {
        visitor.visit(* this);
    }

    void print(std::ostream& os) const override {
      os << "ButtonInDataTranslatedWork[" << getWorkId() << "] " << deviceID << " ," << translatedInData << " , " << buttonInData;
    }
};

class DeviceAttachedWork : public DeviceWork {
    public:
	const BasicDeviceInfo basicDeviceInfo;

    explicit DeviceAttachedWork(const BasicDeviceInfo& basicDeviceInfo) : DeviceWork(basicDeviceInfo.deviceID), basicDeviceInfo(basicDeviceInfo) {}

    void accept(WorkVisitor& visitor) const override {
        visitor.visit(* this);
    }

    void print(std::ostream& os) const override {
      os << "DeviceAttachedWork[" << getWorkId() << "] " << basicDeviceInfo.deviceID;
    }
};

class DeviceDeAttachedWork : public DeviceWork {
    public:
    explicit DeviceDeAttachedWork(const unsigned short deviceID) : DeviceWork(deviceID) {}

    void accept(WorkVisitor& visitor) const override {
        visitor.visit(* this);
    }

    void print(std::ostream& os) const override {
      os << "DeviceDeAttachedWork[" << getWorkId() << "] " << deviceID;
    }
};

class DeviceDevLogWork : public DeviceWork {
    public:
    const std::string eventStr;

    explicit DeviceDevLogWork(const unsigned short deviceID, const std::string& eventStr) : DeviceWork(deviceID), eventStr(eventStr) {}

    void accept(WorkVisitor& visitor) const override {
        visitor.visit(* this);
    }

    void print(std::ostream& os) const override {
      os << "DeviceDevLogWork[" << getWorkId() << "] " << eventStr;
    }
};
