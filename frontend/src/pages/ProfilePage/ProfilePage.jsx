import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../selectors';
import { AuthWrapper, PageContainer } from '../../components';
import { getFormSchema } from '../../utils';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../ui';
import styles from './profile-page.module.scss';
import { updatePassword } from '../../actions';

const signupFormSchema = getFormSchema(['password', 'repeat-password']);

export const ProfilePage = () => {
  const {user, isAuthenticated, error} = useSelector(authSelector);
  const [success, setSuccess] = useState(null);
  const dispatch = useDispatch();

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
    setSuccess(null);
  }, [password, repeatPassword]);

  const onSubmit = async (formFields) => {
    const updateResponse = await dispatch(updatePassword(user.id, formFields));

    if (updateResponse.error) {
      setSuccess(null);
    } else if (updateResponse.success) {
      setSuccess(updateResponse.success);
    }
  };

  if (!isAuthenticated) {
    return (
      <PageContainer>
          <AuthWrapper isAuthenticated={isAuthenticated} message="to see your profile" />
      </PageContainer>
    )
  }

  return (
    <PageContainer className={styles['profile-page']}>
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
    </PageContainer>
  )
}
