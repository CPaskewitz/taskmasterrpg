import React from 'react';
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
    character: Character | null;
}

const Stats: React.FC<StatsProps> = ({ character }) => {
    if (!character) {
        return <div className="stats__loading">Loading...</div>;
    }

    const getEquipmentByType = (type: string) => {
        return character.equipment.find(item => item.type === type);
    };

    const renderEquipmentItem = (type: string, label: string) => {
        const item = getEquipmentByType(type);
        return (
            <div className="stats__equipment-category" key={type}>
                <span className="stats__equipment-type">{label}:</span>
                {item ? (
                    <span className="stats__equipment-item" title={`Attack Damage +${item.damageBoost}`}>
                        {item.name}
                    </span>
                ) : (
                    <span className="stats__equipment-item">None</span>
                )}
            </div>
        );
    };

    return (
        <div className="stats">
            <h2 className="stats__header">Character Stats</h2>
            <div className="stats__item">Level: <span className="stats__value">{character.level}</span></div>
            <div className="stats__item">Experience: <span className="stats__value">{character.experience}</span></div>
            <div className="stats__item">Gold: <span className="stats__value">{character.gold}</span></div>
            <div className="stats__item">Attack Chances: <span className="stats__value">{character.attackChances}</span></div>
            <div className="stats__item">Attack Damage: <span className="stats__value">{character.attackDamage}</span></div>
            <div className="stats__equipment">
                <h3 className="stats__equipment-header">Equipment:</h3>
                <div className="stats__equipment-list">
                    {renderEquipmentItem('weapon', 'Weapon')}
                    {renderEquipmentItem('armor', 'Armor')}
                    {renderEquipmentItem('gloves', 'Gloves')}
                    {renderEquipmentItem('boots', 'Boots')}
                </div>
            </div>
        </div>
    );
};

export default Stats;