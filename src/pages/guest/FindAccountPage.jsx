import './FindAccountPage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { apiPort, apiUrl } from '../../utils/apiConfigs'

function FindAccountPage(){

    const navigate = useNavigate();
    const [pwMessage, setPwMessage] = useState(null)
    const [idMessage, setIdMessage] = useState(null)

    const handleFindId = async(event) => {
        event.preventDefault()
        const email = event.target.email.value
        const firstname = event.target.firstname.value
        const birthdate = event.target.birthdate.value
        const userToFind = {
            email : email,
            firstname : firstname,
            birthdate : birthdate
        }
        const userFindToJson = JSON.stringify(userToFind)
        const findUserResponse = await fetch(`https.we-make-team.click/api/users/${email}/${firstname}/${birthdate}`)
        if(findUserResponse.status === 200 || findUserResponse.status === 204 || findUserResponse.status === 304 ) {
            const responseToJson = await findUserResponse.json()
            setIdMessage(`your id is : ${responseToJson.data.username}`)
        } else {
            const errorResponse = await findUserResponse.json()
            setIdMessage(errorResponse.message);
        }
    }


    const handleFindPassword = async(event) => {
        event.preventDefault()
        const username = event.target.username.value
        const email = event.target.email.value
        const firstname = event.target.firstname.value
        const birthdate = event.target.birthdate.value
        const userToFind = {
            username : username,
            email : email,
            firstname : firstname,
            birthdate : birthdate
        }
        const userFindToJson = JSON.stringify(userToFind)
        const findUserResponse = await fetch(`https.we-make-team.click/api/users/${username}/${email}/${firstname}/${birthdate}`, {
            method : "POST", headers : {"Content-type" : "application/json"}, body : userFindToJson
            })
        if(findUserResponse.status === 200 || findUserResponse.status === 204 || findUserResponse.status === 304 ) {
            const responseToJson = await findUserResponse.json()
            const token = responseToJson.token
            if(token){
                let decodedToken = jwtDecode(token)
                localStorage.setItem("jwt", token)
                if(decodedToken.data.role === 1 || decodedToken.data.role === 2){
                    navigate('/admin/reports')
                } else {
                    alert('please change your password via edit-profil')
                    navigate('/mypage')
                }
            } else {
                setPwMessage(responseToJson.message)
            }
        } else {
            const errorResponse = await findUserResponse.json()
            setPwMessage(errorResponse.message);
        }    
    }


    return(
    <>
        <Header /> 
        <main className='findaccount--main'>
            <h2>forgot your password?</h2>
            {pwMessage && <p className='findResult'>{pwMessage}</p>}
            <form className="form__find__password" action="" onSubmit={handleFindPassword}>
                <input type="text" placeholder="ID" name='username' />
                <input type="text" placeholder='first name' name='firstname'/>
                <input type="email" placeholder='your e-mail witch you used for joining' name='email'/>
                <label htmlFor="birthdate">birth date :</label>
                <input type="date" id='birthdate' name='birthdate'/>
                <input type='submit' value={"find password"} /> 
            </form>


            <hr />
            
            <h2>forgot your id?</h2>
            {idMessage && <p className='findResult'>{idMessage}</p>}
            <form className="form__find__id" action="" onSubmit={handleFindId}>
                <input type="text" placeholder='first name' name='firstname'/>
                <input type="email" placeholder='your e-mail witch you used for joining' name='email'/>
                <label htmlFor="birthdate">birth date :</label>
                <input type="date" id='birthdate' name='birthdate'/>
                <input type='submit' value={"find id"} /> 
            </form>
        </main>
        <Footer />
    </>
    )
}
export default FindAccountPage