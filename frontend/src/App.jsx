import { useState, useEffect } from 'react';

// Use environment variable VITE_API_URL or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TASKS_API_URL = `${API_BASE_URL.replace(/\/$/, '')}/api/tasks/`;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks on initial mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(TASKS_API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks (Status: ${response.status})`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch(TASKS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Error adding task:', err);
      setError(err.message);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const response = await fetch(`${TASKS_API_URL}${task.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${TASKS_API_URL}${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1 className="header-title">Task Manager</h1>

      {error && (
        <div className="error-banner">
          ⚠️ {error}. Ensure backend is running at <code>{API_BASE_URL}</code>.
        </div>
      )}

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          className="input-field"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="textarea-field"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        ></textarea>
        <button type="submit" className="btn-primary">
          Add Task
        </button>
      </form>

      <div className="divider"></div>

      {loading ? (
        <div className="empty-state">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">No tasks available. Add one above!</div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
                  {task.title}
                </h3>
              </div>
              {task.description && (
                <p className="task-desc">{task.description}</p>
              )}
              <div className="task-actions">
                <button
                  className={`status-badge ${task.completed ? 'completed' : 'pending'}`}
                  onClick={() => handleToggleComplete(task)}
                >
                  [{task.completed ? 'Completed' : 'Pending'}]
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  [Delete]
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
