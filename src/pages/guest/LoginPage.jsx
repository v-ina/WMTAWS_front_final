import './LoginPage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { apiPort, apiUrl } from '../../utils/apiConfigs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'


function LoginPage (){

    const navigate = useNavigate();
    const [message, setMessage] = useState(null)

    ///////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - utilisateur log in
    const handleLogin = async(event) => {
        event.preventDefault()
        const username = event.target[0].value
        const password = event.target[1].value
        const loginData = {username, password}
        const loginDataJson = JSON.stringify(loginData)

        const responseAfterFetch = await fetch(`https://we-make-team.click/api/users/login`, {method : "POST", headers : {"Content-type" : "application/json"}, body : loginDataJson})
        const responseToJson = await responseAfterFetch.json()
        const token = responseToJson.token

        if(token){
            let decodedToken = jwtDecode(token)
            localStorage.setItem("jwt", token)
            if(decodedToken.data.role === 1 || decodedToken.data.role === 2){
                navigate('/admin/reports')
            } else {
                navigate('/mypage')
            }
        } else {
            setMessage(responseToJson.message)
        }
    }


    ////////////////////////////////////////////////////////////////////////////////// FUNCTION    
    // icon pour masquer/demasquer mdp 
    const [masking, setMasking] = useState(true)
    const maskingPasswordToggle = () => {
        if(masking){
            setMasking(false)
        } else {
            setMasking(true)
        }
    }


    return(
    <>
        <Header currentPage={"loginPage"} />
        <main className='login--main'>
            <form onSubmit={handleLogin} action="">
                {message && <p className='loginFail'>*{message}</p>}
                <label htmlFor="username">
                    <input type="text" id='username' placeholder="username" />
                </label>

                <label htmlFor="password">
                    <FontAwesomeIcon onClick={maskingPasswordToggle} className= {masking? "fontawesomeeye" : "fontawesomeeye masking"} icon={faEyeSlash} />
                    <input type={masking ? "password" : "text"} id='password' placeholder="password" />
                </label>

                <input type='submit' className='btn__connect' value="Connect"/>
                
                <Link to="/findaccound">forgot your password or id ?</Link>
                <Link to="/creataccount" className='joinsite'>Want to join our site?</Link>
                <Link to="/creataccount" className='btn__join'>Join in</Link>
            </form>
        </main>
        <Footer />
    </>
    )
}

export default LoginPage