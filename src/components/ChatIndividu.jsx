import { useEffect, useState } from "react"
import './ChatIndividu.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from 'jwt-decode'
import {apiUrl, apiPort} from '../utils/apiConfigs'


function ChatIndividu({ userIdEnConversation, closeChat, userNameEnConversation, userPhotoEnConversation, userIdFromProfil}) {

    const [messageWithUser, setMessageWithUser] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.data.userId);
        }
    }, []);

    const messageWithUserFetch = async() => {
        const response = await fetch(`https://https.we-make-team.click/api/message/all/${userId}?receiverId=${userId}&senderId=${userIdEnConversation}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseToJson = await response.json();
        setMessageWithUser(responseToJson.data || responseToJson); 
    }
    

    useEffect(() => {
        if(userId){
            messageWithUserFetch()
        }
    }, [userId]);

    const handleCreateMessage = async(event) => {
        event.preventDefault();
        const content = event.target.message.value
        const sendUserId = userIdFromProfil || userId
        const receiveUserId = userIdEnConversation
        const createMessage = {
            content : content,
            send_userId : sendUserId,
            receive_userId : receiveUserId
        }
        try {
            const response = await fetch(`https://https.we-make-team.click/api/message`, {
                method:"POST",
                headers : {"Content-type" : "application/json"}, 
                body: JSON.stringify(createMessage) 
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            event.target.message.value = ''; 
            const responseToJson = await response.json();
            setMessageWithUser(responseToJson.data || responseToJson);
            messageWithUserFetch() 
        } catch (error) {
            console.error('Error fetching inbox messages:', error);
        }
    }



    return (
        <div className="chat__individu" onClick={(event) => event.stopPropagation()}>
            <div className="chat__individu__sender">
                <span onClick={closeChat}><FontAwesomeIcon icon={faChevronLeft} /></span>
                <div className="individu__sender__img">
                    <img src={userPhotoEnConversation} alt="" />
                </div>
                <p>{userNameEnConversation}</p>
            </div>
            {messageWithUser && messageWithUser.length > 0 && (
                <div className="chat__individu__content">
                    {messageWithUser.map(message=>{
                        return (
                            <>
                            {message.MessageUserFks[0].Sender.id === userId ? (
                                <>
                                    <div className="chatbox chatbox--message-by-me">
                                        <FontAwesomeIcon icon={faCheck} className={message.status ? "message--lu":"message--nonlu"}/> 
                                        <p className="message-time--sent-by-me">{message.createdAt.substring(11,16)}</p>
                                        <div className="message-nuage--sent-by-me"> 
                                            <p>{message.content}</p> 
                                        </div>
                                        <div className="message-fleche--sent-by-me">▶</div>
                                    </div>
                                </>
                            ):(
                                <>
                                    <div className="chatbox">
                                        <div className="message-fleche--sent-by-another">◀</div> 
                                        <div  className="message-nuage--sent-by-another"> 
                                            <p>{message.content}</p> 
                                        </div>
                                        <span>{message.createdAt.substring(11,16)}</span>
                                    </div>
                                </>
                            )}
                            </>
                        )
                    })}
                </div>
            )}
            <div className="chat__individu__create-message">
                <form action="" onSubmit={(event)=>handleCreateMessage(event)}>
                    <textarea name="message" cols="50" rows="3"></textarea>
                    <button type="submit">send</button>
                </form>
            </div>
        </div>
    )
}

export default ChatIndividu;