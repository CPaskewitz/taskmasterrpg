import { useState, useEffect } from 'react';
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import Stats from "../../components/Stats/Stats";
import TaskList from "../../components/TaskList/TaskList";
import Shop from "../../components/Shop/Shop";
import BossBattle from "../../components/BossBattle/BossBattle";
import axios from '../../../axiosConfig';

export function Home() {
    const [refreshStats, setRefreshStats] = useState(false);
    const [character, setCharacter] = useState(null);

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

    return (
        <>
            <LogoutButton />
            <BossBattle refreshStats={triggerStatsRefresh} character={character} />
            <Stats refresh={refreshStats} character={character} />
            <TaskList onTaskComplete={triggerStatsRefresh} />
            <Shop onPurchase={triggerStatsRefresh} />
        </>
    );
}