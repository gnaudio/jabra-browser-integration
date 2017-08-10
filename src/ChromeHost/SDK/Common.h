#ifndef __COMMON_H__
#define __COMMON_H__

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
	* @file Common.h
	* @brief Defines the Common interface for universal SDK.
	* Developer information can be found in the Universal SDK documentation.
	*/

	/****************************************************************************/
	/*                              INCLUDE FILES                               */
	/****************************************************************************/

	/****************************************************************************/
	/*                     EXPORTED TYPES and DEFINITIONS                       */
	/****************************************************************************/

#if defined _WIN32 || defined __CYGWIN___
#define LIBRARY_API extern "C" __declspec(dllexport)
#else
#ifdef __APPLE__
#ifdef __cplusplus
#define LIBRARY_API extern "C" __attribute__ ((visibility ("default")))
#else
#define LIBRARY_API __attribute__ ((visibility ("default")))
#endif
#elif __linux__
#define LIBRARY_API extern "C" __attribute__ ((visibility ("default")))
#else
#define LIBRARY_API
#endif
#endif

typedef enum _DeviceListType
{
    SearchResult,
    PairedDevices
    
}Jabra_DeviceListType;

// Paired devices list structure
typedef struct _PairedDevice
{
	char* deviceName;
	char* deviceBTAddr;
}Jabra_PairedDevice;

// Paired devices list structure
typedef struct _PairingList
{
	unsigned short count;
    Jabra_DeviceListType listType;
	Jabra_PairedDevice* pairedDevice;
}Jabra_PairingList;


/* This enum is used for the return values from API*/
typedef enum _ReturnCode
{
	Return_Ok = 0,
	Device_Unknown,
	Device_Invalid,
	Not_Supported,
	Return_ParameterFail,
	No_Information,
	NetworkRequest_Fail,
	Device_WriteFail,
	No_FactorySupported,
	Device_Lock,
	Device_NotLock,
	System_Error,
	Device_BadState
} Jabra_ReturnCode;

// Manifest File Download status
typedef enum _ErrorStatus
{
	NoError = 0,
	SSLError,
	CertError,
	NetworkError,
	DownloadError,
	ParseError,
	OtherError
}Jabra_ErrorStatus;

// Device description structure
typedef struct _DeviceInfo
{
	unsigned short deviceID;
	unsigned short productID;	
	char* deviceName;
	char* usbDevicePath;
	char* parentInstanceId;
	Jabra_ErrorStatus errStatus;
	bool isBTPaired;
	char* dongleName;
	char* variant;
	char* serialNumber;
}Jabra_DeviceInfo;

// Remote MMI structure for button take over
typedef struct _ButtonEventType
{
	unsigned short key;
	char *value;
}ButtonEventType;

typedef struct _ButtonEventInfo
{
	unsigned short buttonTypeKey;
	char *buttonTypeValue;

	int buttonEventTypeSize;
	ButtonEventType *buttonEventType;
}ButtonEventInfo;

typedef struct _ButtonEvent
{
	int buttonEventCount;
	ButtonEventInfo* buttonEventInfo;
}ButtonEvent;

// Predefined inputs enum
typedef enum Jabra_HidInput
{
	Undefined,
	OffHook,
	Mute,
	Flash,
	Redial,
	Key0,
	Key1,
	Key2,
	Key3,
	Key4,
	Key5,
	Key6,
	Key7,
	Key8,
	Key9,
	KeyStar,
	KeyPound,
	KeyClear,
	Online,
	SpeedDial,
	VoiceMail,
	LineBusy,
	RejectCall,
	OutOfRange,
	PseudoOffHook,
	Button1,
	Button2,
	Button3,
	VolumeUp,
	VolumeDown,
	FireAlarm,
	JackConnection,
	QDConnection,
	HeadsetConnection,
} Jabra_HidInput;

/****************************************************************************/
/*                           EXPORTED FUNCTIONS                             */
/****************************************************************************/

/** Get SDK version
 *  @param[in]   : version : Char Pointer to hold SDK Version
 *  @param[in]   : count : Number of characters to copy to version char pointer
 *  @param[Out]  : version : holds the SDK Version
 *  @return      : Return_Ok if get version is successful.
				   Device_Unknown if deviceID is wrong.
				   Return_ParameterFail if setting parameter is wrong.
          Note   :version pointer to location where the SDK version is written. Must be allocated by caller.
 */
LIBRARY_API Jabra_ReturnCode Jabra_GetVersion(char* const version, int count);


