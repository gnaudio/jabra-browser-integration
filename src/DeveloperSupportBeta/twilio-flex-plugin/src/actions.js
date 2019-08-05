export const SET_INITIALIZED_STATE = "SET_INITIALIZED_STATE";
export const SET_INSTALLED_STATE = "SET_INSTALLED_STATE";
export const SET_ACTIVE_DEVICE = "SET_ACTIVE_DEVICE";
export const SET_MMI_FOCUS = "SET_MMI_FOCUS";
export const REMOVE_ACTIVE_DEVICE = "SET_ACTIVE_DEVICE";
export const SET_CALL_NOISE = "SET_CALL_NOISE";
export const SET_CALL_STATE = "SET_CALL_STATE";

export const setInitializedState = state => ({
  type: SET_INITIALIZED_STATE,
  payload: state
});

export const setInstalledState = state => ({
  type: SET_INSTALLED_STATE,
  payload: state
});

export const setActiveDevice = device => ({
  type: SET_ACTIVE_DEVICE,
  payload: device
});

export const removeActiveDevice = () => ({
  type: REMOVE_ACTIVE_DEVICE,
  payload: null
});

export const setMMIFocus = state => ({
  type: SET_MMI_FOCUS,
  payload: state
});

export const setCallState = state => ({
  type: SET_CALL_STATE,
  payload: state
});

export const setCallNoise = noise => ({
  type: SET_CALL_NOISE,
  payload: noise
});
