import { GET_POST, LIKE_PENDING, PENDING_POST } from "./types";
const initialState = {
  loading: false,
  posts: [],
  error: "",
};
export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case PENDING_POST:
      return {
        loading: true,
        posts: [],
        error: "",
      };
    case GET_POST:
      return {
        loading: false,
        posts: action.payload,
        error: "",
      };

    case LIKE_PENDING:
      return {
        loading: false,
        posts: action.payload,
        error: "",
      };
    default:
      return state;
  }
};
