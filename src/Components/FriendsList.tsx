import { Link } from "react-router-dom";
import { FriendListProps, User } from "../react-app-env";
import { useUser } from "../Context/UserContext";

const FriendsList: React.FC<FriendListProps> = ({ users }) => {
    const { setReceiverId } = useUser();

    return ( 
        <div className="">
            {users && users.map(user => (
                <div key={user.id} className="p-4 text-[20px] pl-7">
                    <p className="cursor-pointer font-lato" onClick={() => setReceiverId(user.id)}>{user.username}</p>
                </div>
            ))}
        </div>
    );
}
 
export default FriendsList;