/** Library initialization
 *  @param[in]   : FirstScanForDevicesDoneFunc: Callback method. Called when USB scan is done. Can be NULL if not used.
 *  @param[in]   : DeviceAttachedFunc: Callback method. Called when a device is attached. Can be NULL if not used.
 *  @param[in]   : DeviceRemovedFunc: Callback method. Called when a device is removed. Can be NULL if not used.
 *  @param[in]   : ButtonInDataRawHidFunc: Callback method. Called on new input data. Raw HID. Low-level. Can be NULL if not used.
 *  @param[in]   : ButtonInDataTranslatedFunc: Callback method. Called on new input data. High-level. Can be NULL if not used.
 *  @param[in]   : instance: Optional instance number. Can be 0 if not used.
 *  @return      : True if library initialization is successful.
				   False if library initilaization is not successful.
 */
LIBRARY_API bool Jabra_Initialize(void(*FirstScanForDevicesDoneFunc)(void),
	void(*DeviceAttachedFunc)(Jabra_DeviceInfo deviceInfo),
	void(*DeviceRemovedFunc)(unsigned short deviceID),
	void(*ButtonInDataRawHidFunc)(unsigned short deviceID, unsigned short usagePage, unsigned short usage, bool buttonInData),
	void(*ButtonInDataTranslatedFunc)(unsigned short deviceID, Jabra_HidInput translatedInData, bool buttonInData),
	unsigned int instance
	);

/** Library uninitialize
 *  @return      : True if library uninitialization is successful.
				   False if library initialization is not successful.
 */
LIBRARY_API bool Jabra_Uninitialize();

/** Check if device scan is done.
 *  @return      : True if  USB device scan is done.
				   False if USB device scan is not done.
 Note           : Library initialization must be performed before calling this function.
 */
 
LIBRARY_API bool Jabra_IsFirstScanForDevicesDone();

/** Check if a device is attached.
 *  @param[in]   : deviceID: Id for specific device.
 *  @return      : True if  device is attached.
				   False if device is not attached.
 */
LIBRARY_API bool Jabra_IsDeviceAttached(unsigned short deviceID);


/** Information of all attached devices.
 *  @param[in]   : count: Pointer to an integer that has the number of Jabra_DeviceInfo structures allocated before calling this function.
				   On return this pointer has the value of how many devices that was added.
 *  @param[in]   : deviceInfoList: Pointer to an array of Jabra_DeviceInfo to be populated.
 *  @return      : void.
 */
LIBRARY_API void Jabra_GetAttachedJabraDevices(int* count, Jabra_DeviceInfo* deviceInfoList);

/** Get serial number.
 *  @param[in]   : deviceID: Id for a specific device.
 *  @param[in]   : serialNumber: Pointer to location where the serial number is written. Must be allocated by the caller.
 *  @param[in]   : count: Maximum number of characters to copy to serialNumber.
 *  @return      : Return_Ok if get serial number is successful.
				   Device_Unknown if deviceID is wrong.
				   Return_ParameterFail if setting parameter is wrong.
				   No_Information if there is no information in the cloud regarding the serial number.
				   NetworkRequest_Fail if the server is down or if there is any error during parsing.
 */
LIBRARY_API Jabra_ReturnCode Jabra_GetSerialNumber(unsigned short deviceID, char* const serialNumber, int count);

/** Get firmware version of the device.
 *  @param[in]   : deviceID: Id for a specific device.
 *  @param[in]   : firmwareVersion: Pointer to a location where the firmware version is written. Must be allocated by the caller.
 *  @param[in]   : count: Maximum number of characters to copy to firmwareVersion.
 *  @param[out]  : firmwareVersion: firmware version of device.
 *  @return      : Return_Ok if get serial number is successful.
				   Device_Unknown if deviceID is wrong.
				   Not_Supported for devices which do not support GN Protocol.
 */

LIBRARY_API Jabra_ReturnCode Jabra_GetFirmwareVersion(unsigned short deviceID, char* const firmwareVersion, int count);

/** Gets  the device image path.
 *  @param[in] : deviceID: id for a specific device.
 *  @return    : returns the path of the device image.
 *  Note       : As Memory is allocated through SDK, needs to be freed by calling Jabra_FreeString API.
 */
LIBRARY_API const char *  Jabra_GetDeviceImagePath(unsigned short deviceID);

