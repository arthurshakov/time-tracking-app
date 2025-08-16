import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, projectsSelector } from '../../selectors';
import { AuthWrapper, ListItem, Timer, PageContainer } from '../../components';
import { IconButton } from '../../ui';
import { getTimeFromSeconds } from '../../utils';
import { Page404 } from '../Page404/Page404';
import { deleteProject, fetchProject, updateProject } from '../../actions';
import { NewProject } from './components/NewProject';
import styles from './project-page.module.scss';

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
      const responseFromRemovingProject = await dispatch(deleteProject(id));

      if (responseFromRemovingProject.error) {
        setEditingError(responseFromRemovingProject.error);
      } else {
        navigate('/projects');
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
      <div className="page__top">
        {
          titleIsBeingEdited
          ?
            <div className={styles['title-wrapper']}>
              <input
                type="text"
                className={`h1 ${styles['title-input']}`}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <div className="list__item-buttons">
                <IconButton id="check" size="md" title="Save" onClick={onTitleSave} />
                <IconButton id="times" size="md" title="Cancel" onClick={onTitleCancel} />
              </div>
            </div>
          :
            <div className={styles['title-wrapper']}>
              <h1 className="h1">{currentProject.name}</h1>
              <div className="list__item-buttons">
                <IconButton id="edit" size="md" title="Edit" onClick={() => setTitleIsBeingEdited(true)} />
                <IconButton id="trash-o" size="md" title="Delete" onClick={() => onProjectDelete(id)} />
              </div>
            </div>
        }
        {
          editingError && <div className="list__item-error">{editingError}</div>
        }

        <div className="h3">Total duration: {getTimeFromSeconds(currentProject.duration)}</div>
      </div>

      <div className={styles['timer-wrapper']}>
        <h2 className="h2">Start tracking time</h2>
        <Timer projectId={id} onSaveCallback={() => dispatch(fetchProject(currentProject.id))} />
      </div>

      <div className={styles['task__list-top']}>
        <h2 className="h2">Done tasks</h2>
      </div>

      <div className="list">
        {
          currentProject.timeEntries.length
          ? currentProject.timeEntries.map(({id, name, duration, createdAt}) => (
            <ListItem
              id={id}
              name={name}
              duration={duration}
              createdAt={createdAt}
              key={id}
              endpoint={`/api/projects/${currentProject.id}/time-entries/${id}`}
              onRemoveFromList={() => dispatch(fetchProject(currentProject.id))}
            />
          ))

          : <div>At this moment there are no tasks to show in this project</div>
        }
      </div>
    </PageContainer>
  )
}
