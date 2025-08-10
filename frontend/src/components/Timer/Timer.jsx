import { useEffect, useRef, useState } from 'react';
import { IconButton, TextInput, Select } from '../../ui';
import styles from './timer.module.scss';
import { useSelector } from 'react-redux';
import { authSelector } from '../../selectors';
import { AuthWrapper } from '../AuthWrapper/AuthWrapper';
import { getTimeFromSeconds } from '../../utils';
import { request } from '../../utils/request';

export const TimerBlock = () => {
  const [projectsOptions, setProjectsOptions] = useState([]);
  // const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [error, setError] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [taskName, setTaskName] = useState('');
  const intervalRef = useRef(null);
  const {isAuthenticated} = useSelector(authSelector);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const {data: projectsData} = await request('/api/projects');

        setProjectsOptions(projectsData.projects.map(project => ({
          value: project.id,
          label: project.name,
        })));
      } catch (err) {
        setError(err.message || 'Failed to load projects');
        console.error(err);
      }
    };

    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

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

    if (!selectedProject) {
      alert('Select a project');
      return;
    }

    if (!taskName.trim()) {
      alert('Enter a task name');
      return;
    }

    try {
      await request(`/api/projects/${selectedProject.value}/time-entries`, 'POST', {
        name: taskName.trim(),
        duration: totalSeconds,
      });

      alert('Time entry saved successfully!');
      onReset();
      setTaskName('')
      setSelectedProject(null);
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
          : <div className={styles['timer__project-controls']}>
              <Select
                options={projectsOptions}
                isSearchable
                placeholder="Choose a project..."
                className={styles['timer__project-select']}
                value={selectedProject}
                onChange={setSelectedProject}
                />

              <TextInput placeholder="Name the current task..." value={taskName} onChange={(event) => setTaskName(event.target.value)} />
            </div>
        }
      </AuthWrapper>
    </div>
  );
};
