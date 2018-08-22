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
#include <map>
#include <iostream>
#include "Context.h"

/**
 * Contains a response to the chrome extension.
 */
class Response : public Context {
  private:
  std::map<const std::string, const std::string> data;

  public:
  const std::string message;
  const std::string error;

  explicit Response(const Context& context, const std::string& message, const std::string& error, const std::initializer_list<std::pair<const std::string, const std::string>> dataList)
         : Context(context.requestId, context.apiClientId), message(message), error(error), data(dataList) {}

  const std::map<const std::string, const std::string>& getData() const {
    return data;
  }

  Response(const Response&) = delete;
  Response& operator=(const Response&) = delete;

  friend std::ostream& operator<<(std::ostream& os, const Response& r);  
};

inline std::ostream& operator<<(std::ostream& os, const Response& r)
{  
	os << "Response { ";
	os << "message: " << r.message;
	os << ", error: " << r.message;
	os << ", requestId: " << r.requestId;
	os << ", apiClientId: " << r.apiClientId;
	for (auto entry : r.getData()) {
		os << ", " << entry.first << ": " << entry.second;
	}
	os << "}";
    return os;  
} 