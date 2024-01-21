import './HomePage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faCode, faGamepad, faFootball, faChevronRight, faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons'
import {apiUrl, apiPort} from '../../utils/apiConfigs'

// 여기에는 뭐 크게 어려운건 없음. 토큰이 없으면 가입하라는 scroll만 추가시켜보자

function HomePage (){

    const [decodedToken, setDecodedToken] = useState(null)
    const [message, setMessage] = useState(null)

    ////////////////////////////////////////////////////////////////////////////////// SECURITE
    // securite - verifier le token    
    const token = localStorage.getItem("jwt")
    useEffect(()=>{
        if(token !== null){
            const decoded = jwtDecode(token)
            setDecodedToken(decoded)
        }
    },[token])


    ////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - creer une suggestion
    const handleCreateSuggestion = async(event, decodedToken) => {
        event.preventDefault()
        const suggestion = event.target.suggestion.value
        const createSuggestion = {
            text : suggestion,
            userId : decodedToken.data.userId, 
        }
        const suggestionToJson = JSON.stringify(createSuggestion)
        const createCommentResponse = await fetch(`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/api/suggestions`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Barer ${token}`
            },
            body : suggestionToJson
        })
        setMessage('we added your suggetion, thank you :)')
    }


    ////////////////////////////////////////////////////////////////////////////////// CAROUSEL
    const [slideIndex, setSlideIndex] = useState(0)
    const [positionValue, setPositionValue] = useState(0)
  
    const imgWidth = 100
    
    const prev = () => {
      if (slideIndex > 0) {
        setPositionValue(positionValue + imgWidth);
        setSlideIndex(slideIndex - 1);
      }
    }
    
    const next = () => {
        if (slideIndex < 4) {
            setPositionValue(positionValue - imgWidth)
            setSlideIndex(slideIndex + 1)
        } 
    }

<<<<<<< HEAD
	useEffect(()=>{
		const slideInterval = setInterval(()=>{
			if(slideIndex !== 4){
			next()
			} 
			if (slideIndex ===4){
			setPositionValue(0)
			setSlideIndex(0)
			}
		},4000)
		return () =>{
		clearInterval(slideInterval)
		}
	},[])
=======
    useEffect(() => {
        const slideInterval = setInterval(() => {
            if(slideIndex !== 4){
                next()
            } 
            if(slideIndex === 4){
                setPositionValue(0)
                setSlideIndex(0)
            }
        }, 5000)    
        return () => {
            clearInterval(slideInterval)
        }
      }, [slideIndex])
>>>>>>> 7cfea79c44a5f9a275592d753ac242d944a03242

 
    return(
    <>
        <Header />
        <main className="home--main">
            <section className="home--main--banner">

            <div className='container'> 
                <div className='btn-LeftRight'>
                    <FontAwesomeIcon icon={faCircleChevronLeft} className='btn'
                        style={{
                            opacity: slideIndex === 0 ? '0.3' : '1', 
                            cursor: slideIndex === 0 ? 'default' : 'pointer'
                         }}    
                        onClick={prev}
                        disabled={slideIndex === 0}
                    />
                    <FontAwesomeIcon icon={faCircleChevronRight} className='btn'
                        style={{
                            opacity: slideIndex === 4 ? '0.3' : '1', 
                            cursor: slideIndex === 4 ? 'default' : 'pointer'
                         }}    
                        onClick={next}
                        disabled={slideIndex === 4}
                    />
                </div>

                <div className='album'>
                    <div className="images" style={{ transform: `translateX(${positionValue}vw)` }}>
                        <div>
                            <h1>Oui! <strong>We Make Team</strong></h1>
                            <p>Let's having our team for creative activities!</p>
                            {token ? (
                                <Link to="/mypage">Go to my Page</Link>
                            ):(
                                <Link to="/creataccount">Join our Team</Link>
                            )}
                        </div>
                        <div>
                            <h1>We Make <strong>DEV</strong> Team</h1>
                            <p>Build a team for application development!</p>
                            {token ? (
                                <Link to="/mypage">Go to my Page</Link>
                            ):(
                                <Link to="/forum/dev">Go to Forum</Link>
                            )}
                        </div>
                        <div>
                            <h1>We Make <strong>STUDENT</strong> Team</h1>
                            <p>Build a team for efficient learning!</p>
                            {token ? (
                                <Link to="/mypage">Go to my Page</Link>
                            ):(
                                <Link to="/forum/student">Go to Forum</Link>
                            )}
                        </div>
                        <div>
                            <h1>We Make <strong>SPORT</strong> Team</h1>
                            <p>Build a team for a successful performance!</p>
                            {token ? (
                                <Link to="/mypage">Go to my Page</Link>
                            ):(
                                <Link to="/forum/sport">Go to Forum</Link>
                            )}
                        </div>
                        <div>
                        <h1>We Make <strong>GAME</strong> Team</h1>
                            <p>Build your team to win!</p>
                            {token ? (
                                <Link to="/mypage">Go to my Page</Link>
                            ):(
                                <Link to="/forum/game">Go to Forum</Link>
                            )}
                        </div>

                    </div>
                </div>
            </div>
            </section>

            <section className="home--main--aboutus">
                <div className="aboutus--line">
                    <div>
                    <FontAwesomeIcon icon={faBookOpen} className='fontawesome' />
                        <h2>Find your team for studying together!</h2>
                        <Link to="/forum/student">Go to STUDENT forum <FontAwesomeIcon icon={faChevronRight} /></Link>             
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faFootball} className='fontawesome' />
                        <h2>Find your team for sportif activities!</h2>
                        <Link to="/forum/sport">Go to SPORT forum <FontAwesomeIcon icon={faChevronRight} /> </Link>             
                    </div>
                </div>
                <div className="aboutus--line">
                    <div>
                        <FontAwesomeIcon icon={faCode} className='fontawesome' />
                        <h2>Find your team for working together!</h2>
                        <Link to="/forum/dev">Go to DEV forum <FontAwesomeIcon icon={faChevronRight} /> </Link>             
                    </div>
                    <div>
                    <FontAwesomeIcon icon={faGamepad} className='fontawesome' />
                        <h2>Find your team for winning the match!</h2>
                        <Link to="/forum/game">Go to GAME forum <FontAwesomeIcon icon={faChevronRight} /> </Link>             
                    </div>
                </div>
            </section>

            <section className="home--main--form">
                <h2>Tell us about your suggestions or Ideas!</h2>
                <form onSubmit ={ decodedToken !== null ? (event => handleCreateSuggestion(event, decodedToken)) : (event => event.preventDefault())} action="">
                    <p>description below <span>* log in obligation</span></p>
                    <textarea name="suggestion" id="categoryidea" cols="50" rows="5" placeholder="write here an idea or suggestion of our platform."></textarea>
                    <input type="submit" className='home--submitbtn' value={"submit"} />
                    {message && <p className='successMessage'>{message}</p>}
                </form>
            </section>
        </main>
        <Footer />
    </>
    )
}

export default HomePage
