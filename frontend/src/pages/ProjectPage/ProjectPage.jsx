import { Button } from '../../ui';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { request } from '../../utils/request';
import { useSelector } from 'react-redux';
import { authSelector } from '../../selectors';
import { AuthWrapper, ListItem } from '../../components';
import { IconButton } from '../../ui';
import { getTimeFromSeconds } from '../../utils';
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
      setIsLoading(true);

      try {
        const projectData = await request(PROJECT_ENDPOINT);

        console.log(projectData);

        if (projectData.error) {
          console.log('setting error')
          setError(projectData.error);
        } else {
          setProject(projectData.data);
          setProjectTitle(projectData.data.name);
          setEditedTitle(projectData.data.name);
          setTimeEntries(projectData.data.timeEntries);
        }
      } catch(error) {
        console.log(error || 'Failed to load project')
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, error, PROJECT_ENDPOINT]);

  const onTitleSave = async () => {
    try {
      const updatedProject = await request(PROJECT_ENDPOINT, 'PATCH', {name: editedTitle});

      if (updatedProject.error) {
        console.log(updatedProject.error);
        setEditingError(updatedProject.error || 'Failed to&nbsp;update project');
      } else {
        setProjectTitle(updatedProject.data.name);
        setEditingError('');
      }
    } catch(error) {
      console.log(error);
      setEditingError(error.message || 'Failed to&nbsp;update project');
    } finally {
      setTitleIsBeingEdited(false);
    }
  };

  const onRemoveFromList = (timeEntryId) => {
    setTimeEntries(timeEntries.filter(({id}) => timeEntryId !== id));
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
          <div className="container">Loading projects...</div>
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

        <div className={styles['task__list-top']}>
          <h2 className="h2">Tasks</h2>

          <Button icon="plus">Create</Button>
        </div>

        <div className="list">
          {
            timeEntries.length
            ? timeEntries.map(({id, name, duration}) => (
              <ListItem id={id} name={name} duration={duration} key={id} endpoint={`/api/projects/${project.id}/time-entries/${id}`} onRemoveFromList={onRemoveFromList} />
            ))

            : <div>You have no tasks to show at the moment</div>
          }
        </div>
      </div>
    </div>
  )
}
