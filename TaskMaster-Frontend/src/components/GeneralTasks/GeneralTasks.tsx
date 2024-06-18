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

const GeneralTasks: React.FC<{ tasks: Task[], onComplete: (id: string) => void, onDelete: (id: string) => void }> = ({ tasks, onComplete, onDelete }) => (
    <div className="task-section">
        <h3>General Quests</h3>
        <ul>
            {tasks.filter(task => task.type === 'general').map((task) => (
                <li key={task._id}>
                    <span>{task.description}</span>
                    <div className="task__wrapper">
                        <span className='task__countdown'>{task.countdown <= 0 ? '0 min left' : `${task.countdown} min left`}</span>
                        <button
                            className="complete-button"
                            onClick={() => onComplete(task._id)}
                            disabled={task.countdown > 0 || task.completed}
                        >
                            {task.completed ? 'Completed' : 'Complete Task'}
                        </button>
                        <button
                            className="delete-button"
                            onClick={() => onDelete(task._id)}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

export default GeneralTasks;