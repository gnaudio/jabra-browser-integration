import {
  INITIALIZE_REQUEST,
  INITIALIZE_SUCCESS,
  INITIALIZE_FAILURE
} from "./actions";

const initialState = {
  isInitialized: false,
  isInitializing: false
};

export function sdk(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_REQUEST:
      return {
        ...state,
        isInitializing: true
      };

    case INITIALIZE_SUCCESS:
      return {
        ...state,
        isInitialized: true,
        isInitializing: false
      };

    case INITIALIZE_FAILURE:
      return {
        ...state,
        isInitializing: false,
        initializationError: action.payload
      };

    default:
      return state;
  }
}
