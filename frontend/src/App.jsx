import { Route, Routes } from "react-router";
import { HomePage, ProjectsPage, ProjectPage, LoginPage, RegisterPage } from "./pages";
import { Header, ProtectedRoute } from "./components";
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
        <Route path="*" element={<div>Ошибка 404</div>} />
      </Routes>
    </div>
  );
}
