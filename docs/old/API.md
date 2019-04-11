### The API (v 1.2 and earlier only)

NB: The API documented here has been changed in v2.0 release. See [here](../../README.md) for details.

The JavaScript library must be initialized using this function: 
```javascript
jabra.init(onSuccess, onFailure, onNotify) 
```
Example use of the library:

https://gnaudio.github.io/jabra-browser-integration/release/development/

Basic functions: 

|           | Description        | 
| ----------------- |------------------| 
| ` jabra.ring() `    | Activate ringer (if supported) on the Jabra Device  | 
| ` jabra.offHook() `    | Change state to in-a-call   | 
| ` jabra.onHook() `    | Change state to idle (not-in-a-call)  | 
| ` jabra.mute() `    | Mutes the microphone (if supported)   | 
| ` jabra.unmute() `    | Unmutes the microphone (if supported)   | 
| ` jabra.hold() `    | Change state to held (if supported)   | 
| ` jabra.resume() `    | Change state from held to OffHook (if supported)   |

Callback values from the library (registered during library initialization):

|           | Description        | 
| ----------------- |------------------| 
| ` jabra.requestEnum.mute `    | Request that the device state should be changed to muted. This must be acknowledged by a Mute command to mute the call.  | 
| ` jabra.requestEnum.unmute `    | Request that the device state should be changed to unmuted. This must be acknowledged by an Unmute command to unmute the call.    | 
| ` jabra.requestEnum.endCall `    | End an active call request. This must be acknowledged by an OnHook command   | 
| ` jabra.requestEnum.acceptCall `    | Accept an incoming call request. This must be acknowledged by an OnHook command.    | 
| ` jabra.requestEnum.rejectCall `    | Reject an incoming call request. This must be acknowledged by an OnHook command to reject the call.   | 
| ` jabra.requestEnum.flash `    | Flash request. This must be acknowledged by a hold or resume command.    |

Device management functions:

|           | Description        | 
| ----------------- |------------------| 
| ` jabra.getActiveDevice() `    | Get the current active Jabra Device   | 
| ` jabra.getDevices() `    | List all attached Jabra Devices   | 
| ` jabra.setActiveDevice(id) `    | Select a new active device  | 

Device management callbacks: 

|           | Description        | 
| ----------------- |------------------| 
| ` jabra.requestEnum.deviceAttached `    | A device has been added   | 
| ` jabra.requestEnum.deviceDetached `    | A device has been removed    | 

### Sequence diagrams
These sequence diagrams shows typical use.

![Sequence diagram](/docs/outgoing-call-then-end-call.png)

![Sequence diagram](/docs/incoming-call-then-accept-on-device-then-end-call.png)

![Sequence diagram](/docs/incoming-call-then-user-rejects.png)

![Sequence diagram](/docs/mute-unmute-from-device.png)

![Sequence diagram](/docs/hold-resume-from-device.png)
