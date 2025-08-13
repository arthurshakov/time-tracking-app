import { useSelector } from 'react-redux';
import { authSelector } from '../../selectors';
import { AuthWrapper, ProjectsList } from '../../components';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './analytics-page.module.scss';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useSearchParams } from 'react-router-dom';
import { request } from '../../utils/request';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A4DE6C'];

export const AnalyticsPage = () => {
  const {isAuthenticated} = useSelector(authSelector);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);

  const fetchProjects = useCallback(debounce(
    async (searchParams) => {
      try {
        setLoading(true);
        setError(null);

        const projectsData = await request(`/api/projects?search=${searchParams.get('search') || ''}&sort=${searchParams.get('sort') || 'desc'}`);

        setProjects(projectsData.data.projects);
      } catch (err) {
        setError(err.message || 'Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
  }, 300), []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects(searchParams);
    }
  }, [isAuthenticated, fetchProjects, searchParams]);

  // // Prepare chart data - ensure it's in the correct format
  // const chartData = projects.map(project => ({
  //   name: project.name,
  //   value: project.duration || 0 // Ensure there's always a value
  // }));

  if (!isAuthenticated) {
    return (
      <main className="page">
        <div className="container page__container">
          <AuthWrapper isAuthenticated={isAuthenticated} message="to see analytics" />
        </div>
      </main>
    )
  }

  return (
    <main className={`page ${styles['analytics-page']}`}>
      <div className="container page__container">
        <h1 className="h1">Analytics</h1>

        {
          loading
            ? <div>Loading...</div>
            : error
              ? <div>Error: {error}</div>
              : projects.length > 0 && (
                  <div className={styles['charts-container']}>
                    {/* PIE chart */}
                    <div className={styles.chart}>
                      <h2 className="h3">Project Distribution</h2>
                      <ResponsiveContainer height={300}>
                        <PieChart>
                          <Pie
                            data={projects.filter(({duration}) => duration > 0)}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={100}
                            dataKey="duration"
                            label={({ name, percent }) => {
                              const percentage = (percent * 100).toFixed(0);
                              const formattedName = name.length > 10 ? `${name.slice(0, 7)}...` : name;

                              return `${formattedName}: ${percentage}`
                            }}
                          >
                            {projects.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* BAR chart */}
                    <div className={styles.chart}>
                      <h2 className="h3">Bar Chart</h2>
                      <ResponsiveContainer height={300}>
                        <BarChart data={projects}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          {/* <Legend /> */}
                          <Bar dataKey="duration" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
              )
        }
        <ProjectsList />
      </div>
    </main>
  );
};
