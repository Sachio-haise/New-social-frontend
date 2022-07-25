import { GET_MESSAGES } from "./types";

const initialState = {
  loading: false,
  messages: [],
  error: "",
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return {
        loading: false,
        messages: action.payload,
        error: "",
      };
    default:
      return initialState;
  }
};
