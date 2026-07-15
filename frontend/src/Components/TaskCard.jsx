import React from 'react';
import './TaskCard.css';
import "bootstrap-icons/font/bootstrap-icons.css";

function TaskCard({ task, activePage, onToggleComplete, onDeleteTask }) {
  if (!task) return null;

  const formatTime12Hour = (timeString) => {
    if (!timeString) return '';
    const [hourStr, minuteStr] = timeString.split(':');
    let hours = parseInt(hourStr, 10);
    const minutes = minuteStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className={`task-card ${task.is_completed ? 'completed' : ''}`}>
      <div className="task-info">
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <div className="task-date-time">
          <i className="bi bi-calendar"></i>  {task.date}  |  <i className="bi bi-alarm"></i>  {formatTime12Hour(task.time)}
        </div>
      </div>
      <div className="task-actions">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={task.is_completed ? 'done-btn' : 'undo-btn'}
        >
          {task.is_completed ? 'Completed' : 'Mark Done'}
        </button>

        {activePage !== 'dashboard' && (
          <button 
            onClick={() => onDeleteTask(task.id)} 
            className="delete-btn"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskCard;