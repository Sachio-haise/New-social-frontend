import { GET_MESSAGES, GET_ROOMS } from "./types";

const initialState = {
  loading: false,
  messages: [],
  rooms: [],
  error: "",
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return {
        loading: false,
        messages: action.payload,
        rooms: [],
        error: "",
      };
    case GET_ROOMS:
      return {
        ...state,
        rooms: action.payload,
      };
    default:
      return state;
  }
};
