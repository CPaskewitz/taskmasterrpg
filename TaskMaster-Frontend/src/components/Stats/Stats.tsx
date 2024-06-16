import React, { useState, useEffect } from 'react';
import axios from '../../../axiosConfig';
import './Stats.scss';

interface Character {
    userId: string;
    level: number;
    experience: number;
    gold: number;
    attackChances: number;
    attackDamage: number;
    equipment: Equipment[];
}

interface Equipment {
    _id: string;
    name: string;
    type: string;
    damageBoost: number;
    cost: number;
    requiredLevel: number;
}

interface StatsProps {
    refresh: boolean;
}

const Stats: React.FC<StatsProps> = ({ refresh }) => {
    const [character, setCharacter] = useState<Character | null>(null);

    const fetchCharacter = async () => {
        try {
            const response = await axios.get('/api/users/character', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCharacter(response.data);
        } catch (error: any) {
            console.error('Error fetching character stats:', error.response?.data || error.message);
            alert('Failed to fetch character stats');
        }
    };

    useEffect(() => {
        fetchCharacter();
    }, [refresh]);

    if (!character) {
        return <div className="stats__loading">Loading...</div>;
    }

    return (
        <div className="stats">
            <h2 className="stats__header">Character Stats</h2>
            <div className="stats__item">Level: <span className="stats__value">{character.level}</span></div>
            <div className="stats__item">Experience: <span className="stats__value">{character.experience}</span></div>
            <div className="stats__item">Gold: <span className="stats__value">{character.gold}</span></div>
            <div className="stats__item">Attack Chances: <span className="stats__value">{character.attackChances}</span></div>
            <div className="stats__item">Attack Damage: <span className="stats__value">{character.attackDamage}</span></div>
            <div className="stats__item">
                Equipment:
                <ul className="stats__equipment-list">
                    {character.equipment.map(item => (
                        <li key={item._id} className="stats__equipment-item" title={`Type: ${item.type}, Damage Boost: ${item.damageBoost}`}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Stats;