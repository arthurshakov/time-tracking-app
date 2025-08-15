import { ACTION_TYPES } from "./types";

export const loginFailureAction = (error) => ({
  type: ACTION_TYPES.LOGIN_FAILURE,
  payload: error,
});
