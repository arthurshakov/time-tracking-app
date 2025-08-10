import { ACTION_TYPES } from "./types";

export const loginAction = (user) => ({
  type: ACTION_TYPES.LOGIN,
  payload: {
    user,
    isAuthenticated: true,
  },
});
