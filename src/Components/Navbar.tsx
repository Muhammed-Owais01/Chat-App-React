import { Link } from "react-router-dom";

const Navbar = () => {
    return ( 
        <div className="h-full w-12 fixed top-0 left-0">
            <div className="absolute">
                <Link className="relative bottom-0" to="" >User</Link>
            </div>
        </div>
     );
}
 
export default Navbar;