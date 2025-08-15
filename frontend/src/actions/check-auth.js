import { request } from "../utils/request";
import { loginAction } from "./login-action";
import { ACTION_TYPES } from "./types";

export const checkAuth = () => async (dispatch) => {
  try {
    const { error, user } = await request('/api/authenticate', 'POST');

    if (!error && user) {
      dispatch(loginAction(user));
    } else {
      dispatch({ type: ACTION_TYPES.AUTH_FAILURE, payload: error || 'Authentication failed' });
    }
  } catch (error) {
    dispatch({ type: ACTION_TYPES.AUTH_FAILURE, payload: error });
  }
};
