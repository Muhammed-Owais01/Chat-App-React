import { createContext, useContext, useState } from "react";

interface PopUpContextType {
    showSettings: boolean,
    setShowSettings: React.Dispatch<React.SetStateAction<boolean>>,
    showAddFriend: boolean,
    setShowAddFriend: React.Dispatch<React.SetStateAction<boolean>>,
}

const PopUpContext = createContext<PopUpContextType | undefined>(undefined);

export const usePopUp = (): PopUpContextType => {
    const context: PopUpContextType | undefined = useContext(PopUpContext);
    if (context === undefined) {
        throw new Error("usePopUp must be used within a PopUpProvider");
    }
    return context;
}

export const PopUpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [showAddFriend, setShowAddFriend] = useState<boolean>(false);

    return (
        <PopUpContext.Provider value={{ showSettings, setShowSettings, showAddFriend, setShowAddFriend }}>
            { children }
        </PopUpContext.Provider>
    )
}