/** Gets  the device image thumbnail path.
 *  @param[in] : deviceID: id for a specific device.
 *  @return    : return the path of the device image thumbnail.
 *  Note       : As Memory is allocated through SDK, need to be freed by calling Jabra_FreeString API.
 */
LIBRARY_API const char *  Jabra_GetDeviceImageThumbnailPath(unsigned short deviceID);

/** Sets the Application ID.
 *  @param[in] : appID: id for the application.
 *  @return    : void.
 */
LIBRARY_API void Jabra_SetAppID(char* inAppID);

/** Frees the deviceinfo structure members.
 *  @param[in] : Jabra_DeviceInfo structure to be freed.
 *  @return    : void.
 */
LIBRARY_API void Jabra_FreeDeviceInfo(Jabra_DeviceInfo info);

/** Get battery status, if supported by device.
 *  @param[in] : Id for a specific device.
 *  @param[in] : Battery level in percent (0 - 100).
 *  @param[in] : charging: Indicates if battery is being charged.
 *  @param[in] : Indicates if battery level is low.
 *  @return    : Return_Ok if get battery information is returned.
				 Device_Unknown if deviceID is wrong.
				 Not_Supported if device does not have battery information.
 */
LIBRARY_API Jabra_ReturnCode Jabra_GetBatteryStatus(
	unsigned short deviceID,
	int *levelInPercent,
	bool *charging,
	bool *batteryLow
	);

/** Integrates softphone app to Jabra applications like Jabra Direct(JD) and Jabra Suite for Mac(JMS).
 *  @param[in] : guid: client unique id.
 *  @param[in] : softphoneName: name of the application to be shown in JD or JMS.
 *  @return    : true if softphone app integrates to Jabra application.
				 false otherwise.
 */
LIBRARY_API bool Jabra_ConnectToJabraApplication(const char* guid, const char* softphoneName);

/** Disconnects connected from Jabra applications.
 *  @return    : void.
 */
LIBRARY_API void Jabra_DisconnectFromJabraApplication();


/** Sets the softphone to Ready. Currently applicable for only Jabra Direct. Will be available in later versions of JMS.
 *  @param[in] : isReady: sets the softphone readiness state
 *  @return    : void.
 */
LIBRARY_API void Jabra_SetSoftphoneReady(bool isReady);

/** Indicates whether the softphone is in focus.
*   @return      : true if softphone is in focus.
				   false otherwise.
*/
LIBRARY_API bool Jabra_IsSoftphoneInFocus();

/** Set the bluetooth device in pairing mode.
 *  @param[in] : deviceID: id for a BT adapter
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Device_NotLock if device is not locked.
				 System_Error if there is some error during packet formation.
				 Device_WriteFail if it fails to write to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetBTPairing(unsigned short deviceID);

/** Search for available Bluetooth devices which are switched on, within range and ready to connect.
 *  @param[in] : deviceID: id for the BT adapter.
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SearchNewDevices(unsigned short deviceID);

/** Stop search for available Bluetooth devices.
 *  @param[in] : deviceID: id for a BT adapter
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Device_NotLock if device is not locked.
				 System_Error if there is some error during packet formation.
				 Device_WriteFail if it fails to write to the device.
 
 */
LIBRARY_API Jabra_ReturnCode Jabra_StopBTPairing(unsigned short deviceID);

/** When Bluetooth adapter is plugged into the PC it will attempt to connect with the last connected Bluetooth device. If it cannot connect, it will automatically search for new Bluetooth devices to connect to.
 *  @param[in] : deviceID: id for a BT adapter.
 *  @param[in] : value: enable or disable for auto pairing.
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Device_NotLock if device is not locked.
				 System_Error if there is some error during packet formation.
				 Device_WriteFail if it fails to write to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetAutoPairing(unsigned short deviceID, bool value);

/** Get Auto pairing mode enable or disable
 *  @param[in] : deviceID: id for a BT adapter
 *  @return    : true if auto pairing mode is enabled.
				 false otherwise.
 */
LIBRARY_API bool Jabra_GetAutoPairing(unsigned short deviceID);

/** Clear list of paired BT devices from BT adaptor.
 *  @param[in] : deviceID: id for a BT adapter
 *  @return    : Return_Ok if success.
				 
 */
LIBRARY_API Jabra_ReturnCode Jabra_ClearPairingList(unsigned short deviceID);

