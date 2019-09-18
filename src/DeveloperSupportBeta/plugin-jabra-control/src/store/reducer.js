import { combineReducers } from "redux";

import { call } from "./call/resolver";
import { devices } from "./devices/resolver";
import { sdk } from "./sdk/resolver";

export const jabraReducer = combineReducers({
  sdk,
  call,
  devices
});
