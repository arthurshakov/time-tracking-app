import { Route, Routes } from "react-router";
import {
  HomePage,
  ProjectsPage,
  ProjectPage,
  LoginPage,
  RegisterPage,
  Page404,
  ProfilePage,
  AnalyticsPage,
} from "./pages";
import { Header } from "./components";
import { useAuth } from "./hooks";

export const App = () => {
  const {isLoading} = useAuth();

  return (
    <div className={`app ${!isLoading ? 'is-loaded' : ''}`}>
      <Header />
      <Routes>
        <Route path="/login/" element={<LoginPage />} />
        <Route path="/register/" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/" element={<ProjectsPage />} />
        <Route path="/projects/create" element={<ProjectPage />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}
