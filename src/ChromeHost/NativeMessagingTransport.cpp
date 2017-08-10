#include "stdafx.h"
#include "NativeMessagingTransport.h"
#include <iostream>
#include "json.hpp" // https://github.com/nlohmann/json

NativeMessagingTransport::NativeMessagingTransport()
{
}

NativeMessagingTransport::~NativeMessagingTransport()
{
}

void NativeMessagingTransport::AddHandler(std::function<void(std::string)> callback)
{
  m_callback = callback;
}

void NativeMessagingTransport::SendText(std::string msg)
{
  nlohmann::json j;
  j["message"] = msg;
  std::string text = j.dump();

  unsigned int len = text.length();
  std::cout << char(len >> 0)
    << char(len >> 8)
    << char(len >> 16)
    << char(len >> 24);

  std::cout << text << std::flush;
}

void NativeMessagingTransport::Start()
{
  while (1)
  {
    unsigned int length = 0;

    // Neat way!
    for (int i = 0; i < 4; i++)
    {
      unsigned int read_char = getchar();
      length = length | (read_char << i * 8);
    }

    // Should the host be closed?
    if (length == 0xffffffff)
    {
      break;
    }

    // read the json-message
    std::string msg = "";
    for (size_t i = 0; i < length; i++)
    {
      msg += getchar();
    }

    nlohmann::json j = nlohmann::json::parse(msg.c_str());

    std::string m = j["message"];
    m_callback(m);
  }
}