import { faMagnifyingGlass, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePopUp } from "../Context/PopUpContext";

interface ChatHeaderProps {
    setFriendName: React.Dispatch<React.SetStateAction<string>>,
}

const ChatHeader = ({ setFriendName }: ChatHeaderProps) => {
    const { setShowAddFriend } = usePopUp();

    return ( 
        <div>
            <h2 className="relative mb-5 p-5 ml-[5px] border-solid border-x-0 border-t-0 border-b border-[#b6c2bf] font-sans">
                Chats
                <FontAwesomeIcon icon={faUserPlus} className="absolute right-16 cursor-pointer" onClick={() => {
                    setShowAddFriend(true);
                    setFriendName("");
                }}  />
                <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-6" />
            </h2>
        </div>
     );
}
 
export default ChatHeader;