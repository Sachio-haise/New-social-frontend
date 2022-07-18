import { GET_USERS } from "./type";

const initialState = {
  loading: false,
  users: [],
  error: "",
};

export const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS:
      return {
        loading: false,
        users: action.payload,
        error: "",
      };
    default:
      return state;
  }
};
