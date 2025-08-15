import { Button } from "../../ui";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getFormSchema } from "../../utils";
import { useAuthRedirect } from "../../hooks";
import { registerUser } from "../../actions";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../selectors";
import { useNavigate } from "react-router";

const signupFormSchema = getFormSchema(['login', 'password', 'repeat-password']);

export const RegisterPage = () => {
  // IF THE USER IS ALREADY LOGGED IN WE REDIRECT HIM TO HOMEPAGE
  useAuthRedirect();

  // RENDERING THE LOGIN FORM IF THE USER IS NOT LOGGED IN
  // const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isLoginError, isLoading } = useSelector(authSelector);

  const {
    register,
    // reset,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm({
    defaultValues: {
      login: '',
      password: '',
      repeatPassword: '',
    },
    resolver: yupResolver(signupFormSchema),
  });

  const onSubmit = async (formFields) => {
    const {error: registrationError} = await dispatch(registerUser(formFields));

    if (!registrationError) {
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
            <Button
              type="submit"
              className="form__submit-button"
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? "Registering..." : "Submit"}
            </Button>
          </div>

          {isLoginError && (
            <div className="c-red">{error || "Registration failed. Please try again."}</div>
          )}
        </form>
      </div>
    </div>
  );
};
