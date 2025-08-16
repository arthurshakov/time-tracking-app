import { IconButton } from "../../../ui";
import { getTimeFromSeconds } from "../../../utils";
import styles from "../project-page.module.scss";

export const ProjectHeader = ({
  title,
  editedTitle,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  duration,
  editingError,
}) => {
  return (
    <div className="page__top">
      {isEditing ? (
        <div className={styles['title-wrapper']}>
          <input
            type="text"
            className={`h1 ${styles['title-input']}`}
            value={editedTitle}
            onChange={(e) => onEdit(e.target.value)}
            autoFocus
          />
          <div className="list__item-buttons">
            <IconButton id="check" size="md" title="Save" onClick={onSave} />
            <IconButton id="times" size="md" title="Cancel" onClick={onCancel} />
          </div>
        </div>
      ) : (
        <div className={styles['title-wrapper']}>
          <h1 className="h1">{title}</h1>
          <div className="list__item-buttons">
            <IconButton id="edit" size="md" title="Edit" onClick={onEdit} />
            <IconButton id="trash-o" size="md" title="Delete" onClick={onDelete} />
          </div>
        </div>
      )}
      {editingError && <div className="list__item-error" dangerouslySetInnerHTML={{ __html: editingError }} />}
      <div className="h3">Total duration: {getTimeFromSeconds(duration)}</div>
    </div>
  );
};
