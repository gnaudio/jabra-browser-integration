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
#include "App.h"
#include <exception>
#include <iostream>
#include <cstdlib>
#include "Logger.h"
#include "Meta.h"

using namespace std;

int main()
{
  try {
	  configureLogging();
  }
  catch (const std::exception& e) {
	  cerr << "Fatal error setting up logging" << e.what() << std::flush;
	  return 2;
  }
  catch (...) {
	  cerr << "Fatal unknown error setting up logging" << std::flush;
	  return 2;
  }

  LOG_INFO << "Starting chromehost integrator v" << VERSION << " running native SDK v" << getNativeSDKVersion();

  try {
	  App app;
	  app.Start(); // Blocks until done
	  LOG_INFO << "Application start ended normally";
  } catch (const std::exception& e) {
      log_exception(plog::Severity::fatal, e, "in main");
	  return 1;
  } catch (...) {
	  LOG_FATAL << "Fatal unknown error: ";
	  return 1;
  }

  LOG_INFO << "Normal termination of main";

  return 0;
}
