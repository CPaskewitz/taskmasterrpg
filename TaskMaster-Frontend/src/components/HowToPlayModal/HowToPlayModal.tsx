import React from 'react';
import './HowToPlayModal.scss';

interface HowToPlayModalProps {
    onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
    return (
        <div className="how-to-play-modal__overlay">
            <div className="how-to-play-modal">
                <button className="how-to-play-modal__close-button" onClick={onClose}>
                    &times;
                </button>
                <h2 className="how-to-play-modal__header">How to Play</h2>
                <p className="how-to-play-modal__description">
                    Welcome to the RPG Task Manager! Here’s your guide to get started:
                </p>
                <ul className="how-to-play-modal__list">
                    <li className="how-to-play-modal__list-item">Create Daily or General tasks, known as quests, to earn gold and attack chances for completing them.</li>
                    <li className="how-to-play-modal__list-item">Daily Quests will automatically be available each day without needing to recreate them.</li>
                    <li className="how-to-play-modal__list-item">Visit the shop to purchase new gear that will increase your attack power.</li>
                    <li className="how-to-play-modal__list-item">Check your character stats to monitor your progress and see your equipment.</li>
                    <li className="how-to-play-modal__list-item">Defeat bosses to earn experience points and level up your character.</li>
                </ul>
                <p className="how-to-play-modal__description">
                    Dive into your quests, earn rewards, and grow stronger. May your journey be filled with triumph!
                </p>
            </div>
        </div>
    );
};

export default HowToPlayModal;