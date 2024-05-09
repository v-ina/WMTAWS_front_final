import './MyEditPage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { apiPort, apiUrl } from '../../utils/apiConfigs'

// 사진을 불러오는 경우는 storage를 사용한 뒤에 불러올수 있을 듯함. 그 외는 끝!

function MyEditPage(){

    const [loginUser, setLoginuser] = useState(null)
    const [message, setMessage] = useState(null)

    /////////////////////////////////////////////////////////////////////////////////////// ACCES
    // navigate - Accès direct interdit depuis l'URL
    const navigate = useNavigate();
    useEffect(()=>{
        if(localStorage.getItem("jwt") === null){
            return navigate('/login')
        }
    },[])


    ///////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - récupérer l'utilisateur qui a logge
    const userFetch = async() =>{
        try{
            const token = localStorage.getItem("jwt") 
            const decodedToken = jwtDecode(token)
            const responseOfFetch = await fetch(`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/api/users/${decodedToken.data.userId}`)
            const responseToJson = await responseOfFetch.json()
            setLoginuser(responseToJson.data)
        } catch (error){
            console.error('eoor fetching user data', error)
        }
    }
    useEffect(()=>{
        userFetch()
    },[])


    ///////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - corriger des infos d'utilisateurs    
    const handleSubmitEditAccount = async (event) => {
        event.preventDefault()
        const password = event.target.password.value
        const email = event.target.email.value
        const firstname = event.target.firstname.value
        const discordId = event.target.discordId.value 
        const introduction = event.target.introduction.value
        const formData = new FormData() 

        if(!email || !discordId){
            setMessage('email and discord id cannot be null')
            return;
        }
        
        if(event.target.photo.files.length !== 0){
            if(password.length > 0){
                formData.append("username", loginUser.username)
                formData.append("password", password)
                formData.append("email", email) 
                formData.append("firstname", firstname)
                formData.append("discordId", discordId)
                formData.append("introduction", introduction)
                formData.append("photo", event.target.photo.files[0])
            } else {
                formData.append("username", loginUser.username)
                formData.append("email", email) 
                formData.append("firstname", firstname)
                formData.append("discordId", discordId)
                formData.append("introduction", introduction)

                formData.append("photo", event.target.photo.files[0])
            }
        } else {
            if(password.length > 0) {
                formData.append("password", password)
                formData.append("email", email) 
                formData.append("firstname", firstname)
                formData.append("discordId", discordId)
                formData.append("introduction", introduction)
            } else {
                formData.append("email", email) 
                formData.append("firstname", firstname)
                formData.append("discordId", discordId)
                formData.append("introduction", introduction)
            }
        }
        
        const token = localStorage.getItem("jwt") 
        const EditUserResponse = await fetch(`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/api/users/${loginUser.id}`, {
            method : "PUT",
            headers : {
                Authorization : `Barer ${token}`
            },
            params : loginUser.id,
            body : formData
        })
        if(EditUserResponse.status === 200 || EditUserResponse.status === 204 ) {
            navigate('/mypage')
        }
    }

    // BDD - supprimer son propre compte
    const handleDeleteMyself = async(event, userId) =>{
        const token = localStorage.getItem("jwt") 
        if(window.confirm(`are you sure that you want to delete your account?`)){
            alert(`your informations has been succesfuly deleted`)
            const token = localStorage.getItem('jwt')
            await fetch(`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/api/users/${userId}`, {method : "DELETE", headers : {'Authorization': `Bearer ${token}`}})
            setTimeout(()=>{
                localStorage.removeItem("jwt")
            },'100')
            setTimeout(()=>{
                navigate("/")
                window.location.reload()
            },'100')
            navigate('/')

        } else {
            alert('your require was canceled')
        }
    }


    return(
    <>
        <Header />
            {loginUser && (
                <main className="mypageEdit--main">
                    <div className='mypageEdit--user__img'><img src={loginUser.photo !== null ? (loginUser.photo) : (`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/userphotos/randomUser.jpg`)} alt="image utilisateur" /></div>

                    <form action="" onSubmit={handleSubmitEditAccount}>
                        <input type="file" id="file" accept=".jpg, .jpeg, .png" name='photo' className='btn__img' />
                        <label for="pw">PASSWORD</label>
                        <input name='password' type="text" id="pw" />

                        <label for="email">E-MAIL</label>
                        <input name='email' type="email" id="email" defaultValue={loginUser.email} />

                        <label for="firstname">FIRST NAME</label>
                        <input name='firstname' type="text" id="firstname" defaultValue={loginUser.firstname} />

                        <label for="discord">DISOCRD ID</label>
                        <input name='discordId' type="text" id="discord" defaultValue={loginUser.discordId} />

                        <label for="introduction">INTRODUCTION</label>
                        <textarea name="introduction" id="introduction" cols="30" rows="10" defaultValue={loginUser.introduction}></textarea>
                        {message&& <p className='createAccound__fail'>{message}</p>}
                        <input type="submit" value="Save" className="btn__save" />
                    </form>        
                    <button onClick={(event)=>handleDeleteMyself(event,loginUser.id)}>delete</button>            
                </main>
            )}
        <Footer />
    </>
    )
}

export default MyEditPage