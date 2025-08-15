import { useSelector } from 'react-redux';
import { authSelector } from '../../selectors';
import { AuthWrapper } from '../../components';
import { getFormSchema } from '../../utils';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { request } from '../../utils/request';
import { Button } from '../../ui';
import styles from './profile-page.module.scss';

const signupFormSchema = getFormSchema(['password', 'repeat-password']);

export const ProfilePage = () => {
  const {user, isAuthenticated} = useSelector(authSelector);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    register,
    // reset,
    watch,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      password: '',
      repeatPassword: '',
    },
    resolver: yupResolver(signupFormSchema),
  });

  // Watching password fields for changes
  const password = watch('password');
  const repeatPassword = watch('repeatPassword');

  // Reset messages when inputs change
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [password, repeatPassword]);

  const onSubmit = async (formFields) => {
    const updateResponse = await request(`/api/users/${user.id}/update-password`, 'POST', formFields);

    if (updateResponse.error) {
      setSuccess(null);
      setError(updateResponse.error);
    } else if (updateResponse.success) {
      setError(null);
      setSuccess(updateResponse.success);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className={`page ${styles['profile-page']}`}>
        <div className="container page__container">
          <AuthWrapper isAuthenticated={isAuthenticated} message="to see your profile" />
        </div>
      </main>
    )
  }

  return (
    <div className={`page ${styles['profile-page']}`}>
      <div className="container page__container">
        <h1 className="h1">Welcome to&nbsp;your profile, {user.login}!</h1>
        <p>Here you can reset your password.</p>

        <form noValidate className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form__field">
            <input
              className="form__input"
              type="password"
              placeholder="New password"
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
              placeholder="Repeat new password"
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
            <div className="c-red">{error}</div>
          )}

          {success && (
            <div className="c-green">{success}</div>
          )}
        </form>
      </div>
    </div>
  )
}
