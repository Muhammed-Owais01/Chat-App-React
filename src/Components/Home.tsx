import { useEffect, useState } from "react";
import { User } from "../react-app-env";
import getCookie from "../utils/getCookie";
import FriendsList from "./FriendsList";
import MessageDetail from "./MessageDetail";
import { useUser } from "../Context/UserContext";
import { usePopUp } from "../Context/PopUpContext";
import { useAuth } from "../Context/AuthContext";
import ChatHeader from "./ChatHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
    const [friendList, setFriendList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [friendName, setFriendName] = useState<string>("");
    const [isLoadingAddFriend, setIsLoadingAddFriend] = useState<boolean>(false);
    const [errorAddFriend, setErrorAddFriend] = useState<string | null>(null);
    const [successAddFriend, setSuccessAddFriend] = useState<string | null>(null);
    const { receiverId } = useUser();
    const { showSettings, setShowSettings, showAddFriend, setShowAddFriend } = usePopUp();
    const { logout } = useAuth();

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
    
    const addFriend = async (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        setIsLoadingAddFriend(true);
        setErrorAddFriend(null);
        setSuccessAddFriend(null);

        const token = getCookie('token');

        try {
            const result = await fetch(`${process.env.REACT_APP_API_URL}/user/username/${friendName}`);
            if (!result.ok) throw Error("User Not Found");

            const user: User = await result.json();
            const friendResult = await fetch(`${process.env.REACT_APP_API_URL}/user/${user.id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Application": "application/json",
                    "Authorization": `${token}`
                }
            }) 
            if (!friendResult.ok) throw Error("Add Error");
            setFriendList(prev => [...prev, user] );
            setSuccessAddFriend(`User ${friendName} Added Successfully`)
            setIsLoadingAddFriend(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setIsLoadingAddFriend(false);
                if (error.message.includes("User Not Found")) {
                    setErrorAddFriend(`Could Not Find User: ${friendName}`);
                } else if (error.message.includes("Add Error")) {
                    setErrorAddFriend(`Could Not Add User: ${friendName}`)
                }
            }
        }
    }

    return ( 
        <div className="flex ml-6 h-screen max-h-screen">
            {showSettings && 
                <div>
                    <div className="fixed inset-0 bg-black opacity-30 z-[1]"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[28rem] z-[1] bg-black">
                        <button onClick={logout} className="absolute text-2xl text-white bg-black">SignOut</button>
                        <button onClick={() => setShowSettings(false)} className="absolute top-0 right-0 text-white bg-black" >X</button>
                    </div>
                </div>
            }
            {showAddFriend &&
                <div>
                    <div className="fixed inset-0 bg-black opacity-30 z-[1]"></div>
                    <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[48rem] h-12 z-[1] rounded-xl border-0">
                        <form onSubmit={addFriend} className="rounded-xl border-0">
                            <input 
                                placeholder="Press Enter To Add A Friend..."
                                type="text" 
                                value={friendName}
                                onChange={e => setFriendName(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addFriend(e);
                                    }
                                }}
                                className="w-[48rem] h-12 rounded-xl text-[30px]"
                            />
                            <button onClick={() => {
                                setShowAddFriend(false)
                                setErrorAddFriend(null);
                                setSuccessAddFriend(null);
                            }} className="absolute top-[32%] right-[-5px] rounded-xl border-0 text-[20px]" >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </form>
                    </div>
                    {isLoadingAddFriend && <div className="absolute top-[18%] left-[30%] bg-transparent text-[25px]">Loading...</div>}
                    {errorAddFriend && <div className="absolute top-[18%] left-[30%] bg-transparent text-red-600 text-[25px]">{errorAddFriend}</div>}
                    {successAddFriend && <div className="absolute top-[18%] left-[30%] bg-transparent text-green-500 text-[25px]">{successAddFriend}</div>}
                </div>
            }

            <div className="friend-list-list w-[30%] h-full ml-16 bg-[#f2f7f8] border-solid border-t-0 border-r border-[#b6c2bf]">
                {isLoading && <div>Loading...</div>}
                {error && <div>{error}</div>}
                <ChatHeader setFriendName={setFriendName} />
                {friendList && <FriendsList users={friendList} />}
            </div>
            <div className="flex w-[70%] h-full">
                {receiverId && <MessageDetail key={receiverId} />}
            </div>
        </div>
     );
}
 
export default Home;