import React, { useState, useEffect } from "react";
import './Dashboard.css';
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useParams, useNavigate } from 'react-router-dom';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [activePage, setActivePage] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModal, setDeleteModal] = useState({ show: false, taskId: null });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const API_URL = "http://127.0.0.1:8000/api/tasks/";
    const { username } = useParams();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        const loggedInUser = localStorage.getItem('user');

        if (!token) {
            navigate('/login');
            return;
        }

        if (loggedInUser !== username) {
            navigate(`/${loggedInUser}/dashboard`);
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [username]);

    const handlePageChange = (page) => {
        setActivePage(page);
        setIsMenuOpen(false);
    };

    const handleAddTask = async (taskData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(taskData)
            });

            if (response.ok) {
                const newTask = await response.json();
                setTasks([newTask, ...tasks]);
                setShowForm(false);
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const toggleComplete = async (id) => {
        const token = localStorage.getItem('token');
        const targetTask = tasks.find(t => t.id === id);
        if (!targetTask) return;

        try {
            const response = await fetch(`${API_URL}${id}/`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ is_completed: !targetTask.is_completed })
            });

            if (response.ok) {
                const updatedTask = await response.json();
                setTasks(tasks.map(task => task.id === id ? updatedTask : task));
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const confirmDelete = (id) => {
        setDeleteModal({ show: true, taskId: id });
    };

    const handleDeleteTask = async () => {
        const id = deleteModal.taskId;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_URL}${id}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Token ${token}`
                }
            });

            if (response.ok) {
                setTasks(tasks.filter(task => task.id !== id));
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        } finally {
            setDeleteModal({ show: false, taskId: null });
        }
    };

    const getFilteredTasks = () => {
        let filtered = tasks;
        if (activePage === 'pending') filtered = tasks.filter(t => !t.is_completed);
        if (activePage === 'completed') filtered = tasks.filter(t => t.is_completed);

        if (searchQuery.trim() !== '') {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        return filtered;
    };

    return (
        <div className="main">
            <div className={`slide ${isMenuOpen ? 'active' : ''}`}>
                <button className="close-menu-btn" onClick={() => setIsMenuOpen(false)}>
                    <i className="bi bi-x-lg"></i>
                </button>

                <h2>Task Flow</h2>
                <button
                    className={activePage === 'dashboard' ? 'active-link' : ''}
                    onClick={() => handlePageChange('dashboard')}
                >
                    Dashboard
                </button>
                <button
                    className={activePage === 'pending' ? 'active-link' : ''}
                    onClick={() => handlePageChange('pending')}
                >
                    Pending
                </button>
                <button
                    className={activePage === 'completed' ? 'active-link' : ''}
                    onClick={() => handlePageChange('completed')}
                >
                    Completed
                </button>
            </div>

            <div className="main_dash">
                <header className="dash-header">
                    <div className="header-left">
                        <i className="bi bi-list" onClick={() => setIsMenuOpen(true)}></i>
                        <h3>{activePage.toUpperCase()} VIEW</h3>
                    </div>
                    <span className="user-profile" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                        <h3><i className="bi bi-person-circle"></i> {username}</h3>
                        <button className="logout-btn">Logout</button>
                    </span>
                </header>

                <div className="dash-body">
                    <div className="search-container">
                        <i className="bi bi-search search-icon"></i>
                        <input
                            type="text"
                            placeholder="Search tasks by title or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        {searchQuery && (
                            <i className="bi bi-x-circle-fill clear-icon" onClick={() => setSearchQuery('')}></i>
                        )}
                    </div>

                    <div className="list-container">
                        <div className="tasks-grid">
                            {loading ? (
                                <p className="no-tasks">Loading tasks...</p>
                            ) : getFilteredTasks().length === 0 ? (
                                <p className="no-tasks">NO TASKS AVAILABLE</p>
                            ) : (
                                getFilteredTasks().map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        activePage={activePage}
                                        onToggleComplete={toggleComplete}
                                        onDeleteTask={confirmDelete}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {activePage === 'dashboard' && (
                        <div className="schedule">
                            <button
                                className="click"
                                onClick={() => setShowForm(!showForm)}
                            >
                                Add New Schedule <br />
                                <i className={showForm ? "bi bi-arrow-up-circle-fill" : "bi bi-arrow-down-circle-fill"}></i>
                            </button>

                            <div className={`form-container ${showForm ? "show" : ""}`}>
                                <TaskForm onAddTask={handleAddTask} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {deleteModal.show && (
                <div className="modal-overlay">
                    <div className="custom-modal animate-pop">
                        <div className="modal-icon">
                            <i className="bi bi-exclamation-triangle-fill"></i>
                        </div>
                        <h3>Delete Task?</h3>
                        <p>Do you really want to delete this task? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setDeleteModal({ show: false, taskId: null })}>
                                Cancel
                            </button>
                            <button className="confirm-btn" onClick={handleDeleteTask}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;