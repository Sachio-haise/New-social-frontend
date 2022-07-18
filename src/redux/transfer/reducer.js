import {
  REMOVE_DATA,
  TRANS_DELETE_ID,
  TRANS_POST_ID,
  TRANS_USER_DATA,
} from "./types";

const initialState = {
  post_id: "",
  delete_id: "",
  user_data: "",
};

export const transferData = (state = initialState, action) => {
  switch (action.type) {
    case TRANS_POST_ID:
      return {
        post_id: action.payload,
        delete_id: "",
        user_data: "",
      };
    case TRANS_DELETE_ID:
      return {
        delete_id: action.payload,
        post_id: "",
        user_data: "",
      };
    case TRANS_USER_DATA:
      return {
        delete_id: "",
        post_id: "",
        user_data: action.payload,
      };
    case REMOVE_DATA:
      return {
        post_id: "",
        delete_id: "",
        user_data: "",
      };
    default:
      return state;
  }
};
