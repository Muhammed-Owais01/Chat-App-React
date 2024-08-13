import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPending, setIsPending] = useState(false);
    const { logout } = useAuth();
    const history = useHistory();

    useEffect(() => {
        logout()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = { username, password };
        setIsPending(true);

        try {
            const result = await fetch(`${process.env.REACT_APP_API_URL}/user/signup`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Application": "application/json"
                },
                body: JSON.stringify(user)
            });
            const data = await result.json();
            setIsPending(false);
            history.push('/')
        } catch (err) {
            console.log(err);
            setIsPending(false);
        }
    }

    return ( 
        <div className="login mt-20 mx-auto px-5 pt-8 pb-16 max-w-xs items-center bg-[#a1a1a1] rounded-lg">
            <h2 className="my-6 text-white">SignUp</h2>
            <form onSubmit={handleSubmit}>
                <label className="login-signup-label">Username</label>
                <input 
                    type="text"
                    placeholder="Enter your username..."
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="login-signup-input mb-[28px]"
                />
                <div className="flex flex-col">
                    <label className="login-signup-label">Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter your password..."
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="login-signup-input"
                    />
                </div>
                {!isPending && <button type="submit" className="block mt-3 mx-auto text-white rounded-2xl text-[20px] bg-black font-semibold w-[80%] cursor-pointer">SignUp</button>}
                {isPending && <button className="block mt-3 mx-auto text-white rounded-2xl text-[20px] bg-black font-semibold w-[80%] cursor-pointer">Signing up...</button>}
            </form>
        </div>
     );
}
 
export default SignUp;