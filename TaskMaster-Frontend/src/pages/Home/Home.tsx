import { useState, useEffect } from 'react';
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import StatsModal from "../../components/StatsModal/StatsModal";
import TaskList from "../../components/TaskList/TaskList";
import ShopModal from "../../components/ShopModal/ShopModal";
import BossBattle from "../../components/BossBattle/BossBattle";
import CharacterLevel from "../../components/CharacterLevel/CharacterLevel";
import HowToPlayModal from "../../components/HowToPlayModal/HowToPlayModal";
import axios from '../../../axiosConfig';
import './Home.scss';

interface Equipment {
    _id: string;
    name: string;
    type: string;
    damageBoost: number;
    cost: number;
    requiredLevel: number;
}

interface Character {
    userId: string;
    username: string;
    level: number;
    experience: number;
    gold: number;
    attackChances: number;
    attackDamage: number;
    equipment: Equipment[];
}

export function Home() {
    const [refreshStats, setRefreshStats] = useState(false);
    const [character, setCharacter] = useState<Character | null>(null);
    const [isShopModalOpen, setIsShopModalOpen] = useState<boolean>(false);
    const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
    const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState<boolean>(false);

    const triggerStatsRefresh = () => {
        setRefreshStats(!refreshStats);
    };

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
    }, [refreshStats]);

    const openShopModal = () => {
        setIsShopModalOpen(true);
    };

    const closeShopModal = () => {
        setIsShopModalOpen(false);
    };

    const openStatsModal = () => {
        setIsStatsModalOpen(true);
    };

    const closeStatsModal = () => {
        setIsStatsModalOpen(false);
    };

    const openHowToPlayModal = () => {
        setIsHowToPlayModalOpen(true);
    };

    const closeHowToPlayModal = () => {
        setIsHowToPlayModalOpen(false);
    };

    return (
        <div className="home__container">
            <div className="home__top-bar">
                <img
                    src="/assets/images/character.png"
                    alt="Character"
                    className="home__image--character"
                    onClick={openStatsModal}
                />
                {isStatsModalOpen && <StatsModal onClose={closeStatsModal} character={character} />}
                <div className="home__top-bar--middle">
                    {character && <CharacterLevel character={character} />}
                    <img
                        src="/assets/images/question.png"
                        alt="How to Play"
                        className="home__image--how-to-play"
                        onClick={openHowToPlayModal}
                    />
                    {isHowToPlayModalOpen && <HowToPlayModal onClose={closeHowToPlayModal} />}
                </div>
                <img
                    src="/assets/images/shop.png"
                    alt="Shop"
                    className="home__image--shop"
                    onClick={openShopModal}
                />
                {isShopModalOpen && <ShopModal onClose={closeShopModal} onPurchase={triggerStatsRefresh} />}
            </div>
            <BossBattle refreshStats={triggerStatsRefresh} character={character} />
            <TaskList onTaskComplete={triggerStatsRefresh} />
            <LogoutButton />
        </div>
    );
}