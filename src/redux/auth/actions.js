import { GET_AUTH, LOGOUT } from "./types";
const initialState = {
  loading: false,
  auth: [],
  error: "",
};
export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AUTH:
      return {
        loading: false,
        auth: action.payload,
        error: "",
      };
    case LOGOUT:
      localStorage.clear();
      return {
        loading: false,
        auth: [],
        error: "",
      };
    default:
      return state;
  }
};
