
#pragma once

#include "SDK/JabraNativeHid.h"
#include "SDK/JabraDeviceConfig.h"
#include "stdafx.h"

void setDeviceInfo(nlohmann::json& dest, const Jabra_DeviceInfo& src);