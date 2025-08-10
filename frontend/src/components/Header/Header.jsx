import { Menu, Logo, ControlPanel } from './components';
import styles from './header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.header__container}`}>
        <div className={styles.header__left}>
          <Logo />
          <Menu />
        </div>

        <div className={styles.header__right}>
          <ControlPanel />
        </div>
      </div>
    </header>
  );
};
