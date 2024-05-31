import './HomePage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faCode, faGamepad, faFootball, faChevronRight, faCircleChevronLeft, faCircleChevronRight, faFlag, faUserTie, faScrewdriverWrench, faSprayCanSparkles, faComments } from '@fortawesome/free-solid-svg-icons'
import {apiUrl, apiPort} from '../../utils/apiConfigs'
import ChatInbox from '../../components/ChatInbox'


function HomePage (){

    const [decodedToken, setDecodedToken] = useState(null)
    const [message, setMessage] = useState(null)
    const [messageAlert, setMessageAlert] = useState(null)


    ////////////////////////////////////////////////////////////////////////////////// SECURITE
    // securite - verifier le token    
    const token = localStorage.getItem("jwt")
    useEffect(() => {
        if (token !== null) {
            const decoded = jwtDecode(token);
            setDecodedToken(decoded);
            checkUnreadMessage(decoded.data.userId);
        }
    }, [token]);

    const checkUnreadMessage = async (userId) => {
        try {
            const response = await fetch(`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/api/message/unread/${userId} `);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseToJson = await response.json();
            setMessageAlert(responseToJson);
        } catch (error) {
            console.error('Error fetching unread messages:', error);
        }
    };


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

    const handleSuggestionError = (event) =>{
        event.preventDefault()
        setMessage('You need to login first !')

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

    useEffect(() => {
        const slideInterval = setInterval(() => {
            if(slideIndex !== 4){
                next()
            } 
            if(slideIndex === 4){
                setPositionValue(0)
                setSlideIndex(0)
            }
        }, 8000)    
        return () => {
            clearInterval(slideInterval)
        }
      }, [slideIndex])

    
    ////////////////////////////////////////////////////////////////////////////////// SCROLLBAR - ANIMATION
    const [scrollY, setScrollY] = useState(0);

    const handleScroll = () => {
      const scrollTop = window.scrollY; 
      setScrollY(scrollTop);
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const getAnimationClass = (position) => {
        return scrollY > position ? "animated" : "";
    };

    const [chatOpen , setChatOpen] = useState(false)

    return(
    <>
        <Header />

        <main className="home--main">
            {messageAlert && messageAlert.length >0 && <div className='chat__unread'></div>}
            <div className='chat__btn'  onClick={()=>setChatOpen(!chatOpen)}>
                <FontAwesomeIcon className='chat__btn__icon' icon={faComments} />
            </div>
            {chatOpen && (
                <ChatInbox onClick={()=>setChatOpen(false)}/>
            )}
        {/* ----------------------------- section - banner ----------------------------- */}
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
                            <div className='album--flex'>
                                <div className='banner-left'>
                                    <p>Join us for creative activities!</p>
                                    <h1>Oui! <strong>We Make Team</strong></h1>
                                    <p>Let's having our team for creative activities!</p>
                                    {token ? (
                                        <Link to="/mypage">Go to my Page</Link>
                                    ):(
                                        <Link to="/creataccount">Join our Team</Link>
                                    )}
                                </div>
                                <div className='banner-right'>
                                    <div className='banner-right__pattern banner-1'></div>
                                </div>
                            </div>

                            <div className='album--flex'>
                                <div className='banner-left'>
                                    <p>Join us to build applications!</p>
                                    <h2>We Make <strong>DEV</strong> Team</h2>                        
                                    <p>Build a team for application development!</p>
                                    {token ? (
                                        <Link to="/mypage">Go to my Page</Link>
                                    ):(
                                        <Link to="/forum/dev">Go to Forum</Link>
                                    )}
                                </div>
                                <div className='banner-right'>
                                    <div className='banner-right__pattern banner-2'></div>
                                </div>
                            </div>

                            <div className='album--flex'>
                                <div className='banner-left'>
                                    <p>Join us for efficient learning!</p>
                                    <h2>We Make <strong>STUDENT</strong> Team</h2>      
                                    <p>Build a team for efficient learning!</p>
                                    {token ? (
                                        <Link to="/mypage">Go to my Page</Link>
                                    ):(
                                        <Link to="/forum/student">Go to Forum</Link>
                                    )}
                                </div>
                                <div className='banner-right'>
                                    <div className='banner-right__pattern banner-3'></div>
                                </div>
                            </div>

                            <div className='album--flex'>
                                <div className='banner-left'>
                                    <p>Join us for successful performance!</p>
                                    <h2>We Make <strong>SPORT</strong> Team</h2>                          
                                    <p>Build a team for a successful performance!</p>
                                    {token ? (
                                        <Link to="/mypage">Go to my Page</Link>
                                    ):(
                                        <Link to="/forum/sport">Go to Forum</Link>
                                    )}
                                </div>
                                <div className='banner-right'>
                                    <div className='banner-right__pattern banner-4'></div>
                                </div>
                            </div>

                            <div className='album--flex'>
                                <div className='banner-left'>
                                    <p>Join us to conquer!</p>
                                    <h2>We Make <strong>GAME</strong> Team</h2>                       
                                    <p>Build your team to win!</p>
                                    {token ? (
                                        <Link to="/mypage">Go to my Page</Link>
                                    ):(
                                        <Link to="/forum/game">Go to Forum</Link>
                                    )}
                                </div>
                                <div className='banner-right'>
                                    <div className='banner-right__pattern banner-5'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        {/* ----------------------------- section - 4 category ----------------------------- */}
            <section className='home--main--category'>
                <div className="category--left">
                    <div className="category--left-title">
                        <p>Discover Our Categories!</p>
                        <h2>Our Forum Categories</h2>
                    </div>
                    <div className="category-left-description">
                        <p>
                            Explore our forum's main categories: Dev, Student, Sport, and Game. Each category offers a unique space for discussion and engagement, catering to diverse interests and passions.
                        </p>
                        <br />
                        <p>
                            Dive into vibrant conversations, share insights, and connect with like-minded individuals. Whether you're a developer seeking tech insights, a student looking for academic support, a sports enthusiast discussing the latest games, or a gamer exploring new strategies, our forum has something for everyone.
                        </p>
                        {token ? (
                            <Link to="/mypage">Go to my Page</Link>
                        ):(
                            <Link to="/creataccount">Join our Team</Link>
                        )}
                    </div>
                </div>

                <div className="category--right">
                    <div className={`scroll-container ${getAnimationClass(300)} category-right__box`}>
                        <FontAwesomeIcon icon={faBookOpen} className='fontawesome' />
                        <h3>Team for studying together!</h3>
                        <p>Collaborate, learn, and excel with our student community.</p>
                        <Link to="/forum/student">Go to STUDENT forum <FontAwesomeIcon icon={faChevronRight} /></Link>    
                    </div>
                    <div className={`scroll-container ${getAnimationClass(300)} category-right__box`}>
                        <FontAwesomeIcon icon={faFootball} className='fontawesome' />
                        <h3>Team for sportif activities!</h3>
                        <p>Engage in sports discussions, workout tips, and training routines.</p>
                        <Link to="/forum/sport">Go to SPORT forum <FontAwesomeIcon icon={faChevronRight} /> </Link> 
                    </div>
                    <div className={`scroll-container ${getAnimationClass(400)} category-right__box`}>
                        <FontAwesomeIcon icon={faCode} className='fontawesome' />
                        <h3>Team for working together!</h3>
                        <p>Connect with developers, designers, and tech enthusiasts for projects and challenges.</p>
                        <Link to="/forum/dev">Go to DEV forum <FontAwesomeIcon icon={faChevronRight} /> </Link>
                    </div>
                    <div  className={`scroll-container ${getAnimationClass(400)} category-right__box`}>
                        <FontAwesomeIcon icon={faGamepad} className='fontawesome' />
                        <h3>Team for winning the match!</h3>
                        <p>Explore gaming strategies, share experiences, and compete with friends.</p>
                        <Link to="/forum/game">Go to GAME forum <FontAwesomeIcon icon={faChevronRight} /> </Link> 
                    </div>
                </div>
            </section>


        {/* ----------------------------- section - about us ----------------------------- */}
            <section className='home--main--aboutus'>
                <div className="aboutus--left">
                    <div className="aboutus-left--left">
                        <img src="/assets/imgs/aboutus1.jpg" alt="" />
                        <div className="aboutus-left--left__deco">
                            RECOMMENDATIONS
                            <span>+ 300</span>
                        </div>
                    </div>
                    <div className="aboutus-left--right">
                        <img   src="/assets/imgs/aboutus2.jpg" alt="" />
                    </div>
                </div>

                <div className="aboutus--right">
                    <p>Welcome to our forum!</p>
                    <h2>About us</h2>
                    <p>
                        Our forum was born out of a desire to create a vibrant community where people from all walks of life could come together to share their knowledge and experiences.
                    </p>
                    <p>Our goal is to create a welcoming and supportive community for all.</p>
                    <div className="aboutus-right--flex">
                        <div className="aboutus-right--flex__table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Guidelines</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Respect others' opinions</td>
                                </tr>
                                <tr>
                                    <td>Avoid spamming</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        <div className="aboutus-right--flex__table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Member Benefits</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Access to exclusive resources</td>
                                    </tr>
                                    <tr>
                                        <td>Opportunities for collaboration</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>


        {/* ----------------------------- section - report-system ----------------------------- */}
            <section className='home--main--report-system'>
                <p>something here</p>
                <h2>Our report system</h2>
                <div className="report-system--flex">
                    <div className={`scroll-container ${getAnimationClass(1950)} report-system__box`}>
                        <p className='report-system__number'>01</p>
                        <div className='report-system__box__content'>
                            <div className="report-system__box--flex">
                                <div className="report-systme__box__icon">
                                    <FontAwesomeIcon className="fontawesome" icon={faFlag} />
                                </div>
                                <div className="report-systme__box__title">
                                    Report Inappropriate Content
                                </div>
                            </div>
                            <p>Click the report button on</p>
                            <p>any post containing aggressive</p>
                            <p>or illegal content.</p>
                        </div>
                    </div>

                    <div  className={`scroll-container ${getAnimationClass(2000)} report-system__box`}>
                        <p className='report-system__number'>02</p>
                        <div className='report-system__box__content'>
                            <div className="report-system__box--flex">
                                <div className="report-systme__box__icon">
                                    <FontAwesomeIcon className="fontawesome" icon={faUserTie} />
                                </div>
                                <div className="report-systme__box__title">
                                    Reporting to Admins
                                </div>
                            </div>
                            <p>The report is immediately</p>
                            <p>sent to the administrators.</p>
                            <p></p>
                        </div>
                    </div>

                    <div className={`scroll-container ${getAnimationClass(2150)} report-system__box`}>
                        <p className='report-system__number'>03</p>
                        <div className='report-system__box__content'>
                            <div className="report-system__box--flex">
                                <div className="report-systme__box__icon">
                                    <FontAwesomeIcon className="fontawesome" icon={faScrewdriverWrench} />
                                </div>
                                <div className="report-systme__box__title">
                                    Admin Review and Action
                                </div>
                            </div>
                            <p>The administrator reviews</p>
                            <p>the report and takes</p>
                            <p>appropriate action.</p>
                        </div>
                    </div>

                    <div className={`scroll-container ${getAnimationClass(2200)} report-system__box`}>
                        <p className='report-system__number'>04</p>
                        <div className='report-system__box__content'>
                            <div className="report-system__box--flex">
                                <div className="report-systme__box__icon">
                                    <FontAwesomeIcon className="fontawesome" icon={faSprayCanSparkles} />
                                </div>
                                <div className="report-systme__box__title">
                                    Clean and Enjoyable Forum
                                </div>
                            </div>
                            <p> A clean and enjoyable</p>
                            <p>forum is achieved</p>
                            <p>Thanks to Your Efforts</p>
                        </div>
                    </div>
                </div>
            </section>


        {/* ----------------------------- section - form-suggestion ----------------------------- */}
            <section className='home--main--form'>
                <div className="home-form__title">
                    <h2>Tell us about your suggestions or Ideas!</h2>
                    <p>If you have any thoughts or ideas that could help improve our platform, we'd love to hear from you.</p>
                    <p>Feel free to share your feedback, suggestions, or any other comments you may have.</p>
                </div>

                <div className="home-form__form">
                    <form onSubmit ={ decodedToken !== null ? (event => handleCreateSuggestion(event, decodedToken)) : (event => handleSuggestionError(event))} action="">
                        <p>description below <span>* log in obligation</span></p>
                        <h3>Share Your Ideas</h3>
                        <textarea name="suggestion" id="categoryidea" cols="50" rows="5" placeholder="write here an idea or suggestion of our platform."></textarea>
                        <input type="submit" className='home--submitbtn' value={"submit"} />
                        {message && <p className='successMessage'>{message}</p>}
                    </form>
                </div>
            </section>


        {/* ----------------------------- section - publicity ----------------------------- */}
            <section className="home--main--publicity">
                <div className="publicity__title">
                    <h2>Go to Dev Forum</h2>
                    <p>One of the most popular categories on our forum is the Dev category. <br /> Join us and participate!</p>
                    <Link to="/forum/dev">Go to Forum</Link>
                </div>
                <div className="publicity__btn">
                    <a href="/forum/dev">
                        <FontAwesomeIcon icon={faCircleChevronRight} className='btn' />
                    </a>
                </div>
            </section>


        {/* ----------------------------- section - our-team ----------------------------- */}
            <section className='home--main--our-team'>
                <p>Meet the team behind the scenes.</p>
                <h2>Our Staff Team</h2>
                <div className="our-team--flex">
                    <div className={`scroll-container ${getAnimationClass(3400)} our-team__box`}>
                        <div className="our-team__box__img">
                            <img src="/assets/imgs/member1.jpg" alt="" />
                        </div>
                        <div className='our-team__box__name'>
                            <p>Yeonsoo Kang</p>
                            <p>Keeping things running smoothly!</p>
                            <a target="_blank" href="https://yeonsookang.pro/">visit staff profile</a>
                        </div>
                    </div>
                    <div className={`scroll-container ${getAnimationClass(3450)} our-team__box`}>
                        <div className="our-team__box__img">
                            <img src="/assets/imgs/member2.jpg" alt="" />
                        </div>                        
                        <div className='our-team__box__name'>
                            <p>Antoine</p>
                            <p>Making things happen!</p>
                            <a href="/userprofile/2">visit staff profile</a>
                        </div>
                    </div>
                    <div className={`scroll-container ${getAnimationClass(3500)} our-team__box`}>
                        <div className="our-team__box__img">
                            <img src="/assets/imgs/member3.jpg" alt="" />
                        </div>                        
                        <div className='our-team__box__name'>
                            <p>Mathis</p>
                            <p>Ensuring your satisfaction!</p>
                            <a href="/userprofile/3">visit staff profile</a>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <Footer />
    </>
    )
}

export default HomePage
