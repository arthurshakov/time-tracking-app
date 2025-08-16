import { request } from "../utils/request";
import { projectsFailureAction } from "./projects-failure-action";
import { setCurrentProjectAction } from "./set-current-project-action";
import { setProjectsLoadingStateAction } from "./set-projects-loading-state-action";

export const fetchProject = (id) => async (dispatch) => {
  dispatch(setProjectsLoadingStateAction(true));

  try {
    const projectData = await request(`/api/projects/${id}`);

    if (projectData.error) {
      if (projectData.status === 404) {
        dispatch(projectsFailureAction('404'));
      } else {
        dispatch(projectsFailureAction(projectData.error));
      }
    } else {
      dispatch(setCurrentProjectAction(projectData.data));
      // setProjectTitle(projectData.data.name);
      // setEditedTitle(projectData.data.name);
      // setTimeEntries(projectData.data.timeEntries);
    }
  } catch (err) {
    dispatch(projectsFailureAction(err.message || 'Failed to load project'));

    console.error(err);
  } finally {
    dispatch(setProjectsLoadingStateAction(false));
  }
};
