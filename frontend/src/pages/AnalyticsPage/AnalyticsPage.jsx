import { useDispatch, useSelector } from 'react-redux';
import { authSelector, projectsSelector } from '../../selectors';
import { AuthWrapper, ProjectsList, PageContainer } from '../../components';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './analytics-page.module.scss';
import { useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProjects } from '../../actions';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A4DE6C'];

export const AnalyticsPage = () => {
  const {isAuthenticated} = useSelector(authSelector);
  const [searchParams] = useSearchParams();
  const {allProjects, error, isLoading} = useSelector(projectsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    let handler = null;

    if (isAuthenticated) {
      const queryString = `search=${searchParams.get('search') || ''}&sort=${searchParams.get('sort') || 'desc'}`;

      handler = setTimeout(() => {
        dispatch(fetchProjects(queryString));
      }, 300);
    }

    return () => {
      if (handler) {
        clearTimeout(handler);
      }
    };
  }, [isAuthenticated, dispatch, searchParams]);

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <AuthWrapper isAuthenticated={isAuthenticated} message="to see analytics" />
      </PageContainer>
    )
  }

  return (
    <main className={`page ${styles['analytics-page']}`}>
      <div className="container page__container">
        <h1 className="h1">Analytics</h1>

        {
          isLoading
            ? <div>Loading...</div>
            : error
              ? <div>Error: {error}</div>
              : allProjects.length > 0 && (
                  <div className={styles['charts-container']}>
                    {/* PIE chart */}
                    <div className={styles.chart}>
                      <h2 className="h3">Project Distribution</h2>
                      <ResponsiveContainer height={300}>
                        <PieChart>
                          <Pie
                            data={allProjects.filter(({duration}) => duration > 0)}
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
                            {allProjects.map((entry, index) => (
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
                        <BarChart data={allProjects}>
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
