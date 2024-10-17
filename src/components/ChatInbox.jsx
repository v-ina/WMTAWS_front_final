import { useEffect, useState } from "react"
import ChatIndividu from "./ChatIndividu"
import './ChatInbox.scss'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import {apiUrl, apiPort} from '../utils/apiConfigs'
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


function ChatInbox({onClick}){

    const navigate = useNavigate();

    const [openChatIndividu, setOpenChatIndividu] = useState({});
    const [inboxMessages, setInboxMessages] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.data.userId);
        }
    }, []);

    useEffect(() => {
        const fetchInboxMessages = async () => {
            try {
                const response = await fetch(`https://we-make-team.click/api/message/last-messages?receiverId=${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const responseToJson = await response.json();
                setInboxMessages(responseToJson.data || responseToJson); 
            } catch (error) {
                console.error('Error fetching inbox messages:', error);
            }
        };

        if (userId) {
            fetchInboxMessages();
        }
    }, [userId,openChatIndividu]);

    const toggleChatIndividu = (messageId) => {
        setOpenChatIndividu(prevState => ({
            ...prevState,
            [messageId]: !prevState[messageId]
        }));
    };

    const closeChatIndividu = (messageId) => {
        setOpenChatIndividu(prevState => ({
            ...prevState,
            [messageId]: false
        }));
    };

const getPhotoUrl = (message, userId) => {
    const senderPhoto = message.Sender.photo;
    const receiverPhoto = message.Receiver.photo;
    const defaultPhotoUrl = `https://we-make-team.click/userphotos/randomUser.jpg`;

    if (message.Sender.id === userId) {
        return receiverPhoto !== null ? receiverPhoto : defaultPhotoUrl;
    } else {
        return senderPhoto !== null ? senderPhoto : defaultPhotoUrl;
    }
};


    return (
        <div className="chat__inbox">
            <p className="chat__inbox__title">Chat inbox</p>
            <FontAwesomeIcon className="chat__inbox--close-btn" onClick={onClick} icon={faXmark} />
            {inboxMessages ? (
                <ul>
                    {inboxMessages.map((message) => (
                        <li key={message.Message.id}  onClick={() => toggleChatIndividu(message.id)}>
                            <div className="chat-inbox__sender__img" onClick={()=>navigate(`/userprofile/${message.send_userId}`)} >
                                <img src={getPhotoUrl(message, userId)} alt="image utilisateur" />
                            </div>
                            <div  className="chat-inbox__last-message">
                                <p className="chat-inbox__last-message--sender">{message.Sender.id === userId ? message.Receiver.username : message.Sender.username}</p>
                                <p className="chat-inbox__last-message--content">{message.Message.content}</p>
                            </div>
                            <p>{message.Message.createdAt.substring(11,16)}</p>
                            {openChatIndividu[message.id] && (
                                <>
                                    <ChatIndividu 
                                        userIdEnConversation={message.Sender.id === userId ? message.Receiver.id : message.Sender.id}
                                        userNameEnConversation={message.Sender.id === userId ? message.Receiver.username : message.Sender.username}
                                        userPhotoEnConversation={getPhotoUrl(message, userId)}
                                        closeChat={() => closeChatIndividu(message.id)}
                                    />
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You need to Login for this service =)</p>
            )}
        </div>
    )
}

export default ChatInbox