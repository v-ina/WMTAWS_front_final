import './OtherUserProfilePage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiPort, apiUrl } from '../../utils/apiConfigs'
import ChatIndividu from '../../components/ChatIndividu'
import { jwtDecode } from 'jwt-decode'


function OtherUserProfilePage (){

    const {userId} = useParams()
    const [selectedUser, setSelectedUser] = useState(null)

    ///////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - récupérer l'info d'utilisateur
    const userFetch = async() =>{
        try{
            const responseOfFetch = await fetch(`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/api/users/${userId}`)
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
        return user.photo !== null ? user.photo : `http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/userphotos/randomUser.jpg`
    }
    


    return(
    <>
        <Header />
        {chatOpen && (
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
                <h2>Hello,&nbsp; I'm {selectedUser.username} !</h2>
                <div className="mypage--user__info">
                    <p className="mypage--user__content">
                        {selectedUser.introduction}
                    </p>
                    
                    <div className="mypage--user__img">

                        <div className='mypage--user__img__photo'>
                            <img src={selectedUser.photo !== null ? (selectedUser.photo) : (`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/userphotos/randomUser.jpg`)} alt="image utilisateur" />
                        </div>
                        <div>
                            <p>discord : {selectedUser.discordId}</p>
                            <p  onClick={()=>setChatOpen(!chatOpen)}>send a message</p>
                    
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