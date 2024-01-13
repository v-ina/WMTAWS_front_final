import './Header.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useState} from 'react'
import { jwtDecode } from 'jwt-decode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faCode, faFootball, faGamepad, faRightToBracket, faUser, faRightFromBracket, faLock } from '@fortawesome/free-solid-svg-icons'
import { faFilePen, faHeartCirclePlus, faComments, faPaste, faChevronRight } from '@fortawesome/free-solid-svg-icons'


function Header ({currentPage}){

    const navigate = useNavigate();
    const token = localStorage.getItem('jwt')
    

    ////////////////////////////////////////////////////////////////// MENU BURGER
    // menuburger - toggle fucntion
    const [menuburger, setMenuburger] = useState(false)
    if(menuburger){
        document.body.style = 'overflow : hidden'
    } else {
        document.body.style = 'overflow : unset'
    }
    
    // menuburger - debug against transition animation
    const handleMenuClick = (event, url) => {
        setMenuburger(!menuburger);
        setTimeout(() => {
            navigate(url);
        }, "100");
    }


    ////////////////////////////////////////////////////////////////// BLUR BACKGROUND
    // background - add blur filter
    const menuburgerClickEvent = ()=>{
        setMenuburger(!menuburger)
        if(menuburger){
            document.body.style = 'overflow : hidden'
        } else {
            document.body.style = 'overflow : unset'
        }
    }

    // background - add close sidebar function
    const closeSidebar=() =>{
        setMenuburger(!menuburger)
    }
    
    
    ////////////////////////////////////////////////////////////////// LOG OUT
    // logout - debug against removing token
    const handleLogout = () => {
        setTimeout(()=>{
            localStorage.removeItem("jwt")
        },'100')
        setTimeout(()=>{
            navigate("/")
            window.location.reload()
        },'100')
    }  


    return(
    <>
        <header>
        <div onClick={closeSidebar} className={menuburger? "overlay__blur":""}></div>
        <nav className="header--navbar">
            <ul>
                <li>
                    <Link to="/">
                        <img src="/assets/imgs/logo.png" alt="site logo" />
                    </Link>
                </li>
                <li>
                    <Link to="/forum/dev">
                        <FontAwesomeIcon className = {currentPage === 'dev' ? 'fontawesome i__opacity' : 'fontawesome' }  icon={faCode} />
                        <p>DEV</p>
                    </Link>
                </li>
                <li>
                    <Link to="/forum/student">
                        <FontAwesomeIcon className = {currentPage === 'student' ? 'fontawesome i__opacity' : 'fontawesome' }  icon={faBookOpen} />
                        <p>STUDENT</p>
                    </Link>
                </li>
                <li>
                    <Link to="/forum/sport">
                        <FontAwesomeIcon className = {currentPage === 'sport' ? 'fontawesome i__opacity' : 'fontawesome' }  icon={faFootball} />
                        <p>SPORT</p>
                    </Link>
                </li>
                <li>
                    <Link to="/forum/game">
                        <FontAwesomeIcon className = {currentPage === 'game' ? 'fontawesome i__opacity' : 'fontawesome' }  icon={faGamepad} />
                        <p>GAME</p>
                    </Link>
                </li>
                
                {token ? (
                    <>
                        <li>
                            <Link to="/creatpost">
                                <FontAwesomeIcon className = {currentPage === 'creatPostPage' ? 'fontawesome i__opacity' : 'fontawesome' }  icon={faFilePen} />
                                <p>Write</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/mypage">
                            <FontAwesomeIcon className = {currentPage === 'myPage' ? 'fontawesome i__opacity' : 'fontawesome' }  icon={faUser} /> 
                            <p>my profil</p>
                            </Link>
                        </li>
                        {jwtDecode(token).data.role !== 3 && (
                            <li>
                                <Link to="/admin/reports">
                                    <FontAwesomeIcon className='fontawesome' icon={faLock} />
                                    <p>ADMIN</p>
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link onClick={handleLogout}>  
                                <FontAwesomeIcon className='fontawesome' icon={faRightFromBracket} />
                                <p>Log out</p>
                            </Link>
                        </li>
                    </>
                ):(
                    <>                            
                        <li>
                            <Link to="/login">
                                <FontAwesomeIcon className = {currentPage === 'loginPage' ? 'fontawesome i__opacity' : 'fontawesome' }  icon={faRightToBracket} /> 
                                <p>Log in</p>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>


        <nav className="header--navbar--mobile">
            <Link to="/">
                <img src="/assets/imgs/logo.png" alt="site logo" />
            </Link>
            <div className="navbar--mobile__menuicon" onClick={menuburgerClickEvent}>
                <span className={menuburger? 'checked':''}></span>
                <span className={menuburger? 'checked':''}></span>
                <span className={menuburger? 'checked':''}></span>
            </div>
            <div className="navbar--mobile__sidebar" style={menuburger? {right:0, opacity:1}:{right:'-80%', opacity:0}}>
                {token ? (
                    <div className="user__infos">
                        <Link to='/mypage'><div className="user__img"></div></Link>
                        <Link to='/mypage'><p className="user__name">{jwtDecode(token).data.username}</p></Link>
                    </div>
                ):(
                    <div className="user__infos">
                        <Link to="/login"><div className="user__img"></div></Link>
                        <Link to="/login"><p className="user__name">Let's Join us!</p></Link>
                    </div>
                )}

                <nav>
                    {token ? (
                        <ul className="pageshortcut">
                            <li>
                                <Link to="/creatpost">
                                    <FontAwesomeIcon className='fontawesome' icon={faFilePen} />
                                    <p>Write</p>
                                </Link>    
                            </li>
                            <li onClick={handleLogout}>
                                <FontAwesomeIcon className='fontawesome' icon={faRightFromBracket} />
                                <p>Log out</p>
                            </li>
                        </ul>
                    ):(
                        <ul className="pageshortcut">
                            <li>
                                <Link to="/login">
                                    <FontAwesomeIcon className='fontawesome' icon={faFilePen} />
                                    <p>Write</p>
                                </Link>    
                            </li>
                            <li>
                                <Link to="/login">
                                <FontAwesomeIcon className='fontawesome' icon={faRightToBracket} />
                                    <p>Log In</p>
                                </Link>
                            </li>
                        </ul>
                    )}
                </nav>    
                <nav>
                    <ul className="pageshortcut"> 
                        <li onClick={(event) => {token? (handleMenuClick(event, "/mylist/mylikes")) : (handleMenuClick(event, "/login"))} }>
                                <FontAwesomeIcon className='fontawesome' icon={faHeartCirclePlus} />
                            <p>My likes</p>
                        </li>
                        <li onClick={(event) => {token? (handleMenuClick(event, "/mylist/mycomments")) : (handleMenuClick(event, "/login"))}}>
                                <FontAwesomeIcon className='fontawesome' icon={faComments} />
                            <p>My comments</p>
                        </li>
                        <li onClick={(event) => {token? (handleMenuClick(event, "/mylist/posts")) : (handleMenuClick(event, "/login"))}}>
                                <FontAwesomeIcon className='fontawesome' icon={faPaste} />
                                <p>My posts</p>
                        </li>
                    </ul>
                </nav>  
                <hr />
                <ul className="forumshortcut"> 
                    <li onClick={(event) => handleMenuClick(event, "/forum/dev")}>
                        <span>Go to DEV forum</span> <FontAwesomeIcon icon={faChevronRight} />
                    </li>
                    <li onClick={(event) => handleMenuClick(event, "/forum/student")}>
                        <span>Go to STUDENT forum</span> <FontAwesomeIcon icon={faChevronRight} />
                    </li>
                    <li onClick={(event) => handleMenuClick(event, "/forum/sport")}>
                        <span>Go to SPORT forum</span> <FontAwesomeIcon icon={faChevronRight} />
                    </li>
                    <li onClick={(event) => handleMenuClick(event, "/forum/game")}>
                        <span>Go to GAME forum</span> <FontAwesomeIcon icon={faChevronRight} />
                    </li>
                </ul>
            </div>
        </nav> 
        </header>
    </>
    )
}

export default Header