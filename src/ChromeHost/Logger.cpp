#include "Logger.h"
#include <string>
#include <iostream>
#include <plog/Log.h>
#include "stdafx.h"

using namespace std;

/*
* Custom plog error append that logs errors to cerr as expected by chrome. To be used in addition to the main appender
* that is used for log everything to a file.
*/
class ErrorAppender : public plog::IAppender
{
	public:
	virtual void write(const plog::Record& record)
	{
		if (record.getSeverity() == plog::error || record.getSeverity() == plog::fatal) {
			plog::util::nstring str = plog::TxtFormatter::format(record);
			// The Win32 version is a wide string - in other cases it is a normal string (for current plog version).
			#ifdef _WIN32
			wcerr << str << std::flush;
			#else
			wcerr << str << std::flush;
			#endif
		}
	}
};

static bool endsWith(const std::string& str, const std::string& suffix)
{
	return str.size() >= suffix.size() && 0 == str.compare(str.size() - suffix.size(), suffix.size(), suffix);
}

#pragma warning(disable : 4996)

void configureLogging() {
  // Use same defaults and environment variable as Jabra SDK to setup
  // log destinaton.
  const char * const resPath = std::getenv("LIBJABRA_RESOURCE_PATH");
  string logPath(resPath ? resPath : "");
  
  if (logPath.empty()) {
	#ifdef _WIN32
		const char * const appDataPath = getenv("APPDATA");
		logPath = string(appDataPath ? appDataPath : "");
		logPath = logPath.append("\\JabraSDK");
	#elif  __APPLE__
		logPath = string("~/Library/Application Support/JabraSDK");
	#elif  __linux__
		// Unlike SDK we don't support syslog for linux so
		// just use a subfolder under home dir.
		const char * const homePath = getenv("HOME");
		logPath = string(homePath ? homePath : "");
		logPath = string("/JabraSDK");
	#endif
  }

  if (!endsWith(logPath, "/") && !endsWith(logPath, "\\")) {
	#ifdef _WIN32
		logPath = logPath.append("\\");
	#else
		logPath = logPath.append("//");
	#endif
  }

  logPath = logPath.append("JabraChromehost.log");


  // Use same environment variable and defaults as Jabra SDK to setup log level.
  const char * const _severityEnv = std::getenv("LIBJABRA_TRACE_LEVEL");
  std::string severityEnv(_severityEnv ? _severityEnv : "warning");

  plog::Severity severity = plog::warning;
  if (severityEnv == "fatal") {
    severity = plog::fatal;
  } else if (severityEnv == "error") {
    severity = plog::error;
  } else if (severityEnv == "warning") {
    severity = plog::warning;
  } else if (severityEnv == "info") {
    severity = plog::info;
  } else if (severityEnv == "debug") {
    severity = plog::debug;
  } else if (severityEnv == "trace") {
    severity = plog::verbose;
	} else {
    severity = plog::none;
  }

  // Setup plog:
	plog::init(severity, logPath.c_str(), 10000, 10).addAppender(new ErrorAppender());

  // Log configuration:
  IF_LOG(plog::info) {
    LOG(plog::info) << "Configured logging severity to: " << plog::severityToString(severity);
  }
}
