import React, { createContext, useContext, useState } from "react";

interface UserContextType {
    receiverId: number | null,
    setReceiverId: React.Dispatch<React.SetStateAction<number | null>>,
    userId: number | null,
    setUserId: React.Dispatch<React.SetStateAction<number | null>>,
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = ():UserContextType => {
    const context: UserContextType | undefined = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [receiverId, setReceiverId] = useState<number | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    
    return (
        <UserContext.Provider value={{ receiverId, setReceiverId, userId, setUserId }}>
            { children }
        </UserContext.Provider>
    );
}