/** Connect/Reconnect Bluetooth device to the Jabra Bluetooth adapter. Ensure the Bluetooth device is switched on and within range.
 *  @param[in] : deviceID: id for a BT adapter
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Device_NotLock if device is not locked.
				 System_Error if there is some error during packet formation.
				 Device_WriteFail if it fails to write to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_ConnectBTDevice(unsigned short deviceID);

/** Connect a new device.
 *  @param[in] : deviceID: Id for specific device
 *  @param[in] : device: pointer to structure Jabra_PairedDevice
 *  @return    : Return_Ok if success.
 *               Device_Unknown if deviceID is wrong.
 */
LIBRARY_API Jabra_ReturnCode Jabra_ConnectNewDevice(unsigned short deviceID, Jabra_PairedDevice* device);

/** Disconnect  Bluetooth device from  Bluetooth adapter.
 *  @param[in] : deviceID: id for a BT adapter
  *  @return   : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Device_NotLock if device is not locked.
				 System_Error if there is some error during packet formation.
				 Device_WriteFail if it fails to write to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_DisconnectBTDevice(unsigned short deviceID);

/** Get name of connected BT device with BT Adapter.
 *  @param[in] : deviceID: id for a BT adapter
 *  @return    : name of connected BT device.
 */
LIBRARY_API char* Jabra_GetConnectedBTDeviceName(unsigned short deviceID);

/** Get error string from the error status.
 *  @param[in] : Status of the error from the Jabra Device
 *  @return    : error message for the error recieved from Device Events. The reciever of the string should release the string.
 */

LIBRARY_API char* Jabra_GetErrorString(Jabra_ErrorStatus errStatus);

/** Get lock for a particular device.
 *  @param[in] : deviceID: id for a device
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 Device_Lock if acquired by some other process.
 */
LIBRARY_API Jabra_ReturnCode Jabra_GetLock(unsigned short deviceID);

/** Release the lock for a particular device.
 *  @param[in] : deviceID: id for a device
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 System_Error if acquired by some other process.
 */
LIBRARY_API Jabra_ReturnCode Jabra_ReleaseLock(unsigned short deviceID);

/** Check if the device is locked or not.
 *  @param[in] : deviceID: id for a device.
 *  @return    : true if device is locked.
 */
LIBRARY_API bool Jabra_IsLocked(unsigned short deviceID);

/** Checks if busylight is supported by the device.
*  @param[in] : deviceID: id for a device.
*  @return    : true if busylight is supported.
				false if device does not support busylight.
*/
LIBRARY_API bool Jabra_IsBusylightSupported(unsigned short deviceID);

/** Checks the status of busylight.
*  @param[in] : deviceID: id for a device.
*  @return    : true if busylight is on.
				false if busylight is off or if it is not supported.
*/
LIBRARY_API bool Jabra_GetBusylightStatus(unsigned short deviceID);

/** Enable/Disable the busylight status.
*  @param[in] : deviceID: id for a device.
*  @param[in] : value: enable or disable busylight.
*  @return    : Return_Ok if success.
				Device_NotLock if device is not locked before starting of the operation.
				Device_Unknown if deviceID is wrong.
				System_Error if there is some error during packet formation.
				Device_WriteFail if it fails to write the value to the device.
*/
LIBRARY_API Jabra_ReturnCode Jabra_SetBusylightStatus(unsigned short deviceID, bool value);

/** Registration for busylight event.
*  @param[in]   : BusylightFunc: Callback method. Called when busylight event is received from device. Can be NULL if not used.
*  @return      : void.
*/
LIBRARY_API void Jabra_RegisterBusylightEvent(void(*BusylightFunc)(unsigned short deviceID, bool busylightValue));

/** Register callback for Pairing list
 *  @param[in] : PairingList, call back method, will be called when paired devices changed event received from device.
 *  @return    : void.
 */
LIBRARY_API void Jabra_RegisterPairingListCallback(void(*PairingList)(unsigned short deviceID, Jabra_PairingList *lst));

/** Checks if pairing list is supported by the device.
*  @param[in] : deviceID: id for a device.
*  @return    : true if pairing list is supported.
				false if device does not support pairing list.
*/
LIBRARY_API bool Jabra_IsPairingListSupported(unsigned short deviceID);

/** Gets the list of devices which are paired previously.
 *  @param[in] : deviceID: Id for specific device.
 *  @return    : returns pointer to the structure Jabra_PairingList contains all paired device details.
 *  Note       : As Memory is allocated through SDK, need to be freed by calling Jabra_FreePairingList API.
 */
