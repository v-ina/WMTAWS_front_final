import './MyListPage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import { apiPort, apiUrl } from '../../utils/apiConfigs'

function MyListPage(){

    const{currentMyList} = useParams()
    
    /////////////////////////////////////////////////////////////////////////////////////// ACCES
    // navigate - Accès direct interdit depuis l'URL
    const navigate = useNavigate();
    useEffect(()=>{
        if(localStorage.getItem("jwt") === null){
            return navigate('/login')
        }
    },[])
    
 
    ///////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - récupérer tous les Likes d'utilisateur 
    const [likeList, setLikeList] = useState(null)
    useEffect(()=>{
        (async()=>{
            const token = localStorage.getItem("jwt") 
            const responseOfFetch = await fetch(`https.we-make-team.click/api/likes`, {
                method : "GET",
                headers : {
                    Authorization : `Barer ${token}`
                }
            })
            const responseToJson = await responseOfFetch.json()
            setLikeList(responseToJson.data)
        })()
    },[]) 
    let currentUserLikeList
    if(likeList){
        const token = localStorage.getItem("jwt") 
        const decodedToken = jwtDecode(token)
        currentUserLikeList = likeList.filter(like => like.userId === decodedToken.data.userId)
    }

    // BDD - récupérer tous les Articles d'utilisateur    
    const [articeList, setArticleList] = useState(null)
    useEffect(()=>{
        (async()=>{
            const responseOfFetch = await fetch(`https.we-make-team.click/api/articles`)
            const responseToJson = await responseOfFetch.json()
            setArticleList(responseToJson.data)
        })()
    },[]) 
    let currentUserArticleList
    if(articeList){
        const token = localStorage.getItem("jwt") 
        const decodedToken = jwtDecode(token)
        currentUserArticleList = articeList.filter(Article => Article.userId === decodedToken.data.userId)
    }

    // BDD - récupérer tous les commentraires d'utilisateur 
    const [commentList, setCommentList] = useState(null)
    useEffect(()=>{
        (async()=>{
            const responseOfFetch = await fetch(`https.we-make-team.click/api/comments`)
            const responseToJson = await responseOfFetch.json()
            setCommentList(responseToJson.data)
        })()
    },[]) 
    let currentUserCommentList
    if(commentList){
        const token = localStorage.getItem("jwt") 
        const decodedToken = jwtDecode(token)
        currentUserCommentList = commentList.filter(Comment => Comment.userId === decodedToken.data.userId)
    }


    return(
    <>
        <Header />
        <main className='mylist--main'>
            {currentMyList === "mylikes" && (
            <>
                <h2>My Likes</h2>
                <article>
                    {likeList && (
                        <>
                            {likeList.map((list)=>{
                            return( 
                                <div className="mylist--box">
                                    <div className="mylist__left">
                                        <h3><Link to={`/forum/${list.article.category.category}/${list.articleId}`}>{list.article.title.substr(1,list.article.title.length-2)}</Link></h3>
                                        <span>{list.article.user.username}</span>
                                        <span>{list.article.createAt}</span>
                                    </div>
                                    <div className="mylist__right">
                                        <p>{list.article.comments.length}</p>
                                        <p>cmt</p>
                                    </div>
                                </div>
                            )
                        })}
                        </>
                    )}
                </article>
            </>
            )}

            {currentMyList === "posts" && (
            <>                    
                <h2>My Articles</h2>
                <article>
                    {currentUserArticleList && (
                        <>
                        {currentUserArticleList.map((list)=>{
                        return(
                            <div className="mylist--box">
                                <div className="mylist__left">
                                    <h3><Link  to={`/forum/${list.category.category}/${list.id}`}>{list.title.substr(1,list.title.length-2)}</Link></h3>
                                    <span>{list.user.username}</span>
                                    <span>{list.createdAt.substr(0,10)}</span>
                                </div>
                                <div className="mylist__right">
                                    <p>{list.comments.length}</p>
                                    <p>cmt</p>
                                </div>
                            </div>
                        )
                    })}
                        </>
                    )}
                </article>
            </>
            )}

            {currentMyList === "mycomments" && (
            <>
                <h2>My Comments</h2>
                <article>
                    {currentUserCommentList && (
                        <>
                        {currentUserCommentList.map((list)=>{
                        return(
                            <div className="mylist--box">
                                <div className="mylist__left">
                                    <h3><Link to={`/forum/${list.article.category.category}/${list.articleId}`}>{list.article.title.substr(1,list.article.title.length-2)}</Link></h3>
                                    <h6> comment : {list.text}</h6>
                                    <span>{list.article.user.username}</span>
                                    <span>{list.article.createdAt.substr(0,10)}</span>
                                </div>
                                <div className="mylist__right">
                                    <p>{list.article.comments.length}</p>
                                    <p>cmt</p>
                                </div>
                            </div>
                        )
                    })}
                        </>
                    )}
                </article>
            </>
            )} 
        </main>
        <Footer />
    </>
    )
}
export default MyListPage