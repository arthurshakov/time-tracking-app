import { Button } from '../../ui';
import { useSelector } from 'react-redux';
import { authSelector } from '../../selectors';
import { AuthWrapper, ProjectsList } from '../../components';
import styles from './projects-page.module.scss';

export const ProjectsPage = () => {
  const {isAuthenticated} = useSelector(authSelector);

  if (!isAuthenticated) {
    return (
      <main className={`page ${styles['projects-page']}`}>
        <div className="container page__container">
          <AuthWrapper isAuthenticated={isAuthenticated} message="to see your projects" />
        </div>
      </main>
    )
  }

  return (
    <main className={`page ${styles['projects-page']}`}>
      <div className="container page__container">
        <div className={styles['projects-page__top']}>
          <h1 className="h1">Projects</h1>
          <Button icon="plus" variant="link" to="/projects/create">Create</Button>
        </div>

        <ProjectsList />
      </div>
    </main>
  );
};
