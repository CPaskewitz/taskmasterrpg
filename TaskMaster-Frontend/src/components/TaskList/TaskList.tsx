import React, { useState, useEffect } from 'react';
import axios from '../../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import DailyTasks from '../DailyTasks/DailyTasks';
import GeneralTasks from '../GeneralTasks/GeneralTasks';
import './TaskList.scss';

interface Task {
    _id: string;
    description: string;
    estimatedTime: number;
    countdown: number;
    completed: boolean;
    type: 'daily' | 'general';
}

interface TaskListProps {
    onTaskComplete: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ onTaskComplete }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [description, setDescription] = useState('');
    const [estimatedTime, setEstimatedTime] = useState(1);
    const [taskType, setTaskType] = useState<'daily' | 'general'>('general');
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const timeOptions = [
        1, 5, 10, 15, 30, 45,
        60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360
    ];

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
            setEstimatedTime(1);
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
            onTaskComplete();
        } catch (error: any) {
            console.error('Error completing task:', error.response?.data || error.message);
            alert('Failed to complete task');
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await axios.delete(`/api/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error: any) {
            console.error('Error deleting task:', error.response?.data || error.message);
            alert('Failed to delete task');
        }
    };

    const updateCountdown = () => {
        setTasks(tasks.map(task => {
            if (task.countdown > 0) {
                return { ...task, countdown: task.countdown - 1 };
            }
            return task;
        }));
    };

    useEffect(() => {
        const interval = setInterval(updateCountdown, 60000);
        return () => clearInterval(interval);
    }, [tasks]);

    return (
        <div className="task-list">
            <h2>Quest List</h2>
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Hide Form' : 'Show Form'}
            </button>
            {showForm && (
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
                        <label>Estimated Time</label>
                        <select
                            value={estimatedTime}
                            onChange={(e) => setEstimatedTime(Number(e.target.value))}
                            required
                        >
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {time < 60 ? `${time} min` : `${Math.floor(time / 60)} hour${time >= 120 ? 's' : ''} ${time % 60 ? `${time % 60} min` : ''}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Task Type</label>
                        <select value={taskType} onChange={(e) => setTaskType(e.target.value as 'daily' | 'general')}>
                            <option value="general">General</option>
                            <option value="daily">Daily</option>
                        </select>
                    </div>
                    <button type="submit">Add Quest</button>
                </form>
            )}
            <DailyTasks tasks={tasks} onComplete={handleCompleteTask} onDelete={handleDeleteTask} />
            <GeneralTasks tasks={tasks} onComplete={handleCompleteTask} onDelete={handleDeleteTask} />
        </div>
    );
};

export default TaskList;