import LogoutButton from "../../components/LogoutButton/LogoutButton";
import TaskList from "../../components/TaskList/TaskList";

export function Home() {

    return (
        <>
            <h1>Home Page</h1>
            <LogoutButton />
            <TaskList />
        </>
    )
}