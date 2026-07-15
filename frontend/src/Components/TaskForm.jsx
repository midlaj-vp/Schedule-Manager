import React, { useState } from 'react';
import './TAskForm.css';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({ title, description, date, time, priority });

    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setPriority('Medium');
  };

  return (
    <div className="task-form-section">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="enter the program title"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter the Description"
          />
        </div>
        
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)} 
            required
          />
        </div>
        
        <div className="form-group">
          <label>Time</label>
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)}
            required 
          />
        </div>
        
        <button type="submit" className="add-btn">Schedule Task</button>
      </form>
    </div>
  );
}

export default TaskForm;