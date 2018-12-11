#ifndef COMMON_H
#define COMMON_H

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
#include <stdint.h>
#include <wchar.h>

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
#include <stdbool.h>
#elif __linux__
#ifdef __cplusplus
#define LIBRARY_API extern "C" __attribute__ ((visibility ("default")))
#else
#define LIBRARY_API __attribute__ ((visibility ("default")))
#include <stdbool.h>
#endif
#endif
#endif

#if defined _WIN32 || defined __CYGWIN___
#define LIBRARY_VAR extern "C" __declspec(dllexport)
#else
#ifdef __cplusplus
#define LIBRARY_VAR extern "C" __attribute__ ((visibility ("default")))
#else
#define LIBRARY_VAR extern __attribute__ ((visibility ("default")))
#endif
#endif

typedef enum _DeviceListType
{
    SearchResult,
    PairedDevices,
    SearchComplete

}Jabra_DeviceListType;

// Paired devices list structure
typedef struct _PairedDevice
{
	char* deviceName;
	uint8_t deviceBTAddr[6];
    bool isConnected;
}Jabra_PairedDevice;

// Paired devices list structure
typedef struct _PairingList
{
	unsigned short count;
    Jabra_DeviceListType listType;
	Jabra_PairedDevice* pairedDevice;
}Jabra_PairingList;


/* This enum is used for the return values from API*/
#define DEFINE_CODE(a,b) a,
typedef enum _ReturnCode
{
#include "returncodes.inc"
    NUMBER_OF_JABRA_RETURNCODES
} Jabra_ReturnCode;
#undef DEFINE_CODE


#define DEFINE_CODE(a,b) a,
typedef enum _ErrorStatus
{
#include "errorcodes.inc"
    NUMBER_OF_JABRA_ERRORCODES
}Jabra_ErrorStatus;
#undef DEFINE_CODE

typedef enum _DeviceConnectionType
{
    USB = 0,
    BT
}DeviceConnectionType;

// Device description structure
typedef struct _DeviceInfo
{
	unsigned short deviceID;
	unsigned short productID;
	unsigned short vendorID;
	char* deviceName;
	char* usbDevicePath;
	char* parentInstanceId;
	Jabra_ErrorStatus errStatus;
	bool isDongle;
	char* dongleName;
	char* variant;
	char* serialNumber;
    bool isInFirmwareUpdateMode;
    DeviceConnectionType deviceconnection;
    unsigned long connectionId;
    unsigned short parentDeviceId;
}Jabra_DeviceInfo;

// This structure represents each button event type info. For example: Tap (00), Press(01), Double Tap(02) etc.
typedef struct _ButtonEventType
{
    /* Hex value for button event. Key can be 00 for Tap, 01 for Press, 02 for double tap etc. */
    unsigned short key;
    /* description of button event. For example: value can be "Tap" or "Press" or "Double tap".  */
    char *value;
}ButtonEventType;

/* This structure represents each Remote MMI info. For example Volume up/down button is supported by Tap, MFB button is supported by Tap/Press/Double Tap */
typedef struct _ButtonEventInfo
{
    /* Hex value for button type. For example: Volume up(01), Volume down(02) etc. */
    unsigned short buttonTypeKey;
    /* description of button type. For example: buttonTypeValue can be "Volume Up" or "Volume Down" or "MFB".   */
    char *buttonTypeValue;

    /* Number of button events under a button type. Ex. If MFB is supported by "Tap", "Press", "Double Tap", then buttonEventTypeSize is 3. */
    int buttonEventTypeSize;
    /* Button event information of all button event types of the device */
    ButtonEventType *buttonEventType;
}ButtonEventInfo;

