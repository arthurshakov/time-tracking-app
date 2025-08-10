import { Button } from '../../ui';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authSelector } from '../../selectors';
import { AuthWrapper, ListItem, Pagination } from '../../components';
import { useEffect, useState } from 'react';
import { request } from '../../utils/request';
import styles from './projects-page.module.scss';

const PROJECTS_PER_PAGE = 3;

export const ProjectsPage = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  const {isAuthenticated} = useSelector(authSelector);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const projectsPage = await request(`/api/projects?search=${search}&page=${page}&limit=${PROJECTS_PER_PAGE}`);

        setProjects(projectsPage.data.projects);
        setLastPage(projectsPage.data.lastPage);
      } catch (err) {
        setError(err.message || 'Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated, search, page])

  const onRemoveFromList = (projectId) => {
    setProjects(projects.filter(({id}) => id !== projectId));
  }

  if (!isAuthenticated) {
    return (
      <main className={`page ${styles['projects-page']}`}>
        <div className="container page__container">
          <AuthWrapper isAuthenticated={isAuthenticated} message="to see your projects" />
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className={`page ${styles['projects-page']}`}>
        <div className="container page__container">
          <div className="container">Loading projects...</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className={`page ${styles['projects-page']}`}>
        <div className="container page__container">
          <div className="container">Error: {error}</div>
        </div>
      </main>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <main className={`page ${styles['projects-page']}`}>
        <div className="container page__container">
          <p>No projects found</p>
          <Button icon="plus">Create your first project</Button>
        </div>
      </main>
    );
  }

  return (
    <main className={`page ${styles['projects-page']}`}>
      <div className="container page__container">
        <AuthWrapper isAuthenticated={isAuthenticated} message="to see your projects">

          <div className={styles['projects-page__top']}>
            <h1 className="h1">Projects</h1>
            <Button icon="plus" variant="link" to="/projects/create">Create</Button>
          </div>

          {isAuthenticated && (
            <div className="list">
              {
                projects.map(({id, name, duration}) => (
                  <ListItem
                    id={id}
                    name={name}
                    duration={duration}
                    key={id}
                    endpoint={`/api/projects/${id}`}
                    onRemoveFromList={onRemoveFromList}
                    link={`/projects/${id}`}
                  />
                ))
              }
            </div>
          )}

          {
            lastPage > 1 && <Pagination currentPage={page} lastPage={lastPage} />
          }
        </AuthWrapper>
      </div>
    </main>
  );
};
