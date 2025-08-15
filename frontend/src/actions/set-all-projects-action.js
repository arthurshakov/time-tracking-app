import { ACTION_TYPES } from "./types";

export const setAllProjectsAction = (allProjects) => ({
  type: ACTION_TYPES.SET_ALL_PROJECTS,
  payload: allProjects,
});
