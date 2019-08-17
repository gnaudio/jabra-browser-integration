export const SET_INSTALLED = "SET_INSTALLED";
export const SET_INITIALIZED = "SET_INITIALIZED";
export const SET_ACTIVE_DEVICE = "SET_ACTIVE_DEVICE";
export const REMOVE_ACTIVE_DEVICE = "REMOVE_ACTIVE_DEVICE";
export const SET_CALL_STATE = "SET_CALL_STATE";

export const setInstalled = () => ({
  type: SET_INSTALLED
});

export const setInitialized = () => ({
  type: SET_INITIALIZED
});

export const setActiveDevice = device => ({
  type: SET_ACTIVE_DEVICE,
  payload: device
});

export const removeActiveDevice = () => ({
  type: REMOVE_ACTIVE_DEVICE
});

export const setCallState = callState => ({
  type: SET_CALL_STATE,
  payload: callState
});

const initialState = {
  installed: false,
  initialized: false,
  callState: "none",
  activeDevice: null
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_INSTALLED:
      return { ...state, installed: true };

    case SET_INITIALIZED:
      return { ...state, initialized: true };

    case SET_ACTIVE_DEVICE:
      return { ...state, activeDevice: action.payload };

    case REMOVE_ACTIVE_DEVICE:
      return { ...state, activeDevice: null };

    case SET_CALL_STATE:
      return { ...state, callState: action.payload };

    default:
      return state;
  }
}
