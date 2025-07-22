import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Error fetching tasks');
    }
  };

  useEffect(() => {
    // Get username from JWT
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError('All fields are required');
      return;
    }
    try {
      if (editId) {
        await API.put(`/tasks/${editId}`, { title, description, status });
        setEditId(null);
      } else {
        await API.post('/tasks', { title, description, status });
      }
      fetchTasks();
      setTitle('');
      setDescription('');
      setStatus('To Do');
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Error saving task');
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-300">
      <div className="flex items-center justify-between mb-4 ">
        <h1 className="text-lg font-semibold text-gray-800">Welcome, {username}</h1>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-white transition-colors bg-red-500 rounded hover:bg-red-600 hover:cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div className="max-w-2xl p-6 mx-auto bg-white border border-black rounded-lg shadow">
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-800 ">Task Manager Application</h2>
        {error && <p className="mb-2 text-sm text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          ></textarea>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button
            type="submit"
            className={`w-full px-4 py-2 font-semibold text-white transition-colors rounded ${
              editId ? 'bg-green-600 hover:bg-green-800 hover:cursor-pointer' : 'bg-blue-600 hover:bg-blue-800 hover:cursor-pointer'
            }`}
          >
            {editId ? 'Update Task' : 'Add Task'}
          </button>
        </form>
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
             <p className="text-gray-600">{task.description}</p>
<p className="mt-1 text-xs text-gray-500">Created: {new Date(task.createdAt).toLocaleString()}</p>

              <span className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                task.status === 'Completed'
                  ? 'bg-green-200 text-green-800'
                  : task.status === 'In Progress'
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-gray-200 text-gray-800'
              }`}>
                {task.status}
              </span>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="px-3 py-1 text-sm text-white transition-colors bg-green-500 rounded hover:bg-green-600 hover:cursor-pointer"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="px-3 py-1 text-sm text-white transition-colors bg-red-500 rounded hover:bg-red-600 hover:cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
