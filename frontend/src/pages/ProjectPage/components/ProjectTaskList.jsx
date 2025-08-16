import { ListItem } from "../../../components";
import styles from "../project-page.module.scss";

export const ProjectTaskList = ({ timeEntries, projectId, onTaskDelete }) => {
  return (
    <>
      <div className={styles['task__list-top']}>
        <h2 className="h2">Done tasks</h2>
      </div>

      <div className="list">
        {
          timeEntries.length
          ? timeEntries.map(({id, name, duration, createdAt}) => (
            <ListItem
              id={id}
              name={name}
              duration={duration}
              createdAt={createdAt}
              key={id}
              endpoint={`/api/projects/${projectId}/time-entries/${id}`}
              onRemoveFromList={onTaskDelete}
            />
          ))

          : <div>At this moment there are no tasks to show in this project</div>
        }
      </div>
    </>
  );
};
