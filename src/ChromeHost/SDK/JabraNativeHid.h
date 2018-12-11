#ifndef JABRANATIVEHID_H
#define JABRANATIVEHID_H

/* --------------------------------------------------------------------
 *
 *  GGGGGG  NN    N
 *  G       N N   N
 *  G  GGG  N  N  N - Audio
 *  G    G  N   N N
 *  GGGGGG  N    NN
 *
 *  Copyright (c) 2017, GN-Audio
 * -------------------------------------------------------------------- */

/**
 * @file JabraNativeHid.h
 * @brief Defines the JabraNativeHid interface.
 * Developer information can be found in the JabraNativeHid SDK documentation.
 */

/****************************************************************************/
/*                              INCLUDE FILES                               */
/****************************************************************************/

#include <stdbool.h>
#include "Common.h"

/****************************************************************************/
/*                     EXPORTED TYPES and DEFINITIONS                       */
/****************************************************************************/



/****************************************************************************/
/*                           EXPORTED FUNCTIONS                             */
/****************************************************************************/


/** Write a single HID command to the telephony usage page
 *  @param[in] : deviceID: Id for a specific device
 *  @param[in] : HID_UsagePage: Usage Page
 *  @param[in] : HID_Usage: Usage
 *  @param[in] : value: true or false
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Not_Supported if HID is not supported.
 */
LIBRARY_API Jabra_ReturnCode Jabra_WriteHIDCommand(
  unsigned short deviceID,
  unsigned short HID_UsagePage,
  unsigned short HID_Usage,
  bool value
);

/** Set OffHook
 *  @param[in] : deviceID: Id for a specific device
 *  @param[in] : hook: Boolean value to set Off hook/On Hook
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Not_Supported if HID is not supported.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetOffHook(
  unsigned short deviceID,
  bool offHook
);

/** Set Ringer (ringtone in headset) and ringing (ringing LED if available)
 *  @param[in] : deviceID: Id for a specific device
 *  @param[in] : ringer: Boolean value to set Ringer On/Off and ringing LED On/Off - Not all device have a LED for ringing
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Not_Supported if HID is not supported.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetRinger(
  unsigned short deviceID,
  bool ringer
);

/** Checks for OffHook command support by the device.
 *  @param[in] : deviceID: Id for a specific device
 *  @return    : Returns true if off hook is supported for a specific Jabra device.
 */
LIBRARY_API bool Jabra_IsOffHookSupported(
  unsigned short deviceID
);

/** Check for Ringer command support by the device.
 *  @param[in] : deviceID: Id for a specific device
 *  @return    : Returns true if ringer is supported for a specific Jabra device.
 */
LIBRARY_API bool Jabra_IsRingerSupported(
  unsigned short deviceID
);

/** Set Mute
 *  @param[in] : deviceID: Id for a specific device
 *  @param[in] : mute: Boolean value to set Mute On/Off
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Not_Supported if HID is not supported.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetMute(
  unsigned short deviceID,
  bool mute
);

/** Checks for Mute command support by the device.
 *  @param[in] : deviceID: Id for a specific device
 *  @return    : Returns true if mute is supported for the Jabra device.
 */
LIBRARY_API bool Jabra_IsMuteSupported(
  unsigned short deviceID
);

/** Set Hold
 *  @param[in] : deviceID: Id for a specific device
 *  @param[in] : hold: Boolean value to set device On Hold/Resume
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Not_Supported if HID is not supported.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetHold(
  unsigned short deviceID,
  bool hold
);

/** Checks for the Hold support by the device.
 *  @param[in] : deviceID: Id for a specific device
 *  @return    : Returns true if hold is supported for the Jabra device.
 */
LIBRARY_API bool Jabra_IsHoldSupported(
  unsigned short deviceID
);

/** Set Online, it opens radio link between base/dongle and device
 *  @param[in] : deviceID: Id for a specific device
 *  @param[in] : online: Boolean value to set Online On/Off
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Not_Supported if HID is not supported.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetOnline(
  unsigned short deviceID,
  bool audiolink
);

/** Checks for the online mode support by the device.
 *  @param[in] : deviceID: Id for a specific device
 *  @return    : Returns true if online mode is supported for a specific Jabra device.
 */
LIBRARY_API bool Jabra_IsOnlineSupported(
 unsigned short deviceID
);

/**
 * Enum for setting the HID working state.
 */
typedef enum _Jabra_HidState {
  /** Setting Standard HID or GN HID is not supported */
  NOT_SUPPORTED = 0,
  /** Use standard HID as specified in the HID specification from usb.org. */
  STD_HID = 1,
  /** Use GN HID as specified by GN. */
  GN_HID = 2
} Jabra_HidState;

/**
* Is the device supporting Gn HID and Std HID and able to switch between them 
* @param[in] deviceID ID for a specific device.
* @return True Supports Gn HID and Std HID
*/
LIBRARY_API bool Jabra_IsGnHidStdHidSupported(unsigned short deviceID);

/**
 * Gets the HID working state.
 * @param[in] deviceID ID for a specific device.
 * @param[out] state HID working state.
 * @return Return_Ok working state has been set successfully.
 *         Not_Supported the device does not support remote MMI.
 *         Device_Unknown the deviceID specified is not known.
 *         Device_ReadFail if it fails to get the state from the device.
 *         Return_ParameterFail in case of an incorrect parameter.
 */
LIBRARY_API Jabra_ReturnCode Jabra_GetHidWorkingState(unsigned short deviceID, Jabra_HidState* state);

/**
 * Sets the HID working state to either standard HID (usb.org HID specification) or GN HID.
 * @param[in] deviceID ID for a specific device.
 * @param[in] state HID working state.
 * @return Return_Ok working state has been set successfully.
 *         Not_Supported the device does not support remote MMI.
 *         Device_Unknown the deviceID specified is not known.
 *         Device_WriteFail if it fails to write to the device.
 *         Return_ParameterFail in case of an incorrect parameter.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetHidWorkingState(unsigned short deviceID, Jabra_HidState state);

#endif /* JABRANATIVEHID_H */
