import { applyFlexMiddleware, FlexReducer } from "@twilio/flex-ui";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";

import { jabraReducer } from "./reducer";

export * from "./actions";

export const store = createStore(
  combineReducers({
    jabra: jabraReducer,
    flex: FlexReducer
  }),
  compose(
    applyMiddleware(thunk),
    applyFlexMiddleware()
  )
);
