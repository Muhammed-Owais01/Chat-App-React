import { useCallback, useEffect, useRef, useState } from "react";
import { Message } from "../react-app-env";
import { useUser } from "../Context/UserContext";
import getCookie from "../utils/getCookie";
import { io, Socket } from 'socket.io-client';
import MessageList from "./MessageList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

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
    }, [userId]);

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
            if (!res.ok) throw Error("Fetch Error");
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
                if (err.message.includes("Fetch Error"))
                    setError("Could not fetch messages")
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
            <div className="mb-1 p-5 border-solid border-x-0 border-t-0 border-b border-[#b6c2bf]">
                <h2 className="font-sans">{receiverName}</h2>
            </div>
            {isLoading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {fetchedMessages && 
            <MessageList 
                messages={fetchedMessages}
                userId={userId}
                senderName={senderName}
                receiverName={receiverName}
                chatRef={chatRef}
                hasMoreMessages={hasMoreMessages}
                lastPostElementRef={lastPostElementRef}
            />}
            <form onSubmit={sendMessage} className="mt-auto mb-10 w-full">
                <div className="relative w-[80%]">
                    <textarea 
                        ref={textareaRef}
                        value={textMessage}
                        onChange={e => setTextMessage(e.target.value)}
                        className="w-[113%] max-w-[1255px] h-24 text-base border-[#b6c2bf] focus:border-[#b6c2bf] active:border-[#b6c2bf] p-2 pb-4 pr-24 ml-2 max-h-[154px] font-OpenSans rounded-2xl"
                    />
                    <button type="submit" className="absolute -right-60 bottom-2 bg-[#1e90ff] text-[18px] w-24 text-white p-2 px-4 rounded-full cursor-pointer"><FontAwesomeIcon className="bg-transparent" icon={faPaperPlane} /></button>
                </div>
            </form>
        </div>
    );
};

export default MessageDetail;
