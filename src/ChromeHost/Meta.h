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
#include "stdafx.h"

// Version of this chromehost library
const std::string VERSION = "2.0.0";

// Helper to get version of underlaying native platform sdk.
inline const std::string getNativeSDKVersion() {
    char verChars[64];

    if (Jabra_GetVersion(verChars, sizeof(verChars)) != Jabra_ReturnCode::Return_Ok) {
        verChars[0] = 0;
    }

    return std::string(verChars);
}