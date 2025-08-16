import { ACTION_TYPES } from "./types";

export const setCurrentProjectAction = (currentProject) => ({
  type: ACTION_TYPES.SET_CURRENT_PROJECT,
  payload: currentProject,
});
