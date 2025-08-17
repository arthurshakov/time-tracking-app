import { ACTION_TYPES } from "./types";

export const passwordResetFailureAction = (error) => ({
  type: ACTION_TYPES.PASSWORD_RESET_FAILURE,
  payload: error,
});
