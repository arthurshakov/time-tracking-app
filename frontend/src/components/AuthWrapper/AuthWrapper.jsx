import { Link } from "react-router-dom";

export const AuthWrapper = ({
  isAuthenticated,
  message = 'to save your time entries',
  children
}) => {
  return isAuthenticated
    ? children
    : <p>
        <Link to="/login">Log in</Link> {message}
      </p>
}
