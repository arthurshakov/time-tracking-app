import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { request } from '../../utils/request';
import { useSelector } from 'react-redux';
import { authSelector } from '../../selectors';
import { AuthWrapper, ListItem, Timer } from '../../components';
import { IconButton } from '../../ui';
import { getTimeFromSeconds } from '../../utils';
import { Page404 } from '../Page404/Page404';
import styles from './project-page.module.scss';

export const ProjectPage = () => {
  const {id} = useParams();
  const PROJECT_ENDPOINT = `/api/projects/${id}`;
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [timeEntries, setTimeEntries] = useState([]);
  const [editingError, setEditingError] = useState('');
  const [titleIsBeingEdited, setTitleIsBeingEdited] = useState(false);
  const {isAuthenticated} = useSelector(authSelector);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await request(`/api/projects/${id}`);

        console.log(projectData);

        if (projectData.error) {
          if (projectData.status === 404) {
            setError(404);
          } else {
            setError(projectData.error);
          }
        } else {
          setProject(projectData.data);
          setProjectTitle(projectData.data.name);
          setEditedTitle(projectData.data.name);
          setTimeEntries(projectData.data.timeEntries);
        }
      } catch(error) {
        console.log('caught error', error)
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProject();
    } else {
      const newProjectInitialName = 'New Project';
      setProjectTitle(newProjectInitialName);
      setEditedTitle(newProjectInitialName);
      setTitleIsBeingEdited(true);
      setIsLoading(false);
    }
  }, [id]);

  const onTitleSave = async () => {
    try {
      let updatedProject = null;

      if (id) {
        updatedProject = await request(PROJECT_ENDPOINT, 'PATCH', {name: editedTitle});
      } else {
        updatedProject = await request('/api/projects', 'POST', {name: editedTitle});
      }

      if (updatedProject.error) {
        console.log(updatedProject.error);
        setEditingError(updatedProject.error || 'Failed to&nbsp;update project');
      } else if (id) {
        setProjectTitle(updatedProject.data.name);
        setEditingError('');
      } else {
        setIsLoading(true);
        setTimeout(() => {
          navigate(`/projects/${updatedProject.data.id}`, {replace: true});
        }, 1000);
      }
    } catch(error) {
      console.log(error);
      setEditingError(error.message || 'Failed to&nbsp;update project');
    } finally {
      setTitleIsBeingEdited(false);
    }
  };

  const onRemoveFromList = (timeEntryId) => {
    setTimeEntries(timeEntries.filter((entry) => {
      if (timeEntryId === entry.id) {
        updateTotalDuration(-entry.duration);

        return false;
      } else {
        return true;
      }
    }));
  };

  const onProjectDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete "${project.name}"`);

    if (confirmed) {
      const responseFromRemovingProject = await request(PROJECT_ENDPOINT, 'DELETE');

      if (responseFromRemovingProject.error) {
        console.log(responseFromRemovingProject.error);
      } else {
        navigate('/projects');
      }
    }
  };

  const onTitleCancel = () => {
    setEditedTitle(projectTitle);
    setTitleIsBeingEdited(false);
  }

  const updateTotalDuration = (durationToAdd) => {
    setProject(prevProject => ({
      ...prevProject,
      duration: Math.max(prevProject.duration + durationToAdd, 0),
    }));
  }

  const onTaskSave = (newTask) => {
    const newTimeEntries = [...timeEntries, newTask];

    updateTotalDuration(newTask.duration);
    setTimeEntries(newTimeEntries);
  }

  if (error === 404) {
    return <Page404 />;
  }

  if (!isAuthenticated) {
    return (
      <main className={`page ${styles['project-page']}`}>
        <div className="container page__container">
          <AuthWrapper isAuthenticated={isAuthenticated} message="to see your projects" />
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className={`page ${styles['project-page']}`}>
        <div className="container page__container">
          <div className="container">Loading project...</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className={`page ${styles['project-page']}`}>
        <div className="container page__container">
          <div className="container">Error: {error}</div>
        </div>
      </main>
    )
  }

  // if we are on Create-Project page
  if (!id) {
    return (
      <div className={`page ${styles['project-page']}`}>
        <div className="container page__container">
          <div className={styles['title-wrapper']}>
            <input
              type="text"
              className={`h1 ${styles['title-input']}`}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <div className="list__item-buttons">
              <IconButton id="check" size="md" title="Save" onClick={onTitleSave} />
            </div>
          </div>
          {
            editingError && <div className="list__item-error">{editingError}</div>
          }
        </div>
      </div>
    );
  }

  return (
    <div className={`page ${styles['project-page']}`}>
      <div className="container page__container">
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
                <h1 className="h1">{projectTitle}</h1>
                <div className="list__item-buttons">
                  <IconButton id="edit" size="md" title="Edit" onClick={() => setTitleIsBeingEdited(true)} />
                  <IconButton id="trash-o" size="md" title="Delete" onClick={() => onProjectDelete(id)} />
                </div>
              </div>
          }
          {
            editingError && <div className="list__item-error">{editingError}</div>
          }

          <div className="h3">Total duration: {getTimeFromSeconds(project.duration)}</div>
        </div>

        <div className={styles['timer-wrapper']}>
          <h2 className="h2">Start tracking time</h2>
          <Timer projectId={id} onSaveCallback={onTaskSave} />
        </div>

        <div className={styles['task__list-top']}>
          <h2 className="h2">Done tasks</h2>

          {/* <Button icon="plus">Create</Button> */}
        </div>

        <div className="list">
          {
            timeEntries.length
            ? timeEntries.map(({id, name, duration}) => (
              <ListItem id={id} name={name} duration={duration} key={id} endpoint={`/api/projects/${project.id}/time-entries/${id}`} onRemoveFromList={onRemoveFromList} />
            ))

            : <div>At this moment there are no tasks to show in this project</div>
          }
        </div>
      </div>
    </div>
  )
}
