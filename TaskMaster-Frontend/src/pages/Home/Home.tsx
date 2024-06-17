import { useState } from 'react';
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import Stats from "../../components/Stats/Stats";
import TaskList from "../../components/TaskList/TaskList";
import Shop from "../../components/Shop/Shop";
import BossBattle from '../../components/BossBattle/BossBattle';

export function Home() {
    const [refreshStats, setRefreshStats] = useState(false);

    const triggerStatsRefresh = () => {
        setRefreshStats(!refreshStats);
    };

    return (
        <>
            <LogoutButton />
            <BossBattle refreshStats={triggerStatsRefresh} />
            <Stats refresh={refreshStats} />
            <TaskList onTaskComplete={triggerStatsRefresh} />
            <Shop onPurchase={triggerStatsRefresh} />
        </>
    );
}