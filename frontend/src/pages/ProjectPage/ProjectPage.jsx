import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, projectsSelector } from '../../selectors';
import { AuthWrapper, PageContainer } from '../../components';
import { Page404 } from '../Page404/Page404';
import { fetchProject, updateProject } from '../../actions';
import { NewProject, ProjectTimerSection, ProjectTaskList, ProjectHeader } from './components';
import styles from './project-page.module.scss';
import { request } from '../../utils/request';

export const ProjectPage = () => {
  const {id} = useParams();
  const [editedTitle, setEditedTitle] = useState('');
  const [editingError, setEditingError] = useState('');
  const [titleIsBeingEdited, setTitleIsBeingEdited] = useState(false);
  const {isAuthenticated} = useSelector(authSelector);
  const {currentProject, error, isLoading} = useSelector(projectsSelector);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchProject(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentProject) {
      setEditedTitle(currentProject.name);
    }
  }, [currentProject]);

  const onTitleSave = async () => {
    try {
      const updatedProject = await dispatch(updateProject(id, {name: editedTitle}));

      if (updatedProject.error) {
        setEditingError(updatedProject.error || 'Failed to&nbsp;update project');
      } else {
        setEditingError('');
      }
    } catch(error) {
      setEditingError(error.message || 'Failed to&nbsp;update project');
    } finally {
      setTitleIsBeingEdited(false);
    }
  };

  const onProjectDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete "${currentProject.name}"`);

    if (confirmed) {
      try {
        const responseFromRemovingProject = await request(`/api/projects/${id}`, 'DELETE');

        if (responseFromRemovingProject.error) {
          setEditingError(responseFromRemovingProject.error);
        } else {
          navigate('/projects');
        }
      } catch(error) {
        setEditingError(error || 'Failed to&nbsp;update project');
      }
    }
  };

  const onTitleCancel = () => {
    setEditedTitle(currentProject.name);
    setTitleIsBeingEdited(false);
  }

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <AuthWrapper isAuthenticated={isAuthenticated} message="to see your projects" />
      </PageContainer>
    )
  }

  // if we are on Create-Project page
  if (!id) {
    return <NewProject />
  }

  if (error === '404') {
    return <Page404 />;
  }

  if (error) {
    return <PageContainer>Error: {error}</PageContainer>
  }

  if (isLoading) {
    return <PageContainer>Loading project...</PageContainer>
  }

  return (
    <PageContainer className={styles['project-page']}>
      <ProjectHeader
        title={currentProject.name}
        editedTitle={editedTitle}
        isEditing={titleIsBeingEdited}
        onEdit={titleIsBeingEdited ? setEditedTitle : () => setTitleIsBeingEdited(true)}
        onSave={onTitleSave}
        onCancel={onTitleCancel}
        onDelete={onProjectDelete}
        duration={currentProject.duration}
        editingError={editingError}
      />

      <ProjectTimerSection projectId={id} onTaskSave={() => dispatch(fetchProject(currentProject.id))} />

      <ProjectTaskList projectId={id} timeEntries={currentProject.timeEntries} onTaskDelete={() => dispatch(fetchProject(currentProject.id))} />
    </PageContainer>
  )
}
