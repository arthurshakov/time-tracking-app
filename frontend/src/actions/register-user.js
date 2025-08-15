import { request } from "../utils/request";
import { loginFailureAction } from "./login-failure-action";
import { setAuthLoadingStateAction } from "./set-auth-loading-state-action";

export const registerUser = (credentials) => async(dispatch) => {
  dispatch(loginFailureAction(null)); // reset error
  dispatch(setAuthLoadingStateAction(true));

  try {
    const {error, user} = await request('/api/register', 'POST', credentials);

    if (!error && user) {
      dispatch(setAuthLoadingStateAction(false));
    } else {
      dispatch(loginFailureAction(error || 'Registration failed'));
    }

    return {error, user};
  } catch(error) {
    dispatch(loginFailureAction(error));

    return { error };
  }
};
