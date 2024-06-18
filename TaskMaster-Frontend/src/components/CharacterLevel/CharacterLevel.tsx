import React from 'react';
import './CharacterLevel.scss';

interface Character {
    username: string;
    experience: number;
    level: number;
}

interface CharacterLevelProps {
    character: Character;
}

const CharacterLevel: React.FC<CharacterLevelProps> = ({ character }) => {
    const experienceToLevelUp = 10 * character.level * character.level;
    const experiencePercentage = (character.experience / experienceToLevelUp) * 100;

    return (
        <div className="character-level">
            <div className="character-level__wrapper">
                <h2 className="character-level__username">{character.username}</h2>
                <p className="character-level__level">Level: {character.level}</p>
            </div>
            <div className="character-level__exp-bar">
                <div
                    className="character-level__exp-bar-inner"
                    style={{ width: `${experiencePercentage}%` }}
                />
                <span className="character-level__exp-bar-text">
                    {character.experience}/{experienceToLevelUp}
                </span>
            </div>
        </div>
    );
};

export default CharacterLevel;