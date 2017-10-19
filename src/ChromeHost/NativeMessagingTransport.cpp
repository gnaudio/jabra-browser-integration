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
    std::string msg;
    for (size_t i = 0; i < length; i++)
    {
      msg += getchar();
    }

    nlohmann::json j = nlohmann::json::parse(msg.c_str());

    std::string m = j["message"];
    m_callback(m);
  }
}