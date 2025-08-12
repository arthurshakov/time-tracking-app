import { Button } from '../../ui';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authSelector } from '../../selectors';
import { AuthWrapper, ListItem, Pagination } from '../../components';
import { useEffect, useState } from 'react';
import { request } from '../../utils/request';

const PROJECTS_PER_PAGE = 3;

export const ProjectsList = () => {
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
    return <AuthWrapper isAuthenticated={isAuthenticated} message="to see your projects" />;
  }

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="container page__container">
        <p>No projects found</p>
        <Button icon="plus" variant="link" to="/projects/create">Create your first project</Button>
      </div>
    );
  }

  return (
    <>
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

      {
        lastPage > 1 && <Pagination currentPage={page} lastPage={lastPage} />
      }
    </>
  );
};
