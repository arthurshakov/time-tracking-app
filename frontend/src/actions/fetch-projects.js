import { request } from "../utils/request";
import { projectsFailureAction } from "./projects-failure-action";
import { setAllProjectsAction } from "./set-all-projects-action";
import { setProjectsLoadingStateAction } from "./set-projects-loading-state-action";

export const fetchProjects = (queryString) => async (dispatch) => {
  dispatch(setProjectsLoadingStateAction(true));

  try {
    const {data: projectsData} = await request(`/api/projects?${queryString ? queryString : ''}`);

    dispatch(setAllProjectsAction(projectsData.projects));
  } catch (err) {
    dispatch(projectsFailureAction(err.message || 'Failed to load projects'));

    console.error(err);
  } finally {
    dispatch(setProjectsLoadingStateAction(false));
  }
};
