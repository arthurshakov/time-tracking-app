import { request } from "../utils/request";

export const deleteProject = (id) => async (dispatch) => {
  try {
    const responseFromRemovingProject = await request(`/api/projects/${id}`, 'DELETE');

    if (responseFromRemovingProject.error) {
      return {error: responseFromRemovingProject.error};
    } else {
      // dispatch(resetCurrentProjectAction);
      return {error: null};
    }
  } catch(error) {
    console.log(error);
    return {error: error || 'Failed to&nbsp;update project'};
  }
};
