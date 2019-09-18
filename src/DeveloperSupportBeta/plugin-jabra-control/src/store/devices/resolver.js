import {
  LOAD_DEVICES,
  SET_ACTIVE_DEVICE,
  REMOVE_ACTIVE_DEVICE
} from "./actions";

const initialState = {
  items: [],
  active: null
};

export function devices(state = initialState, action) {
  switch (action.type) {
    case LOAD_DEVICES:
      if (action.status === "success")
        return {
          ...state,
          items: action.payload
        };
      break;

    case SET_ACTIVE_DEVICE:
      if (action.status === "success")
        return {
          ...state,
          active: action.payload
        };
      break;

    case REMOVE_ACTIVE_DEVICE:
      return {
        ...state,
        active: null
      };

    default:
      return state;
  }
}
