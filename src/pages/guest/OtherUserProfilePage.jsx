import './OtherUserProfilePage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'


function OtherUserProfilePage (){

    const {userId} = useParams()
    const [selectedUser, setSelectedUser] = useState(null)

    ///////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - récupérer l'info d'utilisateur
    const userFetch = async() =>{
        try{
            const responseOfFetch = await fetch(`http://localhost:3333/api/users/${userId}`)
            const responseToJson = await responseOfFetch.json()
            setSelectedUser(responseToJson.data)
        } catch (error){
            console.error('eoor fetching user data', error)
        }
    }
    useEffect(()=>{
        userFetch()
    },[])


    return(
    <>
        <Header />
        {selectedUser ? (
            <main className="userProfile--main">
                <h2>Hello,&nbsp; I'm {selectedUser.username} !</h2>
                <div className="mypage--user__info">
                    <p className="mypage--user__content">
                        {selectedUser.introduction}
                    </p>
                    <div className="mypage--user__img">
                        <div className='mypage--user__img__photo'></div>
                        <div>
                            <p>discord : {selectedUser.discordId}</p>
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