LIBRARY_API Jabra_PairingList* Jabra_GetPairingList(unsigned short deviceID);

/** Frees the memory allocated for the list of paired devices.
 *  @param[in] : deviceList: Jabra_PairingList structure pointer, which needs to be freed.
 *  @return    : void.
 */
LIBRARY_API void Jabra_FreePairingList(Jabra_PairingList* deviceList);

/** Connect a device which was already paired.
 *  @param[in] : deviceID: Id for specific device
 *  @param[in] : device: pointer to structure Jabra_PairingList
 *  @return    : Return_Ok if success.
				 Device_NotLock if device is not locked before starting of the operation.
				 Device_Unknown if deviceID is wrong.
				 System_Error if there is some error during packet formation.
				 Device_WriteFail if it fails to write the value to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_ConnectPairedDevice(unsigned short deviceID, Jabra_PairedDevice* device);

/** Disconnect a paired device.
 *  @param[in] : deviceID: Id for specific device
 *  @param[in] : device: pointer to structure Jabra_PairingList
 *  @return    : Return_Ok if success.
				 Device_NotLock if device is not locked before starting of the operation.
				 Device_Unknown if deviceID is wrong.
				 System_Error if there is some error during packet formation.
				 Device_WriteFail if it fails to write the value to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_DisConnectPairedDevice(unsigned short deviceID, Jabra_PairedDevice* device);

/** Clear a device from paired device list.
 *  @param[in] : deviceID: Id for specific device.
 *  @param[in] : device: pointer to structure Jabra_PairingList.
 *  @return    : Return_Ok if success.
				 Device_NotLock if device is not locked before starting of the operation.
				 Device_Unknown if deviceID is wrong.
				 System_Error if there is some error during packet formation.
				 Device_WriteFail if it fails to write the value to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_ClearPairedDevice(unsigned short deviceID, Jabra_PairedDevice* device);

/** Checks if remote MMI feature is supported by the device.
*  @param[in] : deviceID: id for a device.
*  @return    : true if remote MMI feature is supported.
				false if device does not support remote MMI feature.
*/
LIBRARY_API bool Jabra_IsRemoteMMISupported(unsigned short deviceID);

/** Configures the remote MMI events for a device.
*  @param[in] : deviceID : id for a specific device.
*  @param[in] : buttonEvent : button events to be set in device.
*  @return    : Return_Ok if success.
				Device_NotLock if device is not locked before starting of the operation.
				Device_Unknown if deviceID is wrong.
				Return_ParameterFail if setting parameter is wrong.
				System_Error if there is some error during packet formation.
				Device_WriteFail if it fails to write the value to the device.
*/
LIBRARY_API Jabra_ReturnCode Jabra_GetButtonFocus(unsigned short deviceID, ButtonEvent *buttonEvent);

/** Releases the remote MMI events configured in the device.
*  @param[in] : deviceID : id for a specific device.
*  @param[in] : buttonEvent : button events to be released in device.
*  @return    : Return_Ok if setting is successful.
				Device_Unknown if deviceID is wrong.
				Device_NotLock if device is not locked before starting of the operation.
				Return_ParameterFail if setting parameter is wrong.
				System_Error if there is some error during packet formation.
				Device_WriteFail if it fails to write the value to the device.
*/
LIBRARY_API Jabra_ReturnCode Jabra_ReleaseButtonFocus(unsigned short deviceID, ButtonEvent *buttonEvent);

/** Gets the supported remote MMI for a device
*  @param[in] : deviceID: Id for specific device
*  @return    : pointer to the structure ButtonEvent containing all button events for that device. 
*/
LIBRARY_API ButtonEvent* Jabra_GetSupportedButtonEvents(unsigned short deviceID);

/** Free the memory allocated for the button events.
*  @param[in] : Pointer to the structure ButtonEvent which needs to be freed.
*  @return    : void.
*  Note       : As Memory is allocated through SDK, need to be freed by calling API.
*/
LIBRARY_API void Jabra_FreeButtonEvents(ButtonEvent *eventsSupported);

/** Registration for GNP events
*  @param[in]   : deviceID: Id for specific device
*  @param[in]   : ButtonGNPEventFunc: Callback method. Called on GNP events received. Can be NULL if not used.
*  @return      : NA
*/
LIBRARY_API void Jabra_RegisterForGNPButtonEvent(
	void(*ButtonGNPEventFunc)(unsigned short deviceID, ButtonEvent *buttonEvent));

#endif /* __COMMON_H__ */
