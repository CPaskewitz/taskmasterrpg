import React from 'react';
import './StatsModal.scss';

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

interface StatsModalProps {
    character: Character | null;
    onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ character, onClose }) => {
    if (!character) {
        return <div className="stats-modal__loading">Loading...</div>;
    }

    const getEquipmentByType = (type: string) => {
        return character.equipment.find(item => item.type === type);
    };

    const getEquipmentIcon = (type: string) => {
        switch (type) {
            case 'weapon':
                return '/assets/images/weapon.png';
            case 'armor':
                return '/assets/images/armor.png';
            case 'boots':
                return '/assets/images/boots.png';
            case 'gloves':
                return '/assets/images/gloves.png';
            default:
                return '';
        }
    };

    const renderEquipmentItem = (type: string) => {
        const item = getEquipmentByType(type);
        return (
            <div className="stats-modal__equipment-category" key={type}>
                <img
                    src={getEquipmentIcon(type)}
                    alt={type}
                    className="stats-modal__equipment-icon"
                />
                {item ? (
                    <span className="stats-modal__equipment-item" title={`Attack Damage +${item.damageBoost}`}>
                        {item.name}
                    </span>
                ) : (
                    <span className="stats-modal__equipment-item">None</span>
                )}
            </div>
        );
    };

    return (
        <div className="stats-modal__overlay">
            <div className="stats-modal">
                <button className="stats-modal__close-button" onClick={onClose}>
                    &times;
                </button>
                <h2 className="stats-modal__header">Character Stats</h2>
                <div className="stats-modal__item">Level: <span className="stats-modal__value">{character.level}</span></div>
                <div className="stats-modal__item">Experience: <span className="stats-modal__value">{character.experience}</span></div>
                <div className="stats-modal__item">Gold: <span className="stats-modal__value">{character.gold}</span></div>
                <div className="stats-modal__item">Attack Chances: <span className="stats-modal__value">{character.attackChances}</span></div>
                <div className="stats-modal__item">Attack Damage: <span className="stats-modal__value">{character.attackDamage}</span></div>
                <div className="stats-modal__equipment">
                    <h3 className="stats-modal__equipment-header">Equipment:</h3>
                    <div className="stats-modal__equipment-list">
                        {renderEquipmentItem('weapon')}
                        {renderEquipmentItem('armor')}
                        {renderEquipmentItem('gloves')}
                        {renderEquipmentItem('boots')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsModal;