import { Message } from "../react-app-env";

interface messageListProps {
    messages: Message[],
    userId: number,
    senderName: string,
    receiverName: string,
}

const MessageList = ({ messages, userId, senderName, receiverName }: messageListProps) => {
    return ( 
        <div className="flex flex-col overflow-y-auto flex-grow p-2">
            {messages && messages.map(message => (
                <div key={message.id} className="mb-4">
                    <div>
                        <h3 className="text-[20px] mb-2 font-lato font-semibold">{message.userId === userId ? senderName : receiverName }:</h3>
                        <p className="font-OpenSans text-base">{message.content}</p>
                    </div>
                </div>
            ))}
        </div>
     );
}
 
export default MessageList;