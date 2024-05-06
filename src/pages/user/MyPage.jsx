import './MyPage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHeartCirclePlus, faComments, faPaste} from '@fortawesome/free-solid-svg-icons'
import { apiPort, apiUrl } from '../../utils/apiConfigs'


function MyPage(){
    
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
    const [loginUser, setLoginuser] = useState(null)
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

    
    // my lists pour version mobile
    const [currentList, setCurrentList] = useState('')

    ///////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - récupérer tous les Likes d'utilisateur 
    const [likeList, setLikeList] = useState(null)
    const handleClickLikeList = async() =>{
        const token = localStorage.getItem("jwt") 
        const responseOfFetch = await fetch(`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/api/likes`, {
            method : "GET",
            headers : {
                Authorization : `Barer ${token}`
            }
        })
        const responseToJson = await responseOfFetch.json()
        setLikeList(responseToJson.data)
        setCurrentList('like')
    }
    let currentUserLikeList
    if(likeList){
        const token = localStorage.getItem("jwt") 
        const decodedToken = jwtDecode(token)
        currentUserLikeList = likeList.filter(like => like.userId === decodedToken.data.userId)
    }

    // BDD - récupérer tous les Articles d'utilisateur    
    const [articeList, setArticleList] = useState(null)
    const handleClickArticleList = async() =>{
        const responseOfFetch = await fetch(`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/api/articles`)
        const responseToJson = await responseOfFetch.json()
        setArticleList(responseToJson.data)
        setCurrentList('article')
    }
    let currentUserArticleList
    if(articeList){
        const token = localStorage.getItem("jwt") 
        const decodedToken = jwtDecode(token)
         currentUserArticleList = articeList.filter(Article => Article.userId === decodedToken.data.userId)
    }
    
    // BDD - récupérer tous les commentraires d'utilisateur 
    const [commentList, setCommentList] = useState(null)
    const handleClickCommentList = async() => {
        const responseOfFetch = await fetch(`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/api/comments`)
        const responseToJson = await responseOfFetch.json()
        setCommentList(responseToJson.data)
        setCurrentList('comment')
    }
    let currentUserCommentList
    if(commentList){
        const token = localStorage.getItem("jwt") 
        const decodedToken = jwtDecode(token)
         currentUserCommentList = commentList.filter(Comment => Comment.userId === decodedToken.data.userId)
    }


    return(
    <>
        <Header currentPage={"myPage"}/>
            {loginUser && (
                <main className="mypage--main">
                    <h2>Hello,&nbsp; {loginUser.username} !</h2>
                    <div className="mypage--user__info">
                        <p className="mypage--user__content">
                            {loginUser.introduction}
                        </p>
                        <div className="mypage--user__img">
                            <div className='mypage--user__img__photo'>
                                <img src={loginUser.photo !== null ? (loginUser.photo) : (`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/userphotos/randomUser.jpg`)} alt="image utilisateur" />
                            </div>
                            <div>
                                <p>discord : {loginUser.discordId}</p>
                                <Link to='/mypage/edit'>edit my personal infos</Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <ul className="mypage--pageshortcut">
                            <li>
                                <Link to='/mylist/mylikes'>
                                    <FontAwesomeIcon icon={faHeartCirclePlus} className='fontawesome'/>
                                    <p>My likes</p>
                                </Link>
                            </li>
                            <li>
                                <Link to='/mylist/mycomments'>
                                <FontAwesomeIcon icon={faComments} className='fontawesome'/>
                                        <FontAwesomeIcon icon="fa-solid fa-comments" />
                                    <p>My comments</p>
                                </Link>
                            </li>
                            <li>
                                <Link to='/mylist/posts'>
                                <FontAwesomeIcon icon={faPaste} className='fontawesome'/>
                                    <p>My posts</p>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <ul className="mypage--mylist">
                            <li onClick={handleClickLikeList} >
                                <p>My likes</p>
                            </li>
                            <li onClick={handleClickCommentList} >
                                <p>My comments</p>
                            </li>
                            <li onClick={handleClickArticleList} >
                                <p>My posts</p>
                            </li>
                        </ul>
                    </div>
                {currentList ==='' && (
                    <div className='mypage--mylist__noresult'>click categories above</div>
                )}    
                {currentList === 'like' && (
                <>
                    {currentUserLikeList.length >0 ? (
                    <>
                        {currentUserLikeList.map(list =>{
                            return (
                                <div className="mypage--mylist--mobile">
                                    <div className="mypage--mylist__left">
                                        <h3>{list.article.title.substr(1,list.article.title.length-2)}</h3>
                                        <span>{list.article.user.username}</span>
                                        <span>{list.article.createdAt.substr(0,10)}</span>
                                    </div>
                                    <div className="mypage--mylist__right">
                                        <p>{list.article.comments.length}</p>
                                        <p>댓글</p>
                                    </div>
                                </div>
                            )
                    })}
                    </>
                    ):(
                        <div className='mypage--mylist__noresult'>you didn't put like yet</div>
                    )}
                </>
                )}
                    
                {currentList === 'comment' && (
                <>
                    {currentUserCommentList.length >0 ? (
                    <>
                        {currentUserCommentList.map(list => {
                            return (
                                <div className="mypage--mylist--mobile">
                                    <div className="mypage--mylist__left">
                                        <h3>{list.article.title.substr(1,list.article.title.length-2)}</h3>
                                        <span>{list.article.user.username}</span>
                                        <span>{list.article.createdAt.substr(0,10)}</span>
                                    </div>
                                    <div className="mypage--mylist__right">
                                        <p>{list.article.comments.length}</p>
                                        <p>댓글</p>
                                    </div>
                                </div>
                            )
                    })}
                    </>
                    ):(
                        <div className='mypage--mylist__noresult'>you didn't put comments yet</div>
                    )}
                </>
                )}

                {currentList === 'article' && (
                <>
                    {currentUserArticleList.length >0 ? (
                    <>
                        {currentUserArticleList.map(list => {
                            return (
                                <div className="mypage--mylist--mobile">
                                    <div className="mypage--mylist__left">
                                        <h3>{list.title.substr(1,list.title.length-2)}</h3>
                                        <span>{list.user.username}</span>
                                        <span>{list.createdAt.substr(0,10)}</span>
                                    </div>
                                    <div className="mypage--mylist__right">
                                        <p>{list.comments.length}</p>
                                        <p>댓글</p>
                                    </div>
                                </div>
                            )
                    })}
                    </>
                    ): (
                        <div className='mypage--mylist__noresult'>you didn't post any article</div>
                    )}
                </>
                )}
                </main>
            )}
        <Footer/>
    </>
    )
}

export default MyPage