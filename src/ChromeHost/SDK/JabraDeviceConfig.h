#ifndef __JABRADEVICECONFIG_H__
#define __JABRADEVICECONFIG_H__

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
 * @file JabraDeviceConfig.h
 * @brief Defines the dynamic setting interface.
 * Developer information can be found in the universal SDK documentation.
 */

/****************************************************************************/
/*                              INCLUDE FILES                               */
/****************************************************************************/

#include <stdbool.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include "Common.h"

/****************************************************************************/
/*                     EXPORTED TYPES and DEFINITIONS                       */
/****************************************************************************/

/* This enum represents each setting data type */
typedef enum  _DataType{
  settingByte = 0,
  settingString
} DataType;

/* This enum represents each setting control type */
typedef enum  _ControlType{
  cntrlRadio = 0,
  cntrlToggle,
  cntrlComboBox,
  cntrlDrpDown,
  cntrlLabel,
  cntrlTextBox,
  cntrlButton,
  cntrlUnknown
} ControlType;

/* This structure represents Validation Rule */
typedef struct _ValidationRule{
  int  minLength;
  int  maxLength;
  char *regExp;
  char *errorMessage;
} ValidationRule;

typedef struct _DependencySetting{
  char *GUID;
  bool enableFlag;
}DependencySetting;

/* This structure contains setting values in key value pair */
typedef struct _ListKeyValue{
  unsigned short key;
  void *value;
  
  int dependentcount;
  DependencySetting* dependents;
}ListKeyValue;

/* This structure represents each setting info */
typedef struct _SettingInfo{
  /* Setting GUID*/
  char *guid;
  
  /* Setting Name*/
  char *name;
  
  /* setting Help Text */
  char *helpText;
  
  /* Current Device value for this setting */
  void *currValue;
  
  /* Number of values for this setting */
  int  listSize;
  
  /* Structure for all key-value pairs for this setting */
  ListKeyValue *listKeyValue;
  
  /* If validation rule is supported or not */
  bool isValidationSupport;
  
  /* This structure contains the validation rule */
  ValidationRule* validationRule;
    
  /*If device restart is required for this setting */
  bool isDeviceRestart;

  /*When wireless headset is connected to its base/dongle */
  bool isWirelessConnect;
  
  /* This represents what type of control for setting */
  ControlType cntrlType;
  
  /* This represents datatype of setting value */
  DataType settingDataType;
  
  /* This represents group name of the setting */
  char *groupName;
  
  /* This represents group help text of the setting */
  char *groupHelpText;
  
  /*whether dependency setting is present or not*/
  bool isDepedentsetting;
  
  /* default dependent value when setting is disabled */
  void *dependentDefaultValue;
  
  /*PCsetting or not*/
  bool isPCsetting;

  /* child device setting or not */
  bool isChildDeviceSetting;
  
} SettingInfo;

/* This structure represents all settings available for the device*/
typedef struct _DeviceSettings{
  /* number of settings for the device */
  unsigned int settingCount;
  /* Setting information of all settings of the device */ 
  SettingInfo *settingInfo;
  /* manifest file download status */
  Jabra_ErrorStatus errStaus;
} DeviceSettings;

/* This structure represents the product registration info*/
typedef struct _PrdctRegDetails{
  char *userName;
  char *userPassword;
  char *firstName;
  char *lastName;
  char *email;
  bool mktPermission;
} PrdctRegDetails;

/* This structure represents the failed settings info */
typedef struct _FailedSettings{
  unsigned int count;
  char ** settingNames;
}FailedSettings;

/****************************************************************************/
/*                          EXPORTED DYNAMIC CONFIG - APIs                           */
/****************************************************************************/
/** Note: The proposed design is to have the memory allocated at the SDK level as
 *  the user may not aware of how much memory needs to be allocated. Settings vary up on connected devices.
 *  So it is good SDK to decide how much memory to allocate for settings.
 
 *  E.g.  openSSL library
 */

/** Gets the complete settings details (all groups and its settings) for a device.
 *  @param[in] : deviceID: Id for specific device.
 *  @return    : pointer to the structure containing all settings for the deviceID.
 *  Note       : As Memory is allocated through SDK, need to be freed by calling Jabra_FreeDeviceSettings API.
 */
LIBRARY_API DeviceSettings* Jabra_GetSettings(unsigned short deviceID);

/** Sets all the settings( including all groups and its settings) for a device.
 *  @param[in] : deviceID : id for a specific device.
 *  @param[in] : setting : Dynamic settings for the device.
 *  @return    : Return_Ok if setting is successful.
				 Device_Unknown if deviceID is wrong.
				 Device_NotLock if device is not locked.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetSettings(unsigned short deviceID, DeviceSettings* setting);

/** Restore factory settings to device.
 *  @param[in] : deviceID: id for a specific device.
 *  @param[in] : bluetooth: flag to identify, whether called from BT pairing or not.
 *  @return    : Return_Ok if successful.
				 Device_Unknown if deviceID is wrong.
				 Device_NotLock if device is not locked.
				 No_FactorySupported if device does not support factory reset.
				 Device_WriteFail if it fails to write to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_FactoryReset(unsigned short deviceID, bool bluetooth);

/** Free DeviceSettings structure
 *  @param[in] : setting: DeviceSettings structure pointer, which needs to be freed.
 *  @return    : void.
 */
LIBRARY_API void Jabra_FreeDeviceSettings(DeviceSettings* setting);

/** Free char pointer
 *  @param[in] : strPtr: char pointer, which needs to be freed.
 *  @return    : void.
 */
LIBRARY_API void Jabra_FreeString(char* strPtr);

/** Returns error description for the error code
 *  @param[in] : deviceID: Id for specific device
 *  @return    : pointer to FailedSettings if one or more settings are failed while writing to device,
				 Null Pointer if all settings are written successfully.
 *  Note: This API should be called if Jabra_SetSettings does not return Return_Ok.
	As Memory is allocated through SDK, needs to be freed by calling Jabra_FreeFailedSettings API.
 */
LIBRARY_API FailedSettings* Jabra_GetFailedSettingNames(unsigned short deviceID);

/** Free FailedSettings structure
 *  @param[in] : FailedSettings structure pointer, which needs to be freed.
 *  @return    : void.
 */
LIBRARY_API void Jabra_FreeFailedSettings(FailedSettings* setting);

/** Checks if supports factory reset.
 *  @param[in] : deviceID: id for a specific device.
 *  @param[in] : bluetooth: flag to identify, whether called from BT pairing or not.
 *  @return    : true if device supports factory reset.
				 false if device does not support factory reset.
 */
LIBRARY_API bool Jabra_IsFactoryResetSupported(unsigned short deviceID, bool bluetooth);

#endif /* __JABRADEVICECONFIG_H__ */
