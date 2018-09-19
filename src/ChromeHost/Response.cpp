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

#include "Response.h"

Response::Response(const Context& context, const std::string& message, const std::string& error, const nlohmann::json& data)
         : Context(context.requestId, context.apiClientId), message(message), error(error), data(data) {
}

std::ostream& operator<<(std::ostream& os, const Response& r)
{  
	os << "Response { ";
	if (r.message.length()>0) {
		os << "message: " << r.message;
	}
	if (r.error.length()>0) {
		os << ", error: " << r.error;
	}
	os << ", requestId: " << r.requestId;
	os << ", apiClientId: " << r.apiClientId;
	os << ", data: " << r.data;

	os << "}";
    return os;  
} 