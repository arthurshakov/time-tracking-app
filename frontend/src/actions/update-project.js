import { request } from "../utils/request";
import { setCurrentProjectAction } from "./set-current-project-action";

export const updateProject = (id, newData) => async (dispatch) => {
  try {
    const updatedProject = await request(`/api/projects/${id}`, 'PATCH', newData);

    if (updatedProject.error) {
      console.log(updatedProject.error);

      return {error: updatedProject.error || 'Failed to&nbsp;update project'};
    } else {
      dispatch(setCurrentProjectAction(updatedProject.data));

      return {...updatedProject};
    }
  } catch(error) {
    console.log(error);
    return {error: error || 'Failed to&nbsp;update project'};
  }
};
