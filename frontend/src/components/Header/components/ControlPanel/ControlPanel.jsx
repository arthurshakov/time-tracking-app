import { Link } from 'react-router-dom';
import { IconButton } from '../../../../ui';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../../../selectors';
import styles from './control-panel.module.scss';
import { logoutAction } from '../../../../actions';
import { request } from '../../../../utils/request';

export const ControlPanel = () => {
  const {isAuthenticated, user} = useSelector(authSelector);
  const dispatch = useDispatch();

  const onLogout = async () => {
    await request('/api/logout', 'POST')
    dispatch(logoutAction);
  };

  return (
    <div className={styles['control-panel']}>
      {
        isAuthenticated
          ? <>
              <div>
                <button onClick={onLogout} className={styles['text-link']}>Log out</button>
              </div>

              <IconButton
                id="user"
                id2="circle"
                large
                variant="link"
                to="/profile"
                title={user.login}
              />
            </>

          : <div>
              <Link to="/login" className={styles['text-link']}>Log in</Link>
              <span>|</span>
              <Link to="/register" className={styles['text-link']}>Register</Link>
            </div>
      }
    </div>
  );
};
