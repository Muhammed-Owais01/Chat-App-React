import { useEffect, useState } from "react";
import { User } from "../react-app-env";
import getCookie from "../utils/getCookie";
import FriendsList from "./FriendsList";
import MessageDetail from "./MessageDetail";
import { useUser } from "../Context/UserContext";

const Home = () => {
    const [friendList, setFriendList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { receiverId } = useUser();

    const fetchData = async () => {
        setIsLoading(true);

        const token = getCookie('token');

        try {
            const result = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Application": "application/json",
                    "Authorization": `${token}`
                },
            });
            const data = await result.json();
            setFriendList(data.users);
            setIsLoading(false);
        } catch (err: unknown) {
            if (err instanceof Error)
                setError(err.message);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])
    

    return ( 
        <div className="flex mt-8 ml-6 h-screen">
            <div className="friend-list-list w-[30%] h-full ml-8 bg-[#f2f7f8]">
                {isLoading && <div>Loading...</div>}
                {error && <div>{error}</div>}
                <h2 className="mb-5 p-5 border-solid border-x-0 border-t-0 border-b border-[#000]">Chats</h2>
                {friendList && <FriendsList users={friendList} />}
            </div>
            <div className="flex w-[70%] h-full ml-5">
                {receiverId && <MessageDetail key={receiverId} />}
            </div>
        </div>
     );
}
 
export default Home;