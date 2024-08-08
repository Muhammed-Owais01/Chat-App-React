import { Link } from "react-router-dom";
import { FriendListProps, User } from "../react-app-env";
import { useUser } from "../Context/UserContext";

const FriendsList: React.FC<FriendListProps> = ({ users }) => {
    const { setReceiverId } = useUser();

    return ( 
        <div className="">
            {users && users.map(user => (
                <div key={user.id} className="p-4 font-[24px]">
                    <p className="cursor-pointer" onClick={() => setReceiverId(user.id)}>{user.username}</p>
                </div>
            ))}
        </div>
    );
}
 
export default FriendsList;