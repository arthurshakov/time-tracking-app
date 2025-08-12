import { useSelector } from "react-redux";
import { authSelector } from "../../selectors";
import { useEffect, useState } from "react";
import { request } from "../../utils/request";
import { useSearchParams } from "react-router";

export const AnalyticsPage = () => {
  const {isAuthenticated} = useSelector(authSelector);
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastPage, setLastPage] = useState(1);

  const PROJECTS_PER_PAGE = 3;

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
  });

  if (!isAuthenticated) {
    return (
      <main className="page">
        <div className="container page__container">
          <AuthWrapper isAuthenticated={isAuthenticated} message="to see your project analytics" />
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="page">
        <div className="container page__container">
          <div className="container">Loading projects...</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="page">
        <div className="container page__container">
          <div className="container">Error: {error}</div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="container page__container">
        <h1 className="h1">Analytics</h1>
      </div>
    </main>
  );
};
