import React, { useState, useEffect } from 'react';
import axios from '../../../axiosConfig';
import './BossBattle.scss';

interface Boss {
    _id: string;
    level: number;
    healthPoints: number;
    maxHealthPoints: number;
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
    character: Character | null;
}

const BossBattle: React.FC<BossBattleProps> = ({ refreshStats, character }) => {
    const [boss, setBoss] = useState<Boss | null>(null);
    const [rewards, setRewards] = useState<{ gold: number; exp: number; levelUp: boolean; newLevel?: number } | null>(null);
    const token = localStorage.getItem('token');

    const fetchBoss = async () => {
        try {
            const bossResponse = await axios.get('/api/boss', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBoss(bossResponse.data);
        } catch (error: any) {
            console.error('Error fetching boss:', error.response?.data || error.message);
            alert('Failed to fetch boss');
        }
    };

    useEffect(() => {
        fetchBoss();
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
                    setRewards({
                        gold: boss.rewardGold,
                        exp: boss.rewardExp,
                        levelUp: attackResponse.data.levelUp,
                        newLevel: attackResponse.data.levelUp ? character.level + 1 : character.level
                    });

                    await axios.post('/api/boss/new', {}, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    fetchBoss();
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

    const healthPercentage = (boss.healthPoints / boss.maxHealthPoints) * 100;

    return (
        <div className="boss-battle">
            <h2 className="boss-battle__header">Boss Battle</h2>
            <div className="boss-battle__boss-info">
                <p className="boss-battle__boss-level">Level: {boss.level}</p>
                <div className="boss-battle__boss-health-bar">
                    <div className="boss-battle__boss-health-bar-inner" style={{ width: `${healthPercentage}%` }}>
                        {boss.healthPoints}/{boss.maxHealthPoints}
                    </div>
                </div>
            </div>
            <div className="boss-battle__action">
                <button
                    className="boss-battle__attack-button"
                    onClick={handleAttack}
                    disabled={character.attackChances <= 0}
                >
                    Attack Boss
                </button>
                <p className="boss-battle__attack-chances">Attack Chances: {character.attackChances}</p>
            </div>
            {character.attackChances <= 0 && <p className="boss-battle__no-chances">No attack chances left!</p>}
            {rewards && (
                <div className="boss-battle__rewards">
                    <p>Gold Earned: {rewards.gold}</p>
                    <p>Experience Gained: {rewards.exp}</p>
                    {rewards.levelUp && (
                        <p>Congratulations! You leveled up to level {rewards.newLevel} and increased your attack damage by 1!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default BossBattle;