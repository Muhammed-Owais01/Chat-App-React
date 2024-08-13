import React from "react";
import { Message } from "../react-app-env";
import { getDateFormat } from "../utils/getTime";

interface messageListProps {
    messages: Message[],
    userId: number,
    senderName: string,
    receiverName: string,
    chatRef: React.LegacyRef<HTMLDivElement> | undefined,
    hasMoreMessages: boolean,
    lastPostElementRef: (node: HTMLElement | null) => void,
}

const MessageList = ({ messages, userId, senderName, receiverName, chatRef, hasMoreMessages, lastPostElementRef }: messageListProps) => {
    return ( 
        <div ref={chatRef} className="flex flex-col-reverse overflow-y-auto flex-grow p-2 h-[695px] scrollbar-hide">
                {messages.map((message, index) => (
                    <div 
                        key={message.id} 
                        ref={((index === messages.length - 1) && hasMoreMessages) ? lastPostElementRef : null} 
                        className={`relative flex flex-col mb-4 ${message.userId === userId ? 
                            'ml-auto mr-3 user-msg bg-[#1e90ff] after:left-[96%] after:translate-x-[-50%] after:bottom-[-8px] after:border-b-0 after:border-t-[15px] after:border-transparent after:border-t-[#1e90ff]' : 
                            'mr-auto receiver-msg bg-[#87cefa] after:left-[4%] after:translate-x-[-50%] after:top-[-8px] after:border-t-0 after:border-b-[15px] after:border-transparent after:border-b-[#87cefa]'} 
                            w-[430.5px] max-w-[430.5px] rounded-3xl relative p-[10px_15px] after:content-[""] after:absolute after:border-solid after:border-x-[10px]`}>
                            <h3 className="text-[20px] mb-2 font-lato font-semibold">{message.userId === userId ? senderName : receiverName }</h3>
                            <p className="font-OpenSans text-base whitespace-pre-wrap">{message.content}</p>
                            <span className="ml-auto">{getDateFormat(message.timestamp!)}</span>
                    </div>
                ))}
        </div>
     );
}
 
export default MessageList;