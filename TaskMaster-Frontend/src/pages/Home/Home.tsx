import { useState, useEffect } from 'react';
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import StatsModal from "../../components/StatsModal/StatsModal";
import TaskList from "../../components/TaskList/TaskList";
import ShopModal from "../../components/ShopModal/ShopModal";
import BossBattle from "../../components/BossBattle/BossBattle";
import CharacterLevel from "../../components/CharacterLevel/CharacterLevel";
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
    const [isShopModalOpen, setIsShopModalOpen] = useState<boolean>(false); // State for shop modal visibility
    const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false); // State for stats modal visibility

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

    return (
        <div className="home__container">
            <div className="home__top-bar">
                <img
                    src="/assets/images/character.png"
                    alt="Character"
                    className="character__image"
                    onClick={openStatsModal}
                />
                {isStatsModalOpen && <StatsModal onClose={closeStatsModal} character={character} />}
                {character && <CharacterLevel character={character} />}
                <img
                    src="/assets/images/shop.png"
                    alt="Shop"
                    className="shop__image"
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