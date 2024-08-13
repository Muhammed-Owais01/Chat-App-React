import { Link } from "react-router-dom";

const Navbar = () => {
    return ( 
        <div className="h-full w-24 fixed top-0 left-0 bg-gray-800">
            <div className="flex flex-col justify-between h-full bg-gray-800">
                <div className="relative">
                    {/* Other navbar items can go here */}
                </div>
                <Link className="mb-4 text-white bg-gray-800 mx-auto" to="" >User</Link>
            </div>
        </div>
     );
}
 
export default Navbar;
