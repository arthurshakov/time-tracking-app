// /* global process */

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { authSelector } from "../selectors";
import { useCallback, useEffect, useState } from "react";
import { loginAction } from "../actions";
import { request } from "../utils/request";

export const useAuth = () => {
  const authData = useSelector(authSelector, shallowEqual);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const checkAuthentication = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const {error, user} = await request('/api/authenticate', 'POST');

      // if (process.env.NODE_ENV === 'development') {
      //   console.log(error);
      //   console.log(user);
      // }

      if (!error && user) {
        dispatch(loginAction(user));
      } else {
        setError(error || new Error('Authentication failed'));
      }
    } catch(error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch])

  useEffect(() => {
    if (!authData.isAuthenticated) {
      checkAuthentication();
    } else {
      setIsLoading(false);
    }
  }, [authData.isAuthenticated, checkAuthentication]);

  return {...authData, isLoading, error, refreshAuth: checkAuthentication};
};
