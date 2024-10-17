import './CreatAccountPage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiPort, apiUrl } from '../../utils/apiConfigs'


function CreatAccountPage(){
   
    const navigate = useNavigate()
    const [idMessage , setIdMessage] = useState(null)
    const [passwordMessage , setpasswordMessage] = useState(null)
    const [discordMessage , setdiscordMessage] = useState(null)

    ////////////////////////////////////////////////////////////////////////////////// FUNCTION    
    // initiation - supprimer des messages d'erreur
    const deleteMessage =() => {
        setpasswordMessage(null)
        setdiscordMessage(null)
        setIdMessage(null)
    }

    
    ////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - creer un utilisateur
    const handleSubmitCreateAccount = async (event) => {
        event.preventDefault()
        const username = event.target.username.value
        const password = event.target.password.value
        const email = event.target.email.value
        const passwordConfirm = event.target.passwordConfirm.value
        const firstname = event.target.firstname.value
        const discordId = event.target.discordId.value
        const birthdate = event.target.birthdate.value

        if(password !== passwordConfirm){
            return setpasswordMessage('confirm password is not correct') 
        }
        if(!discordId){
            return setdiscordMessage('you must save your discord ID')
        }
        const userToCreate = {
            username : username,
            password : password,
            email : email,
            firstname : firstname,
            discordId : discordId,
            birthdate : birthdate
        }
        const userCreateToJson = JSON.stringify(userToCreate)
        const createUserResponse = await fetch(`https://https.we-make-team.click/api/users`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : userCreateToJson
        })
        if(createUserResponse.status === 200 || createUserResponse.status === 204 ) {
            navigate('/login')
        } else {
            const errorResponse = await createUserResponse.json()
            setIdMessage(errorResponse.message)
        }
    }


    return(
    <>
        <Header />
        <main className='creataccount--main'>
            <div>
                <img src="/assets/imgs/logo.png" alt="" />
            </div>
            <h1>Join Our Team WMT</h1>
            <form action=""  onSubmit={handleSubmitCreateAccount}>
                {idMessage && <p className='createAccound__fail'>{idMessage}</p>}
                <label htmlFor="username" >ID :</label>
                <input type="text" placeholder="ID" id='username' name='username'  onChange={deleteMessage}/>

                <label htmlFor="password">PASSWORD :</label>
                <input type="password" placeholder="Password" name='password'/>
                
                {passwordMessage && <p className='createAccound__fail'>{passwordMessage}</p>}
                <label htmlFor="passwordConfirm">CONFIRM PASSWORD :</label>
                <input type="password" placeholder="Password : confirm password"  name='passwordConfirm' onChange={deleteMessage}/>

                <label htmlFor="email">E-MAIL : &nbsp;&nbsp;&nbsp;&nbsp; <span>(*we use email for finding forgot password)</span></label>
                <input type="email" placeholder='E-mail'name='email'/>
                
                <label htmlFor="firstname">FIRST NAME : &nbsp;&nbsp;&nbsp;&nbsp; <span>(*we use first name for finding forgot password)</span></label>
                <input type="text" placeholder='first name' name='firstname'/>

                {discordMessage && <p className='createAccound__fail'>{discordMessage}</p>}
                <label htmlFor="discordId">DISCORD ID :</label>
                <input type="text" placeholder='discord id' name='discordId'  onChange={deleteMessage}/>

                <label htmlFor="birthdate">BIRTH DATE : &nbsp;&nbsp;&nbsp;&nbsp; <span>(*we use birth date for finding forgot password)</span></label>
                <input type="date" id='birthdate'name='birthdate'/>

                <input type='submit' value={"join WMT"} /> 
            </form>
        </main>
        <Footer />
    </>
    )
}
export default CreatAccountPage