import React from 'react';
import './BossHealthBar.scss';

interface BossHealthBarProps {
    healthPoints: number;
    maxHealthPoints: number;
}

const BossHealthBar: React.FC<BossHealthBarProps> = ({ healthPoints, maxHealthPoints }) => {
    const healthPercentage = (healthPoints / maxHealthPoints) * 100;

    return (
        <div className="boss-health-bar">
            <div className="boss-health-bar-inner" style={{ width: `${healthPercentage}%` }}></div>
            <span className="boss-health-bar-text">{healthPoints}/{maxHealthPoints}</span>
        </div>
    );
};

export default BossHealthBar;