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

interface GeneralTasksProps {
    tasks: Task[];
    onComplete: (id: string) => void;
    onDelete: (id: string) => void;
    coinReward: { id: string | null, reward: number };
}

const GeneralTasks: React.FC<GeneralTasksProps> = ({ tasks, onComplete, onDelete, coinReward }) => {
    const handleComplete = (id: string) => {
        onComplete(id);
    };

    return (
        <div className="task-section">
            <h3>General Quests</h3>
            <ul className="task-section__list">
                {tasks.filter(task => task.type === 'general').map((task) => (
                    <li key={task._id} className="task-section__item">
                        <span className="task-section__description">{task.description}</span>
                        <div className="task-section__wrapper">
                            <span className="task-section__countdown">{task.countdown <= 0 ? '0 min left' : `${task.countdown} min left`}</span>
                            <button
                                className="task-section__button task-section__button--complete"
                                onClick={() => handleComplete(task._id)}
                                disabled={task.countdown > 0 || task.completed}
                            >
                                {task.completed ? 'Completed' : 'Complete Quest'}
                            </button>
                            {coinReward.id === task._id && (
                                <div className="coin-reward">
                                    <img src="/assets/images/coins.png" alt="Coins" />
                                    <span>+{coinReward.reward}</span>
                                </div>
                            )}
                            <button
                                className="task-section__button task-section__button--delete"
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
};

export default GeneralTasks;