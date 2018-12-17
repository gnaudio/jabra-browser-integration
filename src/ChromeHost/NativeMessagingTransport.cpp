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

NativeMessagingTransport::NativeMessagingTransport()
{
}

NativeMessagingTransport::~NativeMessagingTransport()
{
}

void NativeMessagingTransport::AddHandler(std::function<void(const Request&)> callback)
{
  m_callback = callback;
}

void NativeMessagingTransport::SendResponse(const Response& response)
{
  nlohmann::json j;

  IF_LOG(plog::debug) {
    LOG(plog::debug) << "Preparing response : " << response;
  }

  j["data"] = response.data;

  if (!response.error.empty()) {
	  j["error"] = response.error;
  }

  if (!response.message.empty()) {
	  j["message"] = response.message;
  }

  // For compatibility with old <= 0.5 versions of the extension message
  // may not be empty so return a dummy value here if there is none.
  if (!j["message"].is_string()) {
	  j["message"] = "na";
  }

  j["requestId"] = response.requestId;
  j["apiClientId"] = response.apiClientId;
  std::string text = j.dump(-1, ' ', false, nlohmann::json::error_handler_t::replace);

  unsigned int len = text.length();
  std::cout << char(len >> 0)
    << char(len >> 8)
    << char(len >> 16)
    << char(len >> 24);

  std::cout << text << std::flush;

  IF_LOG(plog::debug) {
    LOG(plog::debug) << "Response send to extension: '" << text << "' (length = " << len << ")";
  }
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
      LOG(plog::debug) << "Received close message from extension.";
      break;
    }

    // read the json-message
    std::string msg;
    for (size_t i = 0; i < length; i++)
    {
      msg += getchar();
    }

    IF_LOG(plog::debug) {
      LOG(plog::debug) << "Parsing received message : " << msg;
    }

    nlohmann::json j;
    try {
      j = nlohmann::json::parse(msg.c_str());
    } catch (const std::exception& e) {
      log_exception(plog::Severity::error, e, "Error parsing message: " + msg);
      continue;
    } catch (...) {
	    LOG_ERROR << "Error parsing msg: " <<  msg;
      continue;
    } 

    IF_LOG(plog::debug) {
      LOG(plog::debug) << "Received message from extension: " << j.dump(4);
    }

    try {
      nlohmann::json message = j.at("message"); // Required - Throws if missing.
      nlohmann::json requestId = j["requestId"]; 
      nlohmann::json apiClientId = j["apiClientId"];
      nlohmann::json args = j["args"];

      Request req(message.get<std::string>(),
                  (args==nullptr || args.is_null()) ? nlohmann::json::object() : args,
                  requestId.is_string() ? requestId.get<std::string>() : "",
                  apiClientId.is_string() ? apiClientId.get<std::string>() : "");

      m_callback(req);
    } catch (const std::exception& e) {
      log_exception(plog::Severity::error, e, "Error receiving msg: " + msg);
    } catch (...) {
	    LOG_ERROR << "Error receiving msg: " <<  msg;
    }
  }
}