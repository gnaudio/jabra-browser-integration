#ifndef __JABRANATIVEHID_H__
#define __JABRANATIVEHID_H__

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
				 Device_NotLock if device is not locked.
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
 *  @param[in] : hook: Off hook/on Hook
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Device_NotLock if device is not locked.
				 Not_Supported if HID is not supported.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetOffHook(
  unsigned short deviceID,
  bool offHook
);

/** Set Ringer
 *  @param[in] : deviceID: Id for a specific device
 *  @param[in] : ringer: Ringer on/ringer off
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Device_NotLock if device is not locked.
				 Not_Supported if HID is not supported.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetRinger(
  unsigned short deviceID,
  bool ringer
);

/** Hook Support
 *  @param[in] : deviceID: Id for a specific device
 *  @return    : Returns true if off hook is supported for a specific Jabra device.
 */
LIBRARY_API bool Jabra_IsOffHookSupported(
  unsigned short deviceID
);

/** Ringer Support
 *  @param[in] : deviceID: Id for a specific device
 *  @return    : Returns true if ringer is supported for a specific Jabra device.
 */
LIBRARY_API bool Jabra_IsRingerSupported(
  unsigned short deviceID
);

/** Set Mute
 *  @param[in] : deviceID: Id for a specific device
 *  @param[in] : mute: Mute on/mute off
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Device_NotLock if device is not locked.
				 Not_Supported if HID is not supported.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetMute(
  unsigned short deviceID, 
  bool mute
);

/** mute Support
 *  @param[in] : deviceID: Id for a specific device
 *  @return    : Returns true if mute is supported for the Jabra device.
 */
LIBRARY_API bool Jabra_IsMuteSupported(
  unsigned short deviceID
);

/** Set Hold
 *  @param[in] : deviceID: Id for a specific device
 *  @param[in] : hold: Hold on/resume
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Device_NotLock if device is not locked.
				 Not_Supported if HID is not supported.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetHold(
  unsigned short deviceID, 
  bool hold
);

/** Hold Support
 *  @param[in] : deviceID: Id for a specific device
 *  @return    : Returns true if hold is supported for the Jabra device.
 */
LIBRARY_API bool Jabra_IsHoldSupported(
  unsigned short deviceID
);

/** Set Online, it opens radio link between base/dongle and device
 *  @param[in] : deviceID: Id for a specific device
 *  @param[in] : online: Online on/online off
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Device_NotLock if device is not locked.
				 Not_Supported if HID is not supported.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetOnline(
  unsigned short deviceID, 
  bool audiolink
);

/** online mode Support
 *  @param[in] : deviceID: Id for a specific device
 *  @return    : Returns true if online mode is supported for a specific Jabra device.
 */
LIBRARY_API bool Jabra_IsOnlineSupported(
 unsigned short deviceID
);

#endif /* __JABRANATIVEHID_H__ */
