// /* global process */

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { authSelector } from "../selectors";
import { useCallback, useEffect } from "react";
import { checkAuth } from "../actions";

export const useAuth = () => {
  const authData = useSelector(authSelector, shallowEqual);
  const { isAuthenticated, isLoading, error } = useSelector(authSelector);
  const dispatch = useDispatch();

  const refreshAuth = useCallback(() => dispatch(checkAuth()), [dispatch])

  useEffect(() => {
    if (!isAuthenticated) {
      refreshAuth();
    }
  }, [isAuthenticated, refreshAuth]);

  return {...authData, isLoading, error, refreshAuth};
};
