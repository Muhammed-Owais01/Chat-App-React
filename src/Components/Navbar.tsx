import { Link } from "react-router-dom";
import { usePopUp } from "../Context/PopUpContext";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
    const { setShowSettings } = usePopUp();
    const { username } = useAuth();

    return ( 
        <div className="h-full w-24 fixed top-0 left-0 bg-gray-800">
            <div className="flex flex-col justify-between h-full bg-gray-800">
                <div className="relative">
                    {/* Other navbar items can go here */}
                </div>
                <button className="mb-4 text-white text-2xl bg-gray-800 mx-auto cursor-pointer" onClick={() => setShowSettings(true)} >{username}</button>
            </div>
        </div>
     );
}
 
export default Navbar;
