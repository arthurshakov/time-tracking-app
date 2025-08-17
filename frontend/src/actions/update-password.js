import { request } from "../utils/request";
import { passwordResetFailureAction } from "./password-reset-failure-action";

export const updatePassword = (userId, newData) => async (dispatch) => {
  dispatch(passwordResetFailureAction(null)); // reset error
  // dispatch(setAuthLoadingStateAction(true));

  try {
    const updateResponse = await request(`/api/users/${userId}/update-password`, 'POST', newData);

    if (updateResponse.error) {
      dispatch(passwordResetFailureAction(updateResponse.error));

      return {error: updateResponse.error};
    } else {
      return {...updateResponse};
    }
  } catch(error) {
    return {error: error || 'Failed to&nbsp;update password'};
  }
};
