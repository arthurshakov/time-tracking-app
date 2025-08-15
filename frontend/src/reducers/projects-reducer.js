import { ACTION_TYPES } from '../actions/types';

const initialState = {
  allProjects: [],
  currentProject: null,
  isLoading: true,
  error: null,
};

export const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_ALL_PROJECTS:

      console.log('all projects', action.payload);
      return {
        ...state,
        allProjects: action.payload,
        isLoading: false,
        error: null,
      }

    case ACTION_TYPES.PROJECTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }

    case ACTION_TYPES.SET_PROJECTS_LOADING_STATE:
      return {
        ...state,
        isLoading: action.payload,
      }

    default:
      return state;
  }
};
