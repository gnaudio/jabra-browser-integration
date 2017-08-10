#pragma once

#include <functional>
#include <string>

class NativeMessagingTransport
{
public:
  NativeMessagingTransport();
  ~NativeMessagingTransport();

  void AddHandler(std::function<void(std::string)> callback);

  void SendText(std::string msg);

  void Start();

protected:
  std::function<void(std::string)> m_callback;

};

