import { useState } from "react";
import { request } from "../../../../utils/request";
import { useNavigate } from "react-router-dom";
import { IconButton } from "../../../../ui";
import styles from '../../project-page.module.scss';

export const NewProject = () => {
  const [editedTitle, setEditedTitle] = useState('New Project');
  const [editingError, setEditingError] = useState('');
  const navigate = useNavigate();

  const onTitleSave = async () => {
    try {
      let updatedProject = null;

      updatedProject = await request('/api/projects', 'POST', {name: editedTitle});

      if (updatedProject.error) {
        console.log(updatedProject.error);
        setEditingError(updatedProject.error || 'Failed to&nbsp;update project');
      } else {
        setTimeout(() => {
          navigate(`/projects/${updatedProject.data.id}`, {replace: true});
        }, 1000);
      }
    } catch(error) {
      console.log(error);
      setEditingError(error.message || 'Failed to&nbsp;update project');
    }
  };

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
            <IconButton id="times" size="md" title="Cancel" onClick={() => navigate('/projects')} />
          </div>
        </div>
        {
          editingError && <div className="list__item-error">{editingError}</div>
        }
      </div>
    </div>
  );
}
