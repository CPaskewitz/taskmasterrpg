import React from 'react';
import '../TaskList/TaskList.scss';

interface Task {
    _id: string;
    description: string;
    estimatedTime: number;
    countdown: number;
    completed: boolean;
    type: 'daily' | 'general';
}

const DailyTasks: React.FC<{ tasks: Task[], onComplete: (id: string) => void, onDelete: (id: string) => void }> = ({ tasks, onComplete, onDelete }) => (
    <div className="task-section">
        <h3>Daily Tasks</h3>
        <ul>
            {tasks.filter(task => task.type === 'daily').map((task) => (
                <li key={task._id}>
                    <span>{task.description}</span>
                    <span>{task.countdown <= 0 ? '0 minutes left' : `${task.countdown} minutes left`}</span>
                    <button
                        onClick={() => onComplete(task._id)}
                        disabled={task.countdown > 0 || task.completed}
                    >
                        {task.completed ? 'Completed' : 'Complete Task'}
                    </button>
                    <button onClick={() => onDelete(task._id)}>Delete</button>
                </li>
            ))}
        </ul>
    </div>
);

export default DailyTasks;