import {
  SET_INITIALIZED_STATE,
  SET_INSTALLED_STATE,
  SET_ACTIVE_DEVICE,
  SET_MMI_FOCUS,
  REMOVE_ACTIVE_DEVICE,
  SET_CALL_NOISE,
  SET_CALL_STATE
} from "./actions";

const initialState = {
  initialized: false,
  installed: false,
  active_device: null,
  mmi_focused: false,
  call_state: "none",
  call_noise: 0
};

export function jabraReducer(state, action) {
  if (state === undefined) return initialState;

  switch (action.type) {
    case SET_INITIALIZED_STATE:
      return { ...state, initialized: action.payload };

    case SET_INSTALLED_STATE:
      return { ...state, installed: action.payload };

    case SET_ACTIVE_DEVICE:
      return { ...state, active_device: action.payload };

    case REMOVE_ACTIVE_DEVICE:
      return { ...state, active_device: action.payload };

    case SET_MMI_FOCUS:
      return { ...state, mmi_focused: action.payload };

    case SET_CALL_STATE:
      return { ...state, call_state: action.payload };

    case SET_CALL_NOISE:
      return { ...state, call_noise: action.payload };

    default:
      return state;
  }
}
