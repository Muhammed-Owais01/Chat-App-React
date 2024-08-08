import { useEffect, useRef, useState } from "react";
import { Message } from "../react-app-env";
import { useUser } from "../Context/UserContext";
import getCookie from "../utils/getCookie";
import { io, Socket } from 'socket.io-client'

const MessageDetail = () => {
    const RESULTS_PER_PAGE: number = 20;

    const [textMessage, setTextMessage] = useState<string>("");
    const [fetchedMessages, setFetchedMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [usernameError , setUsernameError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [userId, setUserId] = useState<number>(0);
    const [receiverName, setReceiverName] = useState<string>("Friend");
    const [senderName, setSenderName] = useState<string>("User")
    const { receiverId } = useUser();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const fetchState = useRef<boolean>(true);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io(`${process.env.REACT_APP_API_URL}`);
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('authenticate', userId);
        });

        socket.on('chat_message', (message: Message) => {
            setFetchedMessages(prev => [...prev, message]);
        })

        return () => {
            socket.disconnect();
        }

    }, [receiverId])

    useEffect(() => {
        const cookieUserId = getCookie('userId');
        if (cookieUserId) {
            const parsedUserId = parseInt(cookieUserId);
            if (!isNaN(parsedUserId)) {
                setUserId(parsedUserId);
            }
        }
    }, []);

    useEffect(() => {
        const fetchNames = async () => {
            if (receiverId && userId) {
                const fetchedReceiverName = await fetchUsername(receiverId);
                setReceiverName(fetchedReceiverName);

                const fetchedSenderName = await fetchUsername(userId);
                setSenderName(fetchedSenderName);
            }
        };
        fetchNames();
    }, [receiverId, userId]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [textMessage])

    const fetchMessages = async () => {
        const token = getCookie('token');

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/message/${receiverId}?page=${page}&limit=${RESULTS_PER_PAGE}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}` 
                }
            });
            const { count, messages }: { count: number, messages: Message[] } = await res.json();

            if (messages) {
                setFetchedMessages(prev => [...prev, ...messages]);
                setError(null);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
    }

    useEffect(() => {
        if (fetchState.current) {
            fetchState.current = false;
            return;
        }
        fetchMessages();
    }, [page]);

    const fetchUsername = async (id: number) => {
        try {
            const result = await fetch(`${process.env.REACT_APP_API_URL}/user/${id}`);
            if (!result) throw new Error("User not found");

            const { username }: { username: string } = await result.json();
            setUsernameError(null);
            return username;
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message.includes("User not found")) {
                    setUsernameError("Could not find username");
                }
            }
            return "User";
        }
    }

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        
        const msg = {
            content: textMessage,
            userId: userId!,
            receiverId: receiverId!
        }

        if (socketRef.current) {
            socketRef.current.emit('chat message', msg);
            setTextMessage("");
        }
    }

    return ( 
        <div className="flex flex-col w-full">
            <div className="mb-7 p-4">
                <h2>{receiverName}</h2>
            </div>
            {fetchedMessages && fetchedMessages.map(message => (
                <div key={message.id} className="mb-4">
                    <div>
                        <p><span className="text-[20px] font-bold">{message.userId === userId ? senderName : receiverName }</span>: {message.content}</p>
                    </div>
                </div>
            ))}
            <form onSubmit={sendMessage} className="mt-auto mb-10 w-full">
                <textarea 
                    value={textMessage}
                    onChange={e => setTextMessage(e.target.value)}
                    className="w-[80%] h-24"
                />
                <button type="submit">Send</button>
            </form>
        </div>
     );
}
 
export default MessageDetail;