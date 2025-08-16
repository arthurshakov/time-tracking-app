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
      return {
        ...state,
        allProjects: action.payload,
        isLoading: false,
        error: null,
      }

    case ACTION_TYPES.SET_CURRENT_PROJECT:
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          ...action.payload,
        },
        isLoading: false,
        error: null,
      }

    case ACTION_TYPES.RESET_CURRENT_PROJECT:
      return {
        ...state,
        currentProject: action.payload,
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
