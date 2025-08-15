import { ACTION_TYPES } from "./types";

export const setAuthLoadingStateAction = (loadingState) => ({
  type: ACTION_TYPES.SET_AUTH_LOADING_STATE,
  payload: loadingState,
});
