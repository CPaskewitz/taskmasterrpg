import { useState } from 'react';
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import Stats from "../../components/Stats/Stats";
import TaskList from "../../components/TaskList/TaskList";

export function Home() {
    const [refreshStats, setRefreshStats] = useState(false);

    const triggerStatsRefresh = () => {
        setRefreshStats(!refreshStats);
    };

    return (
        <>
            <LogoutButton />
            <Stats refresh={refreshStats} />
            <TaskList onTaskComplete={triggerStatsRefresh} />
        </>
    )
}