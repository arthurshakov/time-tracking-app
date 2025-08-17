import { ACTION_TYPES } from '../actions/types';

const initialState = {
  user: null,
  isLoading: true,
  error: null,
  isLoginError: false,
  isAuthenticated: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.LOGIN:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        isLoginError: false,
        isLoading: false,
        error: null,
      }

    case ACTION_TYPES.LOGOUT:
      return initialState;

    case ACTION_TYPES.AUTH_FAILURE:
      return {
        ...state,
        isLoginError: false,
        error: action.payload,
        isAuthenticated: false,
        isLoading: false,
      };

    case ACTION_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        isLoginError: action.payload ? true : false,
        error: action.payload,
        isAuthenticated: false,
        isLoading: false,
      };

    case ACTION_TYPES.PASSWORD_RESET_FAILURE:
      return {
        ...state,
        isLoginError: false,
        error: action.payload,
        isLoading: false,
      };

    case ACTION_TYPES.SET_AUTH_LOADING_STATE:
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};
