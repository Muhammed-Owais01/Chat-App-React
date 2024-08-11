import { useCallback, useEffect, useRef, useState } from "react";
import { Message } from "../react-app-env";
import { useUser } from "../Context/UserContext";
import getCookie from "../utils/getCookie";
import { io, Socket } from 'socket.io-client';

const MessageDetail = () => {
    const RESULTS_PER_PAGE: number = 10;

    const [textMessage, setTextMessage] = useState<string>("");
    const [fetchedMessages, setFetchedMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [userId, setUserId] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
    const [receiverName, setReceiverName] = useState<string>("Friend");
    const [senderName, setSenderName] = useState<string>("User");
    const { receiverId } = useUser();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const fetchState = useRef<boolean>(true);
    const socketRef = useRef<Socket | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const chatRef = useRef<HTMLDivElement | null>(null);

    const lastPostElementRef = useCallback((node: HTMLElement | null) => {
        if (!node || isLoading || !hasMoreMessages) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage(prevPage => prevPage + 1);
            }
        }, {
            root: chatRef.current,
            rootMargin: "0px",
            threshold: 1.0,
        });
        observer.current.observe(node);
    }, [isLoading]);

    useEffect(() => {
        const socket = io(`${process.env.REACT_APP_API_URL}`);
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('authenticate', userId);
        });

        socket.on('chat_message', (message: Message) => {
            setFetchedMessages(prev => [message, ...prev]);
        });

        return () => {
            socket.disconnect();
        };
    }, [receiverId]);

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
    }, [textMessage]);

    const fetchMessages = async () => {
        setIsLoading(true);
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
                setFetchedMessages(prev => [...prev, ...messages, ]); 
                setError(null);
                setIsLoading(false);

                if (messages.length < RESULTS_PER_PAGE) {
                    setHasMoreMessages(false);
                }
            } else {
                setHasMoreMessages(false);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
            setIsLoading(false);
        }
    };

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
    };

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        const msg = {
            content: textMessage,
            userId: userId!,
            receiverId: receiverId!
        };

        if (socketRef.current) {
            socketRef.current.emit('chat message', msg);
            setTextMessage("");
        }
    };

    return ( 
        <div className="flex flex-col w-full">
            <div className="mb-7 p-4">
                <h2 className="font-sans">{receiverName}</h2>
            </div>
            <div ref={chatRef} className="flex flex-col-reverse overflow-y-auto flex-grow p-2 h-[695px]">
                {fetchedMessages.map((message, index) => (
                    <div key={message.id} ref={((index === fetchedMessages.length - 1) && hasMoreMessages) ? lastPostElementRef : null} 
                    className={`mb-4 ${message.userId === userId ? 'ml-auto mr-20' : 'mr-auto'}`}>
                        <h3 className="text-[20px] mb-2 font-lato font-semibold">{message.userId === userId ? senderName : receiverName }:</h3>
                        <p className="font-OpenSans text-base">{message.content}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="mt-auto mb-10 w-full">
                <textarea 
                    value={textMessage}
                    onChange={e => setTextMessage(e.target.value)}
                    className="w-[80%] h-24 text-base p-2"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default MessageDetail;
