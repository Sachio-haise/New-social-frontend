import { combineReducers, applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { adminReducer } from "./admin/reducer";
import { authReducer } from "./auth/actions";
import { postReducer } from "./post/reducer";
import { transferData } from "./transfer/reducer";

const root = combineReducers({
  auth: authReducer,
  post: postReducer,
  transfer: transferData,
  admin: adminReducer,
});

export const store = createStore(
  root,
  composeWithDevTools(applyMiddleware(thunk))
);
