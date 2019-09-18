import * as jabra from "jabra-browser-integration";

import { loadDevices } from "../devices/actions";

export const INITIALIZE_REQUEST = "INITIALIZE_REQUEST";
export const INITIALIZE_FAILURE = "INITIALIZE_FAILURE";
export const INITIALIZE_SUCCESS = "INITIALIZE_SUCCESS";

export const initialize = () => async dispatch => {
  dispatch({ type: INITIALIZE_REQUEST });

  try {
    await jabra.init();
    await dispatch(loadDevices());

    dispatch({ type: INITIALIZE_SUCCESS });
  } catch (error) {
    dispatch({ type: INITIALIZE_FAILURE, payload: error });
  }
};
