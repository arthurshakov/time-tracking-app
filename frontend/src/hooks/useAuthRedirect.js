import { useSelector } from "react-redux";
import { authSelector } from "../selectors";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export const useAuthRedirect = (redirectPath = '/') => {
  const {isAuthenticated} = useSelector(authSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, {replace: true});
    }
  }, [isAuthenticated, navigate, redirectPath]);
};
