import { Button, IconButton } from '../../ui';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authSelector } from '../../selectors';
import { AuthWrapper, ListItem, Pagination } from '../../components';
import { useCallback, useEffect, useState } from 'react';
import { request } from '../../utils/request';
import { debounce } from 'lodash';

const PROJECTS_PER_PAGE = 3;

export const ProjectsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const sort = searchParams.get('sort') || 'desc';
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  const {isAuthenticated} = useSelector(authSelector);

  const fetchProjects = useCallback(debounce(
    async (searchParams) => {
      try {
        setLoading(true);
        setError(null);

        const searchParam = searchParams.get('search') || '';
        const pageParam = searchParams.get('page') || 1;
        const sortParam = searchParams.get('sort') || 'desc';

        const projectsData = await request(`/api/projects?search=${searchParam}&page=${pageParam}&limit=${PROJECTS_PER_PAGE}&sort=${sortParam}`);

        setProjects(projectsData.data.projects);
        setLastPage(projectsData.data.lastPage);
      } catch (err) {
        setError(err.message || 'Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
  }, 300), []);

  const debouncedSearch = useCallback(debounce((value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('search', value.trim().toLowerCase());
    newParams.set('page', '1'); // Reset to first page on search
    setSearchParams(newParams);
  }, 300), [searchParams, setSearchParams]);

  const handleSearch = (value) => {
    setSearch(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects(searchParams);
    }
  }, [isAuthenticated, fetchProjects, searchParams])

  const onRemoveFromList = (projectId) => {
    setProjects(projects.filter(({id}) => id !== projectId));
  }

  const toggleSort = () => {
    const newSort = sort === 'desc' ? 'asc' : 'desc';

    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    setSearchParams(newParams);
  }

  const resetSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('search', '');
    newParams.set('page', 1);
    setSearch('');
    setSearchParams(newParams);
  }

  if (!isAuthenticated) {
    return <AuthWrapper isAuthenticated={isAuthenticated} message="to see your projects" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!loading && (!projects)) {
    return (
      <div className="container page__container">
        <p>No projects found</p>
        <Button icon="plus" variant="link" to="/projects/create">Create your first project</Button>
      </div>
    );
  }

  return (
    <>
      <div className="list__controls">
        <div className="list__search">
          <input
            className="form__input"
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={({target}) => handleSearch(target.value)}
          />
          <IconButton
            id="times"
            disabled={!search}
            onClick={resetSearch }
          />
        </div>
        <div className="list__sort">
          <Button icon={sort === 'desc' ? 'sort-amount-desc' : 'sort-amount-asc'} onClick={toggleSort}>Sort by date</Button>
        </div>
      </div>
      {
        loading
          ? <div>Loading projects...</div>
          : !projects.length
            ? <p>No projects found</p>
            : <>
              <div className="list">
                {
                  projects.map(({id, name, duration, createdAt}) => (
                    <ListItem
                      id={id}
                      name={name}
                      duration={duration}
                      createdAt={createdAt}
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
      }
    </>
  );
};
