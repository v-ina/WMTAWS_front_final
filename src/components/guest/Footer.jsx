import './Footer.scss'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'


function Footer (){
    return(
    <>
        <footer>
            <ul>
                <li>
                    <Link to="/forum/dev">Go to DEV forum <FontAwesomeIcon icon={faChevronRight} /></Link>
                </li>
                <li>
                    <Link to="/forum/student">Go to STUDENT forum <FontAwesomeIcon icon={faChevronRight} /></Link>
                </li>
                <li>
                    <Link to="/forum/sport">Go to SPORT forum <FontAwesomeIcon icon={faChevronRight} /></Link>
                </li>
                <li>
                    <Link to="/forum/game">Go to GAME forum <FontAwesomeIcon icon={faChevronRight} /></Link>
                </li>
            </ul>
            <hr />
            <p>&copy; copyright 2023 yeonsoo kang &nbsp; | &nbsp; <Link to="">see our polices here</Link> </p>
        </footer>
    </>
    )
}

export default Footer