import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants';
import logo from '@images/general/logo.png';
import styles from './logo.module.scss';

export const Logo = () => {
  return (
    <Link to={ROUTES.HOME} className={styles.logo}>
      <div className={styles.logo__image}>
        <img src={logo} alt="Logo" />
      </div>

      <div className={styles.logo__text}>
        <div className={styles.logo__name}>Time tracker</div>

        <div className={styles.logo__slogan}>Tracking time since 1776</div>
      </div>
    </Link>
  );
};
