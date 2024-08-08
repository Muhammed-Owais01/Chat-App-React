import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import getCookie from "../utils/getCookie";

interface AuthContextType {
    isLoggedIn: boolean,
    username: string | null,
    login: (userData: string) => void,
    logout: () => void,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context: AuthContextType | undefined = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {        
        const cookieUsername = getCookie('username');
        const token = getCookie('token');

        if (token && cookieUsername) {
            login(cookieUsername);    
        }
        else {
            setIsLoggedIn(false);
            setUsername(null);
        }
        
    }, [])

    const login = (userData: string) => {
        setIsLoggedIn(true);
        setUsername(userData);
    }
    const logout = () => {
        document.cookie = "token=; path=/;";
        document.cookie = "username=; path=/;";
        document.cookie = "userId=; path=/;";
        setIsLoggedIn(false);
        setUsername(null);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, username }}>
            { children }
        </AuthContext.Provider>
    );
};