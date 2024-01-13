import '../admin/AdminHeader.scss'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsersGear, faCircleQuestion, faUserSecret, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'
import { useVerifyUserIsLogged } from '../../utils/security-utils';


function AdminHeader(){

    const token = localStorage.getItem("jwt") 
    
    // const navigate = useNavigate();

    useVerifyUserIsLogged()
    const navigate = useNavigate();
    useEffect(()=>{
        if(token === null){
            return navigate('/login')
        } 
    },[])

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
        <nav class="adminheader--navbar">
            {token && (
            <ul>
                <li>
                    <Link to='/'>
                        <img src="/assets/imgs/logo.png" alt="" />
                    </Link>
                </li>

                {jwtDecode(token).data.role === 1 && (
                    <li>
                        <Link to='/admin/manageusers'>
                            <FontAwesomeIcon  className='fontawesome' icon={faUsersGear} />
                            <p>manage user</p>
                        </Link>
                    </li>
                )}
                
                <li>
                    <Link to='/admin/suggestions'>
                        <FontAwesomeIcon  className='fontawesome' icon={faCircleQuestion} />
                        <p>suggetions</p>
                    </Link>
                </li>
                <li>
                    <Link to='/admin/reports'>
                        <FontAwesomeIcon  className='fontawesome' icon={faUserSecret} />
                        <p>report</p>
                    </Link>
                </li>
                <li>
                    <Link to='/' onClick={handleLogout}>
                        <FontAwesomeIcon  className='fontawesome' icon={faRightFromBracket} />
                        <p>Log out</p>
                    </Link>
                </li>
            </ul>

            )}
        </nav>
        </header>
    </>
    )
}


export default AdminHeader