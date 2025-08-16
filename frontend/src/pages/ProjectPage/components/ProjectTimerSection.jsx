import { Timer } from "../../../components";
import styles from "../project-page.module.scss";

export const ProjectTimerSection = ({ projectId, onTaskSave }) => {
  return (
    <div className={styles['timer-wrapper']}>
      <h2 className="h2">Start tracking time</h2>
      <Timer projectId={projectId} onSaveCallback={onTaskSave} />
    </div>
  );
};
