import React, { useState, useEffect } from 'react';
import axios from '../../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import './TaskList.scss';

interface Task {
    _id: string;
    description: string;
    estimatedTime: number;
    countdown: number;
    completed: boolean;
    type: 'daily' | 'general';
}

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [description, setDescription] = useState('');
    const [estimatedTime, setEstimatedTime] = useState(0);
    const [taskType, setTaskType] = useState<'daily' | 'general'>('general');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchTasks = async () => {
            try {
                const response = await axios.get('/api/tasks', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTasks(response.data);
            } catch (error: any) {
                console.error('Error fetching tasks:', error.response?.data || error.message);
                alert('Failed to fetch tasks');
            }
        };

        fetchTasks();
    }, [token, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newTask = {
            description,
            estimatedTime,
            type: taskType,
        };

        try {
            const response = await axios.post('/api/tasks', newTask, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks([...tasks, response.data]);
            setDescription('');
            setEstimatedTime(0);
        } catch (error: any) {
            console.error('Error creating task:', error.response?.data || error.message);
            alert('Failed to create task');
        }
    };

    const handleCompleteTask = async (id: string) => {
        try {
            const response = await axios.put(`/api/tasks/${id}`, { completed: true }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks(tasks.map(task => (task._id === id ? response.data : task)));
        } catch (error: any) {
            console.error('Error completing task:', error.response?.data || error.message);
            alert('Failed to complete task');
        }
    };

    return (
        <div className="task-list">
            <h2>Task List</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Estimated Time (minutes)</label>
                    <input
                        type="number"
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(Number(e.target.value))}
                        required
                    />
                </div>
                <div>
                    <label>Task Type</label>
                    <select value={taskType} onChange={(e) => setTaskType(e.target.value as 'daily' | 'general')}>
                        <option value="general">General</option>
                        <option value="daily">Daily</option>
                    </select>
                </div>
                <button type="submit">Add Task</button>
            </form>
            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>
                        <span>{task.description}</span>
                        <span>{task.countdown} minutes left</span>
                        <button
                            onClick={() => handleCompleteTask(task._id)}
                            disabled={task.countdown > 0 || task.completed}
                        >
                            {task.completed ? 'Completed' : 'Complete Task'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;