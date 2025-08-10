import { Link } from "react-router-dom";
import styles from './menu.module.scss';

export const Menu = () => {
  const menuItems = [
    { id: 2, label: 'Projects', path: '/projects' },
    { id: 3, label: 'Analytics', path: '/analytics' }
  ];

  return (
    <nav className={styles.nav}>
      {
        menuItems.map(({id, label, path}) => (
          <Link to={path} key={id}>{label}</Link>
        ))
      }
    </nav>
  );
};
