import './OtherUserProfilePage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiPort, apiUrl } from '../../utils/apiConfigs'
import ChatIndividu from '../../components/ChatIndividu'
import { jwtDecode } from 'jwt-decode'
import { faComments } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function OtherUserProfilePage (){

    const {userId} = useParams()
    const [selectedUser, setSelectedUser] = useState(null)

    ///////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - récupérer l'info d'utilisateur
    const userFetch = async() =>{
        try{
            const responseOfFetch = await fetch(`https://https.we-make-team.click/api/users/${userId}`)
            const responseToJson = await responseOfFetch.json()
            setSelectedUser(responseToJson.data)
        } catch (error){
            console.error('eoor fetching user data', error)
        }
    }
    useEffect(()=>{
        userFetch()
    },[])

    const [chatOpen , setChatOpen] = useState(false)
    const [token, setToken] = useState(null)
    const [currentUserId, setCurrentUserId] = useState(null)

    useEffect(() => {
        const jwt = localStorage.getItem("jwt")
        if (jwt) {
            const decoded = jwtDecode(jwt)
            setToken(jwt)
            setCurrentUserId(decoded.data.userId)
        }
        userFetch()
    }, [])

    const handleSendMessageClick = () => {
        if (!token) {
            alert('You need to login first!')
        } else {
            setChatOpen(!chatOpen)
        }
    }

    const closeChatIndividu = () => {
        setChatOpen(false)
    }

    const getPhotoUrl = (user) => {
        return user.photo !== null ? user.photo : `https://https.we-make-team.click/userphotos/randomUser.jpg`
    }


    
    const [messageAlert, setMessageAlert] = useState(null)
    useEffect(() => {
        if (token !== null) {
            const decoded = jwtDecode(token);
            checkUnreadMessage(decoded.data.userId);
        }
    }, [token]);

    const checkUnreadMessage = async (userId) => {
        try {
            const response = await fetch(`https://https.we-make-team.click/api/message/unread/${userId} `);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseToJson = await response.json();
            setMessageAlert(responseToJson);
        } catch (error) {
            console.error('Error fetching unread messages:', error);
        }
    };


    return(
    <>
        <Header />

        {chatOpen && token && (
                <ChatIndividu 
                    userIdEnConversation={selectedUser.id}
                    userNameEnConversation={selectedUser.username}
                    userPhotoEnConversation={getPhotoUrl(selectedUser)}
                    closeChat={closeChatIndividu}
                    userIdFromProfil={currentUserId}
            />
            )}
        {selectedUser ? (
            <main className="userProfile--main">
                {messageAlert && messageAlert.length >0 && <div className='chat__unread'></div>}
                {token && (
                    <div className='chat__btn'  onClick={()=>setChatOpen(!chatOpen)}>
                        <FontAwesomeIcon className='chat__btn__icon' icon={faComments} />
                    </div>
                )}
                <h2>Hello,&nbsp; I'm {selectedUser.username} !</h2>
                <div className="mypage--user__info">
                    <p className="mypage--user__content">
                        {selectedUser.introduction}
                    </p>
                    
                    <div className="mypage--user__img">

                        <div className='mypage--user__img__photo'>
                            <img src={selectedUser.photo !== null ? (selectedUser.photo) : (`https://https.we-make-team.click/userphotos/randomUser.jpg`)} alt="image utilisateur" />
                        </div>
                        <div>
                            <p>discord : {selectedUser.discordId}</p>
                            <p className='message__btn--send' onClick={handleSendMessageClick}>send a message</p>
                    
                        </div>
                    </div>
                </div>
            </main>
        ):(
            <main className='userProfile--noresult'>
                <div className='noResult'>
                    <hr />
                    <p>Any user founded</p>
                    <hr />
                </div>
            </main> 
        )}
        <Footer />
    </>
    )
}

export default OtherUserProfilePage