import { Button } from "../../ui";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAction } from "../../actions";
// import { useAuthRedirect } from "../../hooks";
import { getFormSchema } from "../../utils";
import { request } from "../../utils/request";
import { useAuthRedirect } from "../../hooks";

const loginFormSchema = getFormSchema(['login', 'password']);

export const LoginPage = () => {
  // IF THE USER IS ALREADY LOGGED IN WE REDIRECT HIM TO HOMEPAGE
  useAuthRedirect();

  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);
  const dispatch = useDispatch();

  const {
    register,
    // reset,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      login: '',
      password: '',
    },
    resolver: yupResolver(loginFormSchema),
  });

  const onSubmit = async (formFields) => {
    const {error: authError, user} = await request('/api/login', 'POST', formFields);

    if (authError) {
      setAuthError(authError);
    } else {
      // After successful login
      dispatch(loginAction(user));

      navigate('/');
    }
  };

  return (
    <div className="page">
      <div className="page__container">
        <h1 className="h1">Log in</h1>
        <form noValidate className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form__field">
            <input
              className="form__input"
              type="text"
              placeholder="Login"
              {...register('login')}
            />
            {errors.login && (
              <p className="form__error">{errors.login.message}</p>
            )}
          </div>

          <div className="form__field">
            <input
              className="form__input"
              type="password"
              placeholder="Password"
              {...register('password')}
            />
             {errors.password && (
              <p className="form__error">{errors.password.message}</p>
            )}
          </div>

          <div className="form__footer">
            <Button type="submit" className="form__submit-button">Submit</Button>
          </div>

          {authError && (
            <div className="c-red">{authError}</div>
          )}
        </form>
      </div>
    </div>
  );
};
