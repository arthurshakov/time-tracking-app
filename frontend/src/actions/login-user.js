import { request } from "../utils/request";
import { loginAction } from "./login-action";
import { loginFailureAction } from "./login-failure-action";
import { setAuthLoadingStateAction } from "./set-auth-loading-state-action";
import { ACTION_TYPES } from "./types";

export const loginUser = (credentials) => async(dispatch) => {
  dispatch(loginFailureAction(null)); // reset error
  dispatch(setAuthLoadingStateAction(true));

  try {
    const {error, user} = await request('/api/login', 'POST', credentials);

    if (!error && user) {
      dispatch(loginAction(user));
    } else {
      dispatch(loginFailureAction(error || 'Login failed'));
    }

    return {error, user};
  } catch(error) {
    dispatch({ type: ACTION_TYPES.LOGIN_FAILURE, payload: error });
    dispatch(loginFailureAction(error));

    return { error };
  }
};
