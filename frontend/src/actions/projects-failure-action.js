import { ACTION_TYPES } from "./types";

export const projectsFailureAction = (error) => ({
  type: ACTION_TYPES.PROJECTS_FAILURE,
  payload: error,
});
