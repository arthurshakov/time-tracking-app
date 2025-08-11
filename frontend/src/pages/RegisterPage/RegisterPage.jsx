import { Button } from "../../ui";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import { useAuthRedirect } from "../../hooks";
import { getFormSchema } from "../../utils";
import { request } from "../../utils/request";
import { useAuthRedirect } from "../../hooks";

const signupFormSchema = getFormSchema(['login', 'password', 'repeat-password']);

export const RegisterPage = () => {
  // IF THE USER IS ALREADY LOGGED IN WE REDIRECT HIM TO HOMEPAGE
  useAuthRedirect();

  // HERE IS THE LOGIC OF RENDERING THE LOGIN FORM IF THE USER IS NOT LOGGED IN
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    // reset,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      login: '',
      password: '',
      repeatPassword: '',
    },
    resolver: yupResolver(signupFormSchema),
  });

  const onSubmit = async (formFields) => {
    const registerResponse = await request('/api/register', 'POST', formFields);

    if (registerResponse.error) {
      setError(registerResponse.error);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="page">
      <div className="page__container">
        <h1 className="h1">Register</h1>

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


          <div className="form__field">
            <input
              className="form__input"
              type="password"
              placeholder="Repeat password"
              {...register('repeatPassword')}
            />
             {errors.repeatPassword && (
              <p className="form__error">{errors.repeatPassword.message}</p>
            )}
          </div>

          <div className="form__footer">
            <Button type="submit" className="form__submit-button">Submit</Button>
          </div>

          {error && (
            <div class="c-red">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};
