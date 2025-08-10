import { ACTION_TYPES } from "./types";

export const setUserProjects = (userProjects) => ({
  type: ACTION_TYPES.SET_USER_PROJECTS,
  payload: userProjects,
});
