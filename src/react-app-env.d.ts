/// <reference types="react-scripts" />
export interface User {
    id: number,
    username: string,
}

export interface FriendListProps {
    users: User[],
}

export interface Message {
    id?: number,
    content: string,
    userId: number,
    receiverId: number,
    timestamp?: Date
}