/* This structure represents Remote MMI's available for the device */
typedef struct _ButtonEvent
{
    /* number of Remote MMI's available for the device. If device supports "Volume Up", "Volume Down" and "MFB" as remote MMI, buttonEventCount is 3. */
    int buttonEventCount;
    /* Remote MMI information of all button events of the device */
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

// Equalizer
typedef struct _EqualizerBand
{
  /* the gain (or attenuation) range in dB which the device can handle. Only the positive value (gain) is given,
   * the max attenuation is the corresponding negative value. Read-only */
  float max_gain;
  /* band center frequency in Hz. Read-only */
  int centerFrequency;
  /* the current gain setting [dB] for the band. Must be numerically <= max_gain. Read-only */
  float currentGain;
} Jabra_EqualizerBand;

// Logging Flags
typedef enum _Logging
{
    Local = 0,
    Cloud,
    All
}Jabra_Logging;

/* This structure represents firmware version info of a firmware from cloud*/
typedef struct _FirmwareInfo {
    /*version of firmware*/
    char *version;
    /*size of firmware file in KB/MB */
    char * fileSize;
    /*release date of firmware*/
    char *releaseDate;
    /* Firmware stage */
    char *stage;
    /*release notes of firmware*/
    wchar_t *releaseNotes;
} Jabra_FirmwareInfo;

typedef struct _FirmwareInfoList {
	unsigned count;
	Jabra_FirmwareInfo* items;
}Jabra_FirmwareInfoList;

typedef struct _FirmwareErrorInfo
{
    char* errorExceptionType;
    char* errorMessage;
    char* errorDetails;
}Jabra_FirmwareErrorInfo;

/* This enum represents event type for callback*/
typedef enum  _FirmwareEventType {
    Firmware_Download = 0,
    Firmware_Update
}Jabra_FirmwareEventType;

typedef enum _FirmwareEventStatus
{
    Initiating = 0,
    InProgress,
    Completed,
    Cancelled,
    File_NotAvailable,
    File_NotAccessible,
    File_AlreadyPresent,
    Network_Error,
    SSL_Error,
    Download_Error,
    Update_Error,
    Invalid_Authentication,
    File_UnderDownload,
    Not_Allowed
}Jabra_FirmwareEventStatus; //FIXME: needs to be consolidated with other result codes, i think

typedef enum _UploadEventStatus
{
    Upload_InProgress = 0,
    Upload_Completed,
    Upload_Error,
} Jabra_UploadEventStatus;

typedef enum _DeviceFeature {
    BusyLight = 1000,
    FactoryReset = 1001,
    PairingList = 1002,
    RemoteMMI = 1003,
    MusicEqualizer = 1004,
    EarbudInterconnectionStatus = 1005,
    StepRate = 1006,
    HeartRate = 1007,
    RRInterval = 1008,
    RingtoneUpload = 1009,
    ImageUpload = 1010,
    NeedsExplicitRebootAfterOta = 1011,
    NeedsToBePutIncCradleToCompleteFwu = 1012,
    RemoteMMIv2 = 1013,
    Logging = 1014,
    PreferredSoftphoneListInDevice = 1015,
    VoiceAssistant = 1016,
    PlayRingtone=1017,
	SetDateTime = 1018
} DeviceFeature;

/* This structure represents the product registration info*/
typedef struct _ProductRegistration {
  const char *firstName;
  const char *lastName;
  const char *email;
  const char *country;
  const char *appVersion;
  const char *osName;
  const char *osVersion;
  const char *locale;
  bool marketingConsent;
} ProductRegInfo;

typedef enum _AVRCPCommand {
    AVRCPPlay = 0,
    AVRCPPause,
    AVRCPStop,
    AVRCPToggle,
    AVRCPPrevious,
    AVRCPNext
} AVRCPCommand;

typedef enum _SystemComponentID{
	PRIMARY_HEADSET,
	SECONDARY_HEADSET,
	CRADLE,
	OTHER
}SystemComponentID;

typedef struct _MapEntry_Int_String{
    int key;
    char* value;
} MapEntry_Int_String;

typedef struct _Map_Int_String{
    int length;
    MapEntry_Int_String* entries;
} Map_Int_String;

/** Structure to use when setting the date and time of a device. */
typedef struct _timedate_t {
  /** Seconds, range is [0-59]. */
  int sec;
  /** Minutes, range is [0-59]. */
  int min;
  /** Hours, range is [0-23]. */
  int hour;
  /** Day of month, range is [1-31]. */
  int mday;
  /** Month, range is [0-11]. */
  int mon;
  /** Year, range is [0-n], where 0 is 1900CE. */
  int year;
  /** Day of week, range is [0-6] where 0 is Sunday. */
  int wday;
} timedate_t;

// bitmasks for use with Jabra_SetSubscribedDeviceEvents() and Jabra_GetSupportedDeviceEvents()
LIBRARY_VAR const uint32_t DEVICE_EVENT_AUDIO_READY;

typedef enum _AUDIO_FILE_FORMAT {
    AUDIO_FILE_FORMAT_NOT_USED = 0,
    AUDIO_FILE_FORMAT_WAV_UNCOMPRESSED,
    AUDIO_FILE_FORMAT_ULAW_COMPRESSED,
    AUDIO_FILE_FORMAT_SBC_COMPRESSED,
    AUDIO_FILE_FORMAT_G72_COMPRESSED,
} AUDIO_FILE_FORMAT;

/* Structure represents the parameters for uploading audio file to device */
typedef struct _audioFileParams {
    /* audio file format allowed */
    AUDIO_FILE_FORMAT audioFileType;
    /* number of channels present */
    unsigned int numChannels;
    /* bits per sample */
    unsigned int bitsPerSample;
    /* sample rate of the audio */
    unsigned int sampleRate;
    /* maximum file size allowed */
    unsigned int maxFileSize;
} Jabra_AudioFileParams;

/**
 * Types of remote MMIs, use Jabra_GetRemoteMmiTypes to determine the types
 * supported for the device in question.
 * @note RemoteMMIv2 only.
 */
typedef enum _RemoteMmiType {
  MMI_TYPE_MFB       = 0,
  MMI_TYPE_VOLUP     = 1,
  MMI_TYPE_VOLDOWN   = 2,
  MMI_TYPE_VCB       = 3,
  MMI_TYPE_APP       = 4,
  MMI_TYPE_TR_FORW   = 5,
  MMI_TYPE_TR_BACK   = 6,
  MMI_TYPE_PLAY      = 7,
  MMI_TYPE_MUTE      = 8,
  MMI_TYPE_HOOK_OFF  = 9,
  MMI_TYPE_HOOK_ON   = 10,
  MMI_TYPE_BLUETOOTH = 11,
  MMI_TYPE_JABRA     = 12,
  MMI_TYPE_BATTERY   = 13,
  MMI_TYPE_PROG      = 14,
  MMI_TYPE_LINK      = 15,
  MMI_TYPE_ANC       = 16,
  MMI_TYPE_LISTEN_IN = 17,
  MMI_TYPE_DOT3      = 18,
  MMI_TYPE_DOT4      = 19,
  SEPERATOR_FOR_MMI_TYPE = 128, /* not to be used */
  MMI_TYPE_BUSYLIGHT = SEPERATOR_FOR_MMI_TYPE
} RemoteMmiType;

/**
 * Remote MMI sequences, used to identify supported output LEDs (as a bitmask)
 * and for setting the output LEDs (single bit).
 * @note RemoteMMIv2 only.
 */
typedef enum _RemoteMmiSequence {
  MMI_LED_SEQUENCE_OFF     = 0x01,
  MMI_LED_SEQUENCE_ON      = 0x02,
  MMI_LED_SEQUENCE_SLOW    = 0x04,
  MMI_LED_SEQUENCE_FAST    = 0x08
} RemoteMmiSequence;

/**
 * Remote MMI priorities.
 * @note RemoteMMIv2 only.
 */
typedef enum _RemoteMmiPriority {
  /**
   * Used for remote MMIs that does not support priority.
   */
  MMI_PRIORITY_NONE    = 0x00,
  /**
   * Get remote MMI focus if device doesn't use it or no function is assigned
   * to the button.
   */
  MMI_PRIORITY_LOW     = 0x01,
  /**
   * Get remote MMI focus unconditionally, this can remove important
   * functionality from the device.
   */
  MMI_PRIORITY_HIGH    = 0x02
} RemoteMmiPriority;

/**
 * Remote MMI action to use in Jabra_SetRemoteMmiAction for setting the MMI
 * output LED(s). Only single bit value of RemoteMmiSequence can be specified
 * as parameter RemoteMmiActionOutput to Jabra_SetRemoteMmiAction.
 * @note RemoteMMIv2 only.
 */
typedef struct _RemoteMmiActionOutput {
  uint8_t red;
  uint8_t green;
  uint8_t blue;
  RemoteMmiSequence sequence;
} RemoteMmiActionOutput;

/**
 * Supported remote MMI output LED colours.
 * @note RemoteMMIv2 only.
 */
typedef struct _RemoteMmiOutput {
  bool red;
  bool green;
  bool blue;
} RemoteMmiOutput;

/**
 * Remote MMI input actions.
 * Remote MMI input, used to identify supported input actions (as a bitmask)
 * and for reporting input events via the RemoteMmiCallback callback (as single bit).
 * @note RemoteMMIv2 only.
 */
typedef enum _RemoteMmiInput {
  MMI_ACTION_NONE          = 0x00,
  MMI_ACTION_UP            = 0x01,
  MMI_ACTION_DOWN          = 0x02,
  MMI_ACTION_TAP           = 0x04,
  MMI_ACTION_DOUBLE_TAP    = 0x08,
  MMI_ACTION_PRESS         = 0x10,
  MMI_ACTION_LONG_PRESS    = 0x20,
  MMI_ACTION_X_LONG_PRESS  = 0x40
} RemoteMmiInput;

/**
 * Remote MMI definitions for the supported MMIs.
 * @note RemoteMMIv2 only.
 */
typedef struct _RemoteMmiDefinition {
  /** supported type */
  RemoteMmiType type;
  /** mask of supported priorities. */
  RemoteMmiPriority priorityMask;
  /** mask of supported output LED sequences. */
  RemoteMmiSequence sequenceMask;
  /** mask of supported inputs. */
  RemoteMmiInput inputMask;
  /** supported output LED colours. */
  RemoteMmiOutput output;
} RemoteMmiDefinition;

typedef struct _PanicListDevType
{
	uint8_t panicCode[25];
}Jabra_PanicListDevType;

typedef struct _PanicListType
{
    unsigned int entriesNo;
    Jabra_PanicListDevType * panicList; /* array with dynamic length 1..x */
}Jabra_PanicListType;


// Definition of behavior of the internal DeviceCatalogue
typedef struct {
	const char* preloadZipFile; // full path of zip file to preload (same as Jabra_PreloadDeviceInfo(), which will be deprecated, may be null
	unsigned delayInSecondsBeforeStartingRefresh; // when refreshing data for existing devices, wait this time before going online to erduce the risk of cache locks and reduce the CPU load at startup. Default: 30s
	bool refreshAtConnect; // when a device is connected, update device data in the background (using delayInSecondsBeforeStartingRefresh). Default: true
	bool refreshAtStartup; // at SDK startup, update data for all previously connected devices in the background (using delayInSecondsBeforeStartingRefresh). Default: true.
	int refreshScope; // when refreshing, what should be in scope:  0: nothing (= block refreshes), 1:all previously connected devices. Default: 1
    bool fetchDataForUnknownDevicesInTheBackground; // if true: when an unknown device connects, data is updated in the background (ignoring the delay in delayInSecondsBeforeStartingRefresh), and an update notification is delivered to the onDeviceDataUpdated callback. If false: device data is fetched synchronously (as before). Default: false.
    void(*onDeviceDataUpdated)(unsigned short deviceID); // if not null: called when data for a connected device is (partially or fully) updated.
} DeviceCatalogue_params;

// Parameters for configuring the SDK at initialization
typedef struct _Config_params{
	DeviceCatalogue_params* deviceCatalogue_params; // optional config for the device catalogue. May be null.
	void* reserved1; // for internal Jabra use
	void* reserved2; // for internal Jabra use
} Config_params;
/****************************************************************************/
/*                           EXPORTED FUNCTIONS                             */
/****************************************************************************/
/** Get SDK version
 *  @param[in]   : version : Char Pointer to hold SDK Version
 *  @param[in]   : count : Number of characters to copy to version char pointer
 *  @param[Out]  : version : holds the SDK Version
 *  @return      : Return_Ok if get version is successful.
				   Return_ParameterFail if version is NULL or too small to contain result.
          Note   :version pointer to location where the SDK version is written. Must be allocated by caller.
 */
LIBRARY_API Jabra_ReturnCode Jabra_GetVersion(char* const version, int count);

/** Sets the Application ID.
 *  @param[in] : appID: id for the application.
 *  @return    : void.
 */
LIBRARY_API void Jabra_SetAppID(const char* inAppID);

/** Library initialization - only intended to be called once.
 *  @param[in]   : FirstScanForDevicesDoneFunc: Callback method. Called when USB scan is done. Can be NULL if not used.
 *  @param[in]   : DeviceAttachedFunc: Callback method. Called when a device is attached. Can be NULL if not used. Callee must call Jabra_FreeDeviceInfo() to free memory.
 *  @param[in]   : DeviceRemovedFunc: Callback method. Called when a device is removed. Can be NULL if not used.
 *  @param[in]   : ButtonInDataRawHidFunc: Callback method. Called on new input data. Raw HID. Low-level. Can be NULL if not used.
 *  @param[in]   : ButtonInDataTranslatedFunc: Callback method. Called on new input data. High-level. Can be NULL if not used.
 *  @param[in]   : instance: Optional instance number. Can be 0 if not used.
 *  @param[in]	  : configParams: optional configuration of various SDK lib behavior. May be null.
 *  @return      : True if library initialization is successful.
				   False if library initilaization is not successful. One reason could be that the library is already initialized.
    Note         : AppID must be set before the library initialization is called. If not the initialization fails.
 */
LIBRARY_API bool Jabra_Initialize(void(*FirstScanForDevicesDoneFunc)(void),
	void(*DeviceAttachedFunc)(Jabra_DeviceInfo deviceInfo),
	void(*DeviceRemovedFunc)(unsigned short deviceID),
	void(*ButtonInDataRawHidFunc)(unsigned short deviceID, unsigned short usagePage, unsigned short usage, bool buttonInData),
	void(*ButtonInDataTranslatedFunc)(unsigned short deviceID, Jabra_HidInput translatedInData, bool buttonInData),
	unsigned int instance,
	Config_params* configParams
	);

/** Library uninitialize
 *  @return      : True if library uninitialization is successful.
				   False if library initialization is not successful (for example if called when not initialized)
 */
LIBRARY_API bool Jabra_Uninitialize(void);

/** Check if device scan is done.
 *  @return      : True if  USB device scan is done.
				   False if USB device scan is not done.
 Note           : Library initialization must be performed before calling this function.
 */

LIBRARY_API bool Jabra_IsFirstScanForDevicesDone(void);

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
 *  Note: call Jabra_FreeDeviceInfo() on each object in the list when done do avoid a memory leak.
 */
LIBRARY_API void Jabra_GetAttachedJabraDevices(int* count, Jabra_DeviceInfo* deviceInfoList);

/** Frees the deviceinfo structure members.
 *  @param[in] : Jabra_DeviceInfo structure to be freed.
 *  @return    : void.
 */
LIBRARY_API void Jabra_FreeDeviceInfo(Jabra_DeviceInfo info);

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


/** Get ESN (electronic serial number).
 *  @param[in]   : deviceID: Id for a specific device.
 *  @param[in]   : esn: Pointer to location where the esn is written. Must be allocated by the caller.
 *  @param[in]   : count: Maximum number of characters to copy to serialNumber.
 *  @return      : Return_Ok if get serial number is successful.
				   Device_Unknown if deviceID is wrong.
				   Return_ParameterFail if setting parameter is wrong.
 */
LIBRARY_API Jabra_ReturnCode Jabra_GetESN( unsigned short deviceID, char* const esn,int count);

/**
 * Get ESN for all device components (some devices may be a system of multiple devices, e.g., a TW headset (left earbud, right earbud, cradle).
 * @param[in]   : deviceID: Id for a specific device.
 * @return pointer to a map with the requested info (null on failure). Caller is responsible for calling Jabra_FreeMap(esnMap) to release the allocated memory after use.
 */
LIBRARY_API Map_Int_String* Jabra_GetMultiESN( unsigned short deviceID);

/**
 * Release memory allocated by functions returning a Map_Int_String*
 *
 * @param[in]: map: map to release
 */
LIBRARY_API void Jabra_FreeMap(Map_Int_String* map);

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

/**
 * Get the language code for the current language of the device
 *  @param[in]   : deviceID: Id for a specific device.
 *  @param[out]  : languageCode: the code of the current language
 *  @return      : Return_Ok if is successful, otherwise Not_Supported or Device_Unknown.
 */
LIBRARY_API Jabra_ReturnCode Jabra_GetCurrentLanguageCode(unsigned short deviceID, unsigned short* languageCode);


/** Gets  the device image path.
 *  @param[in] : deviceID: id for a specific device.
 *  @return    : returns the path of the device image.
 *  Note       : As Memory is allocated through SDK, needs to be freed by calling Jabra_FreeString API.
 */
LIBRARY_API char *  Jabra_GetDeviceImagePath(unsigned short deviceID);

/** Gets  the device image thumbnail path.
 *  @param[in] : deviceID: id for a specific device.
 *  @return    : return the path of the device image thumbnail.
 *  Note       : As Memory is allocated through SDK, need to be freed by calling Jabra_FreeString API.
 */
LIBRARY_API char *  Jabra_GetDeviceImageThumbnailPath(unsigned short deviceID);

/** Get battery status, if supported by device.
 *  @param[in] : Id for a specific device.
 *  @param[in] : Battery level in percent (0 - 100).
 *  @param[in] : charging: Indicates if battery is being charged.
 *  @param[in] : Indicates if battery level is low.
 *  @return    : Return_Ok if get battery information is returned.
				 Device_Unknown if deviceID is wrong.
				 Not_Supported if device does not have battery information.
 Note: Since dongle does not have battery, SDK returns Not_Supported when battery status is requested for dongle device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_GetBatteryStatus(unsigned short deviceID, int *levelInPercent, bool *charging, bool *batteryLow);

/**
 * Type definition of function pointer to use for Jabra_RegisterBatteryStatusCallback.
 */
typedef void(*BatteryStatusUpdateCallback)(unsigned short deviceID, int levelInPercent, bool charging, bool batteryLow);

/**
 * Register for battery status update callback.
 * @param[in] callback callback method called when the battery status changes.
 */
LIBRARY_API void Jabra_RegisterBatteryStatusUpdateCallback(BatteryStatusUpdateCallback const callback);

/** Get the warranty end date of the device.
 *  @param[in] : deviceID: id for a device.
 *  @return    : warranty end date of the device if warranty for the device is not yet expired.
 If device is NOT in warranty, it returns a nullptr.
 Note       : As Memory is allocated through SDK for returned warranty end date, needs to be freed by calling Jabra_FreeString API.
 */
LIBRARY_API char* Jabra_GetWarrantyEndDate(unsigned short deviceID);

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
LIBRARY_API void Jabra_DisconnectFromJabraApplication(void);


/** Sets the softphone to Ready. Currently applicable for only Jabra Direct. Will be available in later versions of JMS.
 *  @param[in] : isReady: sets the softphone readiness state
 *  @return    : void.
 */
LIBRARY_API void Jabra_SetSoftphoneReady(bool isReady);

/** Indicates whether the softphone is in focus.
*   @return    : True if softphone is in focus.
                 False otherwise.
*/
LIBRARY_API bool Jabra_IsSoftphoneInFocus(void);

/** Set the bluetooth device in pairing mode.
 *  @param[in] : deviceID: id for a BT adapter
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 System_Error if there is some error during packet formation.
				 Device_WriteFail if it fails to write to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetBTPairing(unsigned short deviceID);

/** Search for available Bluetooth devices which are switched on, within range and ready to connect.
 *  @param[in] : deviceID: id for the BT adapter.
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
                 System_Error if there is some error during packet formation.
                 Device_WriteFail if it fails to write to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SearchNewDevices(unsigned short deviceID);

/** Stop search for available Bluetooth devices.
 *  @param[in] : deviceID: id for a BT adapter
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 System_Error if there is some error during packet formation.
				 Device_WriteFail if it fails to write to the device.

 */
LIBRARY_API Jabra_ReturnCode Jabra_StopBTPairing(unsigned short deviceID);

/** When Bluetooth adapter is plugged into the PC it will attempt to connect with the last connected Bluetooth device. If it cannot connect, it will automatically search for new Bluetooth devices to connect to.
 *  @param[in] : deviceID: id for a BT adapter.
 *  @param[in] : value: enable or disable for auto pairing.
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
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
                 Device_Unknown if deviceID is wrong.
                 System_Error if there is some error during packet formation.
                 Device_WriteFail if it fails to write to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_ClearPairingList(unsigned short deviceID);

/** Connect/Reconnect Bluetooth device to the Jabra Bluetooth adapter. Ensure the Bluetooth device is switched on and within range.
 *  @param[in] : deviceID: id for a BT adapter
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 System_Error if there is some error during packet formation.
				 Device_WriteFail if it fails to write to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_ConnectBTDevice(unsigned short deviceID);

/** Connect a new device.
 *  @param[in] : deviceID: Id for specific device
 *  @param[in] : device: pointer to structure Jabra_PairedDevice
 *  @return    : Return_Ok if success.
 *               Device_Unknown if deviceID is wrong.
                 System_Error if there is some error during packet formation.
                 Device_WriteFail if it fails to write to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_ConnectNewDevice(unsigned short deviceID, Jabra_PairedDevice* device);

/** Disconnect  Bluetooth device from  Bluetooth adapter.
 *  @param[in] : deviceID: id for a BT adapter
 *  @return    : Return_Ok if success.
				 Device_Unknown if deviceID is wrong.
				 System_Error if there is some error during packet formation.
				 Device_WriteFail if it fails to write to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_DisconnectBTDevice(unsigned short deviceID);

/** Get name of connected BT device with BT Adapter.
 *  @param[in] : deviceID: id for a BT adapter
 *  @return    : Name of connected BT device if successful, otherwise return NULL.
 *  Note       : As Memory is allocated through SDK, need to be freed by calling Jabra_FreeString API.
 */
LIBRARY_API char* Jabra_GetConnectedBTDeviceName(unsigned short deviceID);

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

/** Gets the list of new devices which are available to pair & connect.
 *  @param[in] : deviceID: Id for specific device.
 *  @return    : returns pointer to the structure Jabra_PairingList contains available devices ready to pair.
 *  Note       : As Memory is allocated through SDK, need to be freed by calling Jabra_FreePairingList API.
                 isConnected, flag in Jabra_PairingList, will always be false as device does not give connection status for the found device.
 */
LIBRARY_API Jabra_PairingList* Jabra_GetSearchDeviceList(unsigned short deviceID);

/** Frees the memory allocated for the list of paired devices.
 *  @param[in] : deviceList: Jabra_PairingList structure pointer, which needs to be freed.
 *  @return    : void.
 */
LIBRARY_API void Jabra_FreePairingList(Jabra_PairingList* deviceList);

/** Connect a device which was already paired.
 *  @param[in] : deviceID: Id for specific device
 *  @param[in] : device: pointer to structure Jabra_PairingList
 *  @return    : Return_Ok if success.
                 Device_Unknown if deviceID is wrong.
                 System_Error if there is some error during packet formation.
                 Device_WriteFail if it fails to write the value to the device.
 *  Note       : After device connection, Jabra_GetPairingList api has to be called to get updated connection status.
 *     			  In order to connect to a device from the list of paired devices, make sure that there is no paired device currently connected.
 *				  Any paired device currently connected has to be disconnected by calling Jabra_DisconnectPairedDevice() before using Jabra_ConnectPairedDevice.
*/
LIBRARY_API Jabra_ReturnCode Jabra_ConnectPairedDevice(unsigned short deviceID, Jabra_PairedDevice* device);

/** Disconnect a paired device.
 *  @param[in] : deviceID: Id for specific device
 *  @param[in] : device: pointer to structure Jabra_PairingList
 *  @return    : Return_Ok if success.
                 Device_Unknown if deviceID is wrong.
                 System_Error if there is some error during packet formation.
                 Device_WriteFail if it fails to write the value to the device.
 *  Note       : After device disconnection, Jabra_GetPairingList api has to be called to get updated connection status.
 */
LIBRARY_API Jabra_ReturnCode Jabra_DisConnectPairedDevice(unsigned short deviceID, Jabra_PairedDevice* device);

/** Clear a device from paired device list.
 *  @param[in] : deviceID: Id for specific device.
 *  @param[in] : device: pointer to structure Jabra_PairingList.
 *  @return    : Return_Ok if success.
                 Device_Unknown if deviceID is wrong.
                 System_Error if there is some error during packet formation.
                 Device_WriteFail if it fails to write the value to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_ClearPairedDevice(unsigned short deviceID, Jabra_PairedDevice* device);

/** Get error string from the error status.
 *  @param[in] : Status of the error from the Jabra Device
 *  @return    : Corresponding text
 */

LIBRARY_API const char* Jabra_GetErrorString(Jabra_ErrorStatus errStatus);

/** Get descritive string from the return code.
 *  @param[in] : Return code
 *  @return    : Corresponding text
 */
LIBRARY_API const char* Jabra_GetReturnCodeString(Jabra_ReturnCode code);

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

/** Is left earbud status supported.
*  @param[in] : deviceID: id for a device.
*  @return    : true left earbud status is supported.
                false if device does not support left earbud status
*/
LIBRARY_API bool Jabra_IsLeftEarbudStatusSupported(unsigned short deviceID);

/** Get left earbud connection status.
*  @param[in] : deviceID: id for a device.
*  @return    : true if eft earbud is connected.
                false if left earbud is not connected.
*/
LIBRARY_API bool Jabra_GetLeftEarbudStatus(unsigned short deviceID);

/** Registration for left earbud connection status event. Can only be called when a device is attached
*  @param[in] : deviceID: id for a device.
*  @param[in]   : LeftEarbudFunc: Callback method. Called when left earbud status event is received from device. Can be NULL if not used.
*  @return      : Return_Ok if success otherwise error code.
*/
LIBRARY_API Jabra_ReturnCode Jabra_RegisterLeftEarbudStatus(unsigned short deviceID, void(*LeftEarbudFunc)(unsigned short deviceID, bool connected));

/**
 *  Registration for HearThrough setting change event.
 *  @param[in] HearThroughSettingChangeFunc Callback method, called when HearThrough setting is changed on device. Can be NULL if not used.
 */
LIBRARY_API void Jabra_RegisterHearThroughSettingChangeHandler(void(*HearThroughSettingChangeFunc)(unsigned short deviceID, bool enabled));

/** Checks if equalizer is supported by the device.
*  @param[in] : deviceID: id for a device.
*  @return    : true if equalizer is supported.
                false if device does not support equalizer.
*/
LIBRARY_API bool Jabra_IsEqualizerSupported(unsigned short deviceID);

/** Checks if equalizer is enabled.
*  @param[in] : deviceID: id for a device.
*  @return    : true if equalizer is enabled
                false if equalizer is disabled or not supported
*/
LIBRARY_API bool Jabra_IsEqualizerEnabled(unsigned short deviceID);

/** Enable/disable equalizer.
*  @param[in] : deviceID: id for a device.
*  @param[in] : value: enable or disable busylight.
*  @return    : Return_Ok if success otherwise error code
*/
LIBRARY_API Jabra_ReturnCode Jabra_EnableEqualizer(unsigned short deviceID, bool value);

/** Get equalizer parameters
*  @param[in] : deviceID: id for a device.
*  @param[out] : bands: caller allocated array for the parameters .
*  @param[out] : nbands: Number of bands to read and the actually numbers read
*  @return    : Return_Ok if success.
                Not_Supported if equalizer is not supported
                Device_Unknown if deviceID is wrong.
                System_Error if there is some error during packet formation.
                Device_WriteFail if it fails to write the value to the device.
*/
LIBRARY_API Jabra_ReturnCode Jabra_GetEqualizerParameters(unsigned short deviceID, Jabra_EqualizerBand * bands, unsigned int * nbands);

/** Set equalizer parameters
*  @param[in] : deviceID: id for a device.
*  @param[in] : bands: caller-owned array containing the band gains to set in dB (must be within range of +/- Jabra_EqualizerBand.max_gain)
*  @param[in] : nbands: Number of bands to set.
*  @return    : Return_Ok if success.
                Not_Supported if equalizer is not supported
                Device_Unknown if deviceID is wrong.
                System_Error if there is some error during packet formation.
                Device_WriteFail if it fails to write the value to the device.
                Return_ParameterFail if setting parameter is wrong.
*/
LIBRARY_API Jabra_ReturnCode Jabra_SetEqualizerParameters(unsigned short deviceID, float * bands, unsigned int nbands);

/**
 * @deprecated This API has been deprecated, use Jabra_IsFeatureSupported with parameter DeviceFeature::RemoteMMI instead.
 * Checks if remote MMI feature is supported by the device.
 * @param[in] deviceID: id for a device.
 * @return true if remote MMI feature is supported, false if device does not support remote MMI feature.
 */
LIBRARY_API bool Jabra_IsRemoteMMISupported(unsigned short deviceID);

/** Configures the remote MMI events for a device.
*  @param[in] : deviceID : id for a specific device.
*  @param[in] : buttonEvent : button events to be set in device.
*  @return    : Return_Ok if success.
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
				Return_ParameterFail if setting parameter is wrong.
				System_Error if there is some error during packet formation.
				Device_WriteFail if it fails to write the value to the device.
*/
LIBRARY_API Jabra_ReturnCode Jabra_ReleaseButtonFocus(unsigned short deviceID, ButtonEvent *buttonEvent);

/** Gets the supported remote MMI for a device
*  @param[in] : deviceID: Id for specific device
*  @return    : pointer to the structure ButtonEvent containing all button events for that device. In case of error a NULL pointer is returned.
*/
LIBRARY_API ButtonEvent* Jabra_GetSupportedButtonEvents(unsigned short deviceID);

/** Free the memory allocated for the button events.
*  @param[in] : Pointer to the structure ButtonEvent which needs to be freed.
*  @return    : void.
*/
LIBRARY_API void Jabra_FreeButtonEvents(ButtonEvent *eventsSupported);

/** Registration for GNP button events i.e remote MMI.
*  @param[in]   : ButtonGNPEventFunc: Callback method to recieve GNP Button events/Remote MMI events. Can be NULL if not used.
*  @return      : NA
*/
LIBRARY_API void Jabra_RegisterForGNPButtonEvent(
	void(*ButtonGNPEventFunc)(unsigned short deviceID, ButtonEvent *buttonEvent));

/**
 * Checks if firmware lock is enabled. If the firmware lock is enabled it is
 * not possible to upgrade nor downgrade the firmware. In this situation the
 * firmware can only be changed to the same version e.g. if you want to
 * change the language.
 * @param[in] deviceID id for a device.
 * @return true if firmware lock is enabled otherwise false.
 */
LIBRARY_API bool Jabra_IsFirmwareLockEnabled(unsigned short deviceID);

/** Checks if setting protection is enabled.
*  @param[in] : deviceID: id for a device.
*  @return    : true if setting protection is enabled otherwise false.
*/
LIBRARY_API bool Jabra_IsSettingProtectionEnabled(unsigned short deviceID);


/** Get the NPS URL for the application only.
 *  @param[in] : appName : Name of the app
 *  @param[in]: appVersion : Version of the app
 *  @return    : NPS URL or null pointer if it is not available
 *  Note       : As Memory is allocated through SDK for NPS Url, it needs to be freed by calling Jabra_FreeString API.
 */
LIBRARY_API char * Jabra_GetNpsUrlForApplication(const char * appName, const char * appVersion);

/** Get the NPS URL.
*  @param[in] : deviceID: id for a device.
 *  @param[in] : appName : Name of the app
 *  @param[in]: appVersion : Version of the app
 *  @return    : NPS URL or null pointer if it is not available
 *  Note       : As Memory is allocated through SDK for NPS Url, it needs to be freed by calling Jabra_FreeString API.
 */
LIBRARY_API char * Jabra_GetNpsUrl(unsigned short deviceID, const char * appName, const char * appVersion);

/** Register a product
 *  @param[in] : deviceID : id of device from which settings needs to be updated
 *  @param[in] : prodReg : Product registration information.
 *  @return    : Return_Ok if registration was successful
 *               Device_Unknown if deviceID is wrong
 *               NetworkRequest_Fail if there is network issue
 *               Return_ParameterFail if setting parameter is wrong.
 */
LIBRARY_API Jabra_ReturnCode Jabra_ProductRegistration(unsigned short deviceID, const ProductRegInfo* prodReg);

/** Tells the device to execute a AVRCP command.
 *  @param[in] : deviceID: id for a specific device.
 *  @param[in] : command: the command to execute.
 *  @return    : Return_Ok if setting is successful.
 Device_Unknown if deviceID is wrong.
 Device_WriteFail if it fails to write to the device.
 */
LIBRARY_API Jabra_ReturnCode Jabra_ExecuteAVRCPCommand(unsigned short deviceID, AVRCPCommand command);

/** To configure logging of device events.
 *  @param[in] : logFlag : Specifies the location of logs saved. Local - Logs are saved only on local machine. Cloud - Logs are saved in cloud, All - Logs are saved in both local and cloud.
 *  @praram[in] : flag : Enable or disable logging for the specified location.
 *  @return    : void
 */
LIBRARY_API void Jabra_ConfigureLogging(Jabra_Logging logFlag, bool flag);

/** @deprecated This API has been deprecated, use Jabra_RegisterDevLogCallback instead
 * to register callback for Logging
 *  @param[in] : LogDeviceEvent : call back method, will be called when events recieved from device
 *              eventStr: Its a Json message for the event to be logged of below format...
                {
                    "AppID" : "",
                    "Device Name" : "",
                    "ESN" : "",
                    "EventName" : "",
                    "FW" : "",
                    "LocalTimeStamp" : "",
                    "Pid" : ,
                    "Seq.No" : ,
                    "Value" : "",
                    "Variant" : ""
                }
 *  @return    : void
 *  Note       : As Memory is allocated through SDK for eventStr, needs to be freed by calling Jabra_FreeString API.
 */
LIBRARY_API void Jabra_RegisterLoggingCallback(void(*LogDeviceEvent)(char* eventStr));

/** to register callback for Logging
 *  @param[in] : deviceId : Device id
 *  @param[in] : LogDeviceEvent : call back method, will be called when events recieved from device
 *              eventStr: Its a Json message for the event to be logged of below format...
                {
                    "AppID" : "",
                    "Device Name" : "",
                    "ESN" : "",
                    "EventName" : "",
                    "FW" : "",
                    "LocalTimeStamp" : "",
                    "Pid" : ,
                    "Seq.No" : ,
                    "Value" : "",
                    "Variant" : ""
                }
 *  @return    : void
 *  Note       : As Memory is allocated through SDK for eventStr, needs to be freed by calling Jabra_FreeString API.
 */
LIBRARY_API void Jabra_RegisterDevLogCallback(void(*LogDeviceEvent)(unsigned short deviceID, char* eventStr));

/** Enable/disable logging for a device
 *  @param[in] : deviceId : Device id
 *  @param[in] : enable : True enable logging in device otherwise disable
 *              eventStr: Its a Json message for the event to be logged of below format...
                {
                    "AppID" : "",
                    "Device Name" : "",
                    "ESN" : "",
                    "EventName" : "",
                    "FW" : "",
                    "LocalTimeStamp" : "",
                    "Pid" : ,
                    "Seq.No" : ,
                    "Value" : "",
                    "Variant" : ""
                }
 *  @return    : Return_Ok: Successfully updated firmware.
 *               or error code
 */
LIBRARY_API Jabra_ReturnCode Jabra_EnableDevLog(unsigned short deviceID, bool enable);

/** Is logging enabled on device.
 *  @param[in] : deviceID: id for a device.
 *  @return    : true if logging is enabled otherwise false
 */
LIBRARY_API bool Jabra_IsDevLogEnabled(unsigned short deviceID);

/** Check if Firmware update available for device
 *  @param[in]   : deviceID: Id for specific device.
 *  @param[in]   : authorizationId: Authorization Id.
 *  @return      : Device_Unknown: If unable to get the device mutex.
 *                 Device_Invalid: If deviceID is wrong.
 *                 Firmware_UpToDate: If device has latest firmware version.
 *                 Firmware_Available: If new firmware version is available for the device.
 *                 No_Information: If firmware file is not available.
 *                 NetworkRequest_Fail: If request to the server fails.
 *                 Invalid_Authorization: If authorization is invalid.
 *
 */
LIBRARY_API Jabra_ReturnCode Jabra_CheckForFirmwareUpdate(unsigned short deviceID, const char* authorizationId);

/** Gets details of the latest firmware present in cloud
 *  @param[in]   : deviceID: Id for specific device
 *  @param[in]   : authorizationId: Authorization Id.
 *  @return      : Jabra_FirmwareInfo: structure pointer for details of the latest firmware.
 *  Note         : As Memory is allocated through SDK, memory needs to be freed by calling Jabra_FreeFirmwareInfo API.
 */
LIBRARY_API Jabra_FirmwareInfo* Jabra_GetLatestFirmwareInformation(unsigned short deviceID, const char* authorizationId);

/** Frees the firmware information structure members.
*  @param[in] : Jabra_FirmwareInfo structure to be freed.
*  @return    : void.
*/
LIBRARY_API void Jabra_FreeFirmwareInfo(Jabra_FirmwareInfo* firmwareInfo);

/** Get the file path of the downloaded file
 *  @param[in]   : deviceID: Id for specific device
 *  @param[in]   : version: Version for which the path is required.
 *  @return      : firmwareFilePath: firmware file path of the device.
 *  Note		 : Call Jabra_DownloadFirmware first to ensure that data is current
 *  Note         : As Memory is allocated through SDK for firmwareFilePath, memory needs to be freed by calling Jabra_FreeString API.
 */
LIBRARY_API char* Jabra_GetFirmwareFilePath(unsigned short deviceID, const char* version);

/**
 * Gets information of all the firmware present in cloud for the specific device.
 * @param[in] deviceID Id for the specific device.
 * @param[in] authorizationId authorization Id.
 * @return a list of information about all firmware versions. If no information
 * is available NULL is returned.
 * @note the list must be freed by calling Jabra_FreeFirmwareInfoList API.
 */
LIBRARY_API Jabra_FirmwareInfoList* Jabra_GetAllFirmwareInformation(unsigned short deviceID, const char* authorizationId);

/**
 * Frees the list of firmware information structure.
 * @param[in] firmwareInfolist Jabra_FirmwareInfoList structure to be freed.
 */
LIBRARY_API void Jabra_FreeFirmwareInfoList(Jabra_FirmwareInfoList* firmwareInfolist);

/** Downloads the specified firmware version file
 *  @param[in]   : deviceID: Id for specific device
 *  @param[in]   : version: Version for which file download needs to be initiated.
 *  @param[in]   : authorizationId: Authorization Id.
 *  @return      : Device_Unknown: If unable to get the device mutex.
 *                 Device_Invalid: If deviceID is wrong.
                   Return_ParameterFail: If firmware version is invalid.
                   Return_Async: If firmware download is in progress and will be returned asynchronously using the callback
 */
LIBRARY_API Jabra_ReturnCode Jabra_DownloadFirmware(unsigned short deviceID, const char* version, const char* authorizationId);

/** Downloads the latest FW updater relevant for this device
 *  @param[in]   : deviceID: Id for specific device
 *  @param[in]   : authorizationId: Authorization Id.
 *  @return      : Device_Unknown: If unable to get the device mutex.
 *                 Device_Invalid: If deviceID is wrong.
                   Return_ParameterFail: If firmware version is invalid.
                   Return_Async: If firmware download is in progress and will be returned asyncronously using the callback
 */
LIBRARY_API Jabra_ReturnCode Jabra_DownloadFirmwareUpdater(unsigned short deviceID, const char* authorizationId);

/** Upgrades/Updates the firmware for the target device with specified version
 *  @param[in]   : deviceID: Id for specific device
 *  @param[in]   : filepath: firmware file path.
 *  @return      : Return_Ok: Successfully updated firmware.
 *                 Device_Unknown: If unable to get the device mutex.
 *                 Device_Invalid: If deviceID is wrong.
 *                 File_Not_Accessible: If firmware file path is incorrect.
 *                 FWU_Application_Not_Available: If firmware updater folder/application is not found.
 *                 Return_ParameterFail: If file is incorrect.
 *                 Return_Async: Firmware update is in progress. Use FWU progress callback to determine when update is done.
 *
 */
LIBRARY_API Jabra_ReturnCode Jabra_UpdateFirmware(unsigned short deviceID, const char* filepath);

/** Cancels the firmware download.
*  @param[in]   : deviceID: Id for specific device.
*  @return      : Device_Unknown: If unable to get the device mutex.
*                 Device_Invalid: If deviceID is wrong.
*                 Return_Ok:  Cancels firmware download.
*/
LIBRARY_API Jabra_ReturnCode Jabra_CancelFirmwareDownload(unsigned short deviceID);

/**
 * Type definition of function pointer to use for Jabra_RegisterFirmwareProgressCallBack.
 */
typedef void(*FirmwareProgress)(unsigned short deviceID, Jabra_FirmwareEventType type, Jabra_FirmwareEventStatus status, unsigned short percentage);

/** Registration for firmware progress event.
*  @param[in]   : callback: Callback method. Called when firmwareProgress event is received from device. Can be NULL if not used.
*  @return      : void.
*/
LIBRARY_API void Jabra_RegisterFirmwareProgressCallBack(FirmwareProgress const callback);

/**
 Recreates the session, Input and Output streams for all devices which are connected to the phone and not to the app
 */
LIBRARY_API void Jabra_Reconnect(void);

/** Get the detailed error response for the last firmware update action performed(Check for firmware update/ Get the firmware info list/ download firmware).
*  @param[in]   : deviceID: ID for the specific device.
*  @return      : Jabra_FirmwareErrorInfo: structure pointer for the detailed error info.
*  Note         : As Memory is allocated through SDK, memory needs to be freed by calling Jabra_FreeFirmwareErrorInfo API.
*/
LIBRARY_API Jabra_FirmwareErrorInfo* Jabra_GetLastFirmwareUpdateErrorInfo(unsigned short deviceID);

/** Frees the firmware error information structure members.
*  @param[in] : Jabra_FirmwareErrorInfo structure to be freed.
*/
LIBRARY_API void Jabra_FreeFirmwareErrorInfo(Jabra_FirmwareErrorInfo* firmwareErrorInfo);


/** Check if a feature is supported by a device
 *  @param[in]   : deviceID: ID for the specific device.
 *  @param[in]  : feature: the feature to check
 *  @return 	: .
 */
LIBRARY_API bool Jabra_IsFeatureSupported(unsigned short deviceID, DeviceFeature feature);

/** Get array of features supported by a device
 *  @param[in]   : deviceID: ID for the specific device.
 *  @param[out]  : number of items in result
 *  @return 	: array of supported features. may be null. Shall be deleted by calling Jabra_FreeSupportedFeatures().
 *
 */
LIBRARY_API const DeviceFeature* Jabra_GetSupportedFeatures(unsigned short deviceID, unsigned int* count);

/**
 * Free a list of features obtained by calling Jabra_GetSupportedFeatures
 * @param[in] : features : list to delete.
 */
LIBRARY_API void Jabra_FreeSupportedFeatures(const DeviceFeature* features);

/**
 * Request that the headset does not play its 'end of call' tone when the SCO closes next time.
 * Precondition : SCO is open.
 * No checks - best effort.
 *  @param[in]   : deviceID: ID for the specific device.
 *  @return      : Device_Unknown: If unable to get the device mutex or If deviceID is wrong.
 *                 Return_Ok: Sent the cmd
 *                 Device_WriteFail: unable to send cmd to device
 */
LIBRARY_API Jabra_ReturnCode Jabra_RequestNoHangupToneNextTime(unsigned short deviceID);

/** Indicates whether the device is certified for Skype for Business.
*  @param[in] : deviceID: id for a device.
*  @return    : true if device is certified for Skype for Business.
false if device is not certified for Skype for Business.
*/
LIBRARY_API bool Jabra_IsCertifiedForSkypeForBusiness(unsigned short deviceID);

/**
 * Free a char array.
 * @param[in] : arrPrt : array to delete.
 */
LIBRARY_API void Jabra_FreeCharArray(const char** arrPtr);

/** Checks if ringtone upload is supported by the device.
 *  @param[in] : deviceID: id for a device.
 *  @return    : true if upload ringtone is supported otherwise false
 */
LIBRARY_API bool Jabra_IsUploadRingtoneSupported(unsigned short deviceID);

/** Upload ringtone to device. For Mac and Linux only (for Windows use Jabra_UploadWavRingtone).
 *  @param[in] : deviceID : id for a specific device
 *  @param[in] : Audio file name to be uploaded
 *               The format supported is wav 16kHz in uncompressed format
 *  @return    : Return_Ok
 *               Device_Unknown if deviceID is wrong
 *               Return_ParameterFail audio file has wrong type
 *               FileWrite_Fail if accessing the file fails
 *               Upload_AlreadyInProress if upload is ongoing
 */
LIBRARY_API Jabra_ReturnCode Jabra_UploadRingtone(unsigned short deviceID, const char* fileName);

/**
 * Type definition of function pointer to use for Jabra_RegisterUploadProgress.
 */
typedef void(*UploadProgress)(unsigned short deviceID, Jabra_UploadEventStatus status, unsigned short percentage);

/**
 * Registration for ringtone upload progress event.
 * @param[in] callback callback method, called during upload.
 */
LIBRARY_API void Jabra_RegisterUploadProgress(UploadProgress const callback);

/**
 * Checks if image upload is supported by the device.
 * @param[in] deviceID id for a device.
 * @return true if image upload image supported otherwise false.
 */
LIBRARY_API bool Jabra_IsUploadImageSupported(unsigned short deviceID);

/**
 * Upload image to device.
 * @param[in] deviceID id for a specific device.
 * @param[in] fileName name of image file to be uploaded.
 * @return Return_Ok if images is uploaded successfully.
 *         Device_Unknown if deviceID is wrong.
 *         Return_ParameterFail if file has wrong type.
 *         FileWrite_Fail if accessing the file fails.
 */
LIBRARY_API Jabra_ReturnCode Jabra_UploadImage(unsigned short deviceID, const char* fileName);

/**
 * Checks if date and time synchronization is supported by the device.
 * @param[in] deviceID id for a device.
 * @return true if date and time synchronization is supported otherwise false.
 */
LIBRARY_API bool Jabra_IsSetDateTimeSupported(unsigned short deviceID);

/**
 * @param[in] deviceID id of the device to operate on.
 * @param[in] dateTime date and time to set. If this parameter is set to NULL
 *            the date and time is set to the current time of the platform.
 * @return Return_Ok if time and date is set successfully.
 *         Device_Unknown if the device is not known.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetDateTime(unsigned short deviceID, const timedate_t* const dateTime);


/**
 * Request info on supported device events.
 * @param[in] deviceID id for a specific device.
 * @return event mask (0 if nothing supported, or on any error)
 */
LIBRARY_API uint32_t Jabra_GetSupportedDeviceEvents(unsigned short deviceID);

/**
 * Set device events to subscribe to. Event callbacks are received through the event listener mechanism for each platform.
 * @param[in] deviceID id for a specific device.
 * @param eventMask : The bitmask representing supported device events (one of DEVICE_EVENTS_* )  0 = none
 * @return  Return_Ok if successful
 *          Not_Supported if feature is not supported
 *          Device_Unknown if device not known
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetSubscribedDeviceEvents(unsigned short deviceID, uint32_t eventMask);

/** Get details of audio file for uploading to device
*  @param[in] : deviceID: ID for the specific device.
*  @return 	  : Jabra_AudioFileParams: structure for details of audio file.
*
*/
LIBRARY_API Jabra_AudioFileParams Jabra_GetAudioFileParametersForUpload(unsigned short deviceID);

/** Upload ringtone to device in .wav format.
*  @param[in] : deviceID : id for a specific device
*  @param[in] : Audio file name to be uploaded
*               The format supported can be obtained from Jabra_GetAudioFileParametersForUpload
*  @return    : Return_Ok
*               Device_Unknown if deviceID is wrong
*               Return_ParameterFail audio file has wrong type
*               Upload_AlreadyInProress if upload is ongoing
*/
LIBRARY_API Jabra_ReturnCode Jabra_UploadWavRingtone(unsigned short deviceID, const char* fileName);

/**
 * Gets a list of supported remote MMIs.
 * @param[in] deviceID ID for the specific device.
 * @param[in,out] types pointer to allocated memory area containing @arg count of structures of
 * RemoteMmiDefinition. The memory area must be deallocated/freed by calling Jabra_FreeRemoteMmiTypes().
 * @param[out] count number of items passed via @arg types.
 * @return Return_Ok list and count is valid.
 *         Return_ParameterFail in case of an incorrect parameter.
 *         Not_Supported the device does not support remote MMIv2.
 *         Device_Unknown the deviceID specified is not known.
 * @note RemoteMMIv2 only.
 */
LIBRARY_API Jabra_ReturnCode Jabra_GetRemoteMmiTypes(unsigned short deviceID, RemoteMmiDefinition** const types, int* count);

/**
 * Frees/deallocates the memory area allocated by Jabra_GetRemoteMmiTypes().
 * @param[in] types pointer to memory area to free/deallocate.
 * @note RemoteMMIv2 only.
 */
LIBRARY_API void Jabra_FreeRemoteMmiTypes(RemoteMmiDefinition* types);

/**
 * Gets the status of the remote MMI focus.
 * @param[in] deviceID ID for the specific device.
 * @param[in] type type of remote MMI to get focus status of.
 * @param[out] isInFocus true if in focus, false if not.
 * @return Return_Ok if status has been gotten successfully.
 *         Return_ParameterFail in case of an incorrect parameter.
 *         Not_Supported the device does not support remote MMI.
 *         Device_Unknown the deviceID specified is not known.
 * @note RemoteMMIv2 only.
 */
LIBRARY_API Jabra_ReturnCode Jabra_IsRemoteMmiInFocus(unsigned short deviceID, RemoteMmiType type, bool* isInFocus);

/**
 * Gets the focus of the remote MMI specified. Once a remote MMI has focus,
 * the normal functionality of the MMI (button/LED) is suppressed until
 * Jabra_ReleaseRemoteMmiFocus is called. If only the LED output MMI
 * functionality is required, action can be specified as MMI_ACTION_NONE.
 * @param[in] deviceID ID for the specific device.
 * @param[in] type type of remote MMI to get focus of.
 * @param[in] action action to get focus of, acts as a filter/mask for the
 * actions on the RemoteMmiCallback callback.
 * @param[in] priority priority of focus.
 * @return Return_Ok focus has been gotten successfully.
 *         Not_Supported the device does not support remote MMI.
 *         Device_Unknown the deviceID specified is not known.
 *         Device_WriteFail if it fails to write to the device.
 * @note RemoteMMIv2 only.
 */
LIBRARY_API Jabra_ReturnCode Jabra_GetRemoteMmiFocus(unsigned short deviceID, RemoteMmiType type, RemoteMmiInput action, RemoteMmiPriority priority);

/**
 * Releases the focus of the remote MMI specified. Note that focus on all
 * actions are removed.
 * @param[in] deviceID ID for the specific device.
 * @param[in] type of remote MMI to release focus of.
 * @return Return_Ok focus has been release successfully.
 *         Not_Supported the device does not support remote MMI.
 *         Device_Unknown the deviceID specified is not known.
 *         Device_WriteFail if it fails to write to the device.
 * @note RemoteMMIv2 only.
 */
LIBRARY_API Jabra_ReturnCode Jabra_ReleaseRemoteMmiFocus(unsigned short deviceID, RemoteMmiType type);

/**
 * Sets an output action on the remote MMI. Note that Jabra_GetRemoteMmiFocus
 * must be called once for the RemoteMmiType in question prior to setting the
 * output action, else Return_ParameterFail is returned.
 * @param[in] deviceID ID for the specific device.
 * @param[in] type of remote MMI to set action of.
 * @param[in] outputAction output LED action to set.
 * @return Return_Ok action has been set successfully.
 *         Not_Supported the device does not support remote MMI.
 *         Device_Unknown the deviceID specified is not known.
 *         Device_WriteFail if it fails to write to the device e.g. if
 *           Jabra_GetRemoteMmiFocus has not called prior to calling
 *           Jabra_SetRemoteMmiAction.
 *         Return_ParameterFail if an incorrect/unsupported parameter has been
 *         passed or Jabra_GetRemoteMmiFocus has not been called for the
 *         RemoteMmiType in question.
 * @note RemoteMMIv2 only.
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetRemoteMmiAction(unsigned short deviceID, RemoteMmiType type, RemoteMmiActionOutput outputAction);

/**
 * Type definition of function pointer to use for Jabra_RegisterRemoteMmiCallBack.
 * @note RemoteMMIv2 only.
 */
typedef void(*RemoteMmiCallback)(unsigned short deviceID, RemoteMmiType type, RemoteMmiInput action);

/**
 * Register for remote MMI event callback.
 * @param[in] callback RemoteMmiCallback callback method, called when a remote
 * MMI input event is generated.
 * @note RemoteMMIv2 only.
 */
LIBRARY_API void Jabra_RegisterRemoteMmiCallback(RemoteMmiCallback const callback);

/**
 * Get the panic list.
 * @param[in]   : deviceID: Id for a specific device.
 * @return      : Pointer to panic list or null pointer if not available.
 */
LIBRARY_API Jabra_PanicListType *  Jabra_GetPanics(unsigned short deviceID);

/** Frees the Jabra_PanicListType structure.
 *  @param[in] : Jabra_PanicListType structure to be freed.
 *  @return    : void.
 */
LIBRARY_API void Jabra_FreePanicListType(Jabra_PanicListType *panicList);

/**
 * Sets a static timestamp in the device. Can be used for later referencing using Jabra_GetTime.
 * @param[in] : deviceID: Id for a specific device.
 * @param[in] : newTime: Timestamp to be set. Unix epoch.
 * @return    : Return_Ok if successful
 *              Not_Supported if feature is not supported
 *              Device_Unknown if device not known
 */
LIBRARY_API Jabra_ReturnCode Jabra_SetTimestamp(unsigned short deviceID, const uint32_t newTime);

/**
 * Gets the static timestamp in the device.
 * @param[in]  : deviceID: Id for a specific device.
 * @param[out] : result: Timestamp from device. Unix epoch.
 * @return     : Return_Ok if successful
 *               Not_Supported if feature is not supported
 *               Device_Unknown if device not known
 */
LIBRARY_API Jabra_ReturnCode Jabra_GetTimestamp(unsigned short deviceID, uint32_t* const result);

/**
 * Preloads the configuration cache with the content of the specified archive.
 * To get the full benefit, this should happen before calling Jabra_Initialize(), as that enables device connections and may initiate background updates of device data.
 * No existing data will be overwritten.
 *
 * Deprecated - please use the DeviceCatalogue_params for Jabra_Initialize
 *
 * @param[in]   zipFileName: Full path name of the ZIP archive to preload from
 * @return      True if preloading succeeds, false otherwise
 */
LIBRARY_API bool Jabra_PreloadDeviceInfo(const char* zipFileName);

/** Play Ringtone in Device
*  @param[in] : deviceID of the intended device
*  @param[in] : volume Level to Play
*  @param[in] : ringtone Type to Play
*  @return Return_Ok if success.
*          Device_Unknown if deviceID is wrong
*          Not_Supported if device is not supporting or input parameters is wrong.
*/
LIBRARY_API Jabra_ReturnCode Jabra_PlayRingtone(unsigned short deviceID, const uint8_t level, const uint8_t type);
#endif /* COMMON_H */
