import { useState } from "react";
import { request } from "../../utils/request";
import { getTimeFromSeconds } from "../../utils";
import { Link } from "react-router-dom";
import { IconButton } from "../../ui";

export const ListItem = ({id, name, duration, endpoint, onRemoveFromList, link = null}) => {
  const [editingError, setEditingError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [currentName, setCurrentName] = useState(name);

  const onSave = async () => {
    try {
      // const updatedProject = await request(`/api/projects/${id}`, 'PATCH', {name: editedName});
      const updatedProject = await request(endpoint, 'PATCH', {name: editedName});

      if (updatedProject.error) {
        console.log(updatedProject.error);
        setEditedName(currentName);
        setEditingError(updatedProject.error || 'Failed to&nbsp;update project');
      } else {
        setCurrentName(updatedProject.data.name);
        setEditingError('');
      }
    } catch(error) {
      console.log(error);
      setEditingError(error.message || 'Failed to&nbsp;update project');
    } finally {
      setIsEditing(false);
    }
  }

  const onCancel = () => {
    setEditedName(name);
    setIsEditing(false);
  }

  const onDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete "${name}"`);

    if (confirmed) {
      const responseFromRemovingProject = await request(endpoint, 'DELETE');

      if (responseFromRemovingProject.error) {
        console.log(responseFromRemovingProject.error);
      } else {
        onRemoveFromList(id);
      }
    }
  }

  return (
    <>
      <div className="list__item">
        <div className="list__item-info">
          {
            isEditing ?
              <input
                className="list__item-input"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            : link
              ?
                <Link
                  to={`/projects/${id}`}
                  className="text-link"
                >{currentName}</Link>
              :
                <div>{currentName}</div>
          }

          <div>{getTimeFromSeconds(duration)}</div>
        </div>
        <div className="list__item-buttons">
          {isEditing ? (
            <>
              <IconButton id="check" size="md" title="Save" onClick={onSave} />
              <IconButton id="times" size="md" title="Cancel" onClick={onCancel} />
            </>
          ) : (
            <>
              <IconButton id="edit" size="md" title="Edit" onClick={() => setIsEditing(true)} />
              <IconButton id="trash-o" size="md" title="Delete" onClick={() => onDelete(id)} />
            </>
          )}
        </div>
      </div>
      {
        editingError && <div className="list__item-error">{editingError}</div>
      }
    </>
  );
};
