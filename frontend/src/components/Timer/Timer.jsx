import { useEffect, useRef, useState } from 'react';
import { Button, IconButton, TextInput, Select } from '../../ui';
import styles from './timer.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, projectsSelector } from '../../selectors';
import { AuthWrapper } from '../AuthWrapper/AuthWrapper';
import { getTimeFromSeconds } from '../../utils';
import { request } from '../../utils/request';
import { fetchProjects } from '../../actions';

export const Timer = ({projectId = null, onSaveCallback = null}) => {
  const [projectsOptions, setProjectsOptions] = useState([]);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [taskName, setTaskName] = useState('');
  const intervalRef = useRef(null);
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector(authSelector);
  const {allProjects, error} = useSelector(projectsSelector);

  useEffect(() => {
    if (isAuthenticated && !projectId) {
      dispatch(fetchProjects());
    }
  }, [isAuthenticated, projectId, dispatch]);

  // Map allProjects to projectsOptions when allProjects changes
  useEffect(() => {
    if (allProjects && allProjects.length > 0) {
      const mappedProjects = allProjects.map(project => ({
        value: project.id,
        label: project.name,
      }));

      setProjectsOptions(mappedProjects);
    }
  }, [allProjects]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, []);

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  const play = () => {
    intervalRef.current = setInterval(() => {
      setTotalSeconds(prev => prev + 1);
    }, 1000);
  }

  const onPlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }

    setIsPlaying(!isPlaying);
  }

  const onReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsPlaying(false);
    setTotalSeconds(0);
  }

  const onSave = async () => {
    pause();
    setIsPlaying(false);

    if (totalSeconds === 0) {
      return;
    }

    if (!isAuthenticated) {
      alert('Log in to save your time entry');
      return;
    }

    if (!selectedProject && !projectId) {
      alert('Select a project');
      return;
    }

    if (!taskName.trim()) {
      alert('Enter a task name');
      return;
    }

    const endpoint = projectId
      ? `/api/projects/${projectId}/time-entries`
      : `/api/projects/${selectedProject.value}/time-entries`
    ;

    try {
      const newTask = await request(endpoint, 'POST', {
        name: taskName.trim(),
        duration: totalSeconds,
      });

      alert('Time entry saved successfully!');
      onReset();
      setTaskName('');

      if (!projectId) {
        setSelectedProject(null);
      }

      if (onSaveCallback) {
        onSaveCallback(newTask.data);
      }
    } catch (error) {
      console.error('Failed to save time entry:', error);
      alert('Failed to save time entry. Please try again.');
    }
  };

  return (
    <div className={styles.timer__block}>
      <div className={styles.timer}>
        <div className={styles.timer__time}>{getTimeFromSeconds(totalSeconds)}</div>

        <div className={styles.timer__buttons}>
          <IconButton id="undo" large title="Reset" onClick={onReset}/>

          <IconButton
            id={isPlaying ? "pause" : "play"}
            large
            title={isPlaying ? "Pause" : "Play"}
            onClick={onPlayPause}
          />

          <IconButton id="save" large title="Save" onClick={onSave} disabled={totalSeconds === 0}/>
        </div>
      </div>

      <AuthWrapper isAuthenticated={isAuthenticated}>
        {
          error
          ? <div>{error}</div>
          : <>
              <div className={styles['timer__project-controls']}>

                {/* If we don't have initial projectId then we show projects options */}
                { !projectId &&
                  <Select
                  options={projectsOptions}
                  isSearchable
                  placeholder="Choose a project..."
                  className={styles['timer__project-select']}
                  value={selectedProject}
                  onChange={setSelectedProject}
                  />
                }

                <TextInput placeholder="Name the current task..." value={taskName} onChange={(event) => setTaskName(event.target.value)} />
              </div>

              {
                !projectId &&
                <div className={styles['button-wrapper']}>
                  <Button icon="plus" variant="link" to="/projects/create">Create new project</Button>
                </div>
              }
            </>
        }
      </AuthWrapper>
    </div>
  );
};
