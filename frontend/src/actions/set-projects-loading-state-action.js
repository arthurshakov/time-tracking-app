import { ACTION_TYPES } from "./types";

export const setProjectsLoadingStateAction = (loadingState) => ({
  type: ACTION_TYPES.SET_PROJECTS_LOADING_STATE,
  payload: loadingState,
});
