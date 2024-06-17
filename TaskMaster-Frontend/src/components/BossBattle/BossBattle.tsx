import React, { useState, useEffect } from 'react';
import axios from '../../../axiosConfig';
import './BossBattle.scss';

interface Boss {
    _id: string;
    level: number;
    healthPoints: number;
    rewardExp: number;
    rewardGold: number;
}

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

interface BossBattleProps {
    refreshStats: () => void;
}

const BossBattle: React.FC<BossBattleProps> = ({ refreshStats }) => {
    const [boss, setBoss] = useState<Boss | null>(null);
    const [character, setCharacter] = useState<Character | null>(null);
    const token = localStorage.getItem('token');

    const fetchBossAndCharacter = async () => {
        try {
            const bossResponse = await axios.get('/api/boss', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBoss(bossResponse.data);

            const characterResponse = await axios.get('/api/users/character', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCharacter(characterResponse.data);
        } catch (error: any) {
            console.error('Error fetching boss or character:', error.response?.data || error.message);
            alert('Failed to fetch boss or character');
        }
    };

    useEffect(() => {
        fetchBossAndCharacter();
    }, [token, refreshStats]);

    const handleAttack = async () => {
        if (character && boss) {
            try {
                const attackResponse = await axios.put(`/api/boss/${boss._id}/attack`, {
                    damage: character.attackDamage
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (attackResponse.data.bossDefeated) {
                    alert('Boss defeated! Rewards gained.');
                } else {
                    setBoss({ ...boss, healthPoints: attackResponse.data.healthPoints });
                }
                refreshStats();
            } catch (error: any) {
                console.error('Error attacking boss:', error.response?.data || error.message);
                alert('Failed to attack boss');
            }
        }
    };

    if (!boss || !character) {
        return <div className="boss-battle__loading">Loading...</div>;
    }

    return (
        <div className="boss-battle">
            <h2 className="boss-battle__header">Boss Battle</h2>
            <div className="boss-battle__boss-info">
                <p className="boss-battle__boss-level">Level: {boss.level}</p>
                <p className="boss-battle__boss-health">Health Points: {boss.healthPoints}</p>
            </div>
            <button
                className="boss-battle__attack-button"
                onClick={handleAttack}
                disabled={character.attackChances <= 0}
            >
                Attack Boss
            </button>
            {character.attackChances <= 0 && <p className="boss-battle__no-chances">No attack chances left!</p>}
        </div>
    );
};

export default BossBattle;