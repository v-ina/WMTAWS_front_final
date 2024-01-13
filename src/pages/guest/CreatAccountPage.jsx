import './CreatAccountPage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


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
        const createUserResponse = await fetch("http://ec2-13-39-22-148.eu-west-3.compute.amazonaws.com:3333/api/users", {
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
            <h1>Join Our Team WMT</h1>
            <form action=""  onSubmit={handleSubmitCreateAccount}>
                {idMessage && <p className='createAccound__fail'>{idMessage}</p>}
                <label htmlFor="username" >ID :</label>
                <input type="text" placeholder="ID" id='username' name='username'  onChange={deleteMessage}/>

                <label htmlFor="password">PASSWORD :</label>
                <input type="password" placeholder="Password" name='password'/>

                <label htmlFor="email">E-MAIL :</label>
                <input type="email" placeholder='your e-mail will be used for finding your password'name='email'/>

                {passwordMessage && <p className='createAccound__fail'>{passwordMessage}</p>}
                <label htmlFor="passwordConfirm">CONFIRM PASSWORD :</label>
                <input type="password" placeholder="Password : confirm password"  name='passwordConfirm' onChange={deleteMessage}/>
                
                <label htmlFor="firstname">FIRST NAME : &nbsp;&nbsp;&nbsp;&nbsp; (*we use first name for finding forgot password)</label>
                <input type="text" placeholder='first name' name='firstname'/>

                {discordMessage && <p className='createAccound__fail'>{discordMessage}</p>}
                <label htmlFor="discordId">DISCORD ID :</label>
                <input type="text" placeholder='discord id' name='discordId'  onChange={deleteMessage}/>

                <label htmlFor="birthdate">BIRTH DATE : &nbsp;&nbsp;&nbsp;&nbsp; (*we use first name for finding forgot password)</label>
                <input type="date" id='birthdate'name='birthdate'/>

                <input type='submit' value={"join WMT"} /> 
            </form>
        </main>
        <Footer />
    </>
    )
}
export default CreatAccountPage