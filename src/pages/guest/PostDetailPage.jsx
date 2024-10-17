import './PostDetailPage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faChevronRight, faComments } from '@fortawesome/free-solid-svg-icons'
import { apiPort, apiUrl } from '../../utils/apiConfigs'
import ChatInbox from '../../components/ChatInbox'


function PostDetailPage(){

    const {forumCategory} = useParams()
    const {postId} = useParams()
    const navigate = useNavigate();
    const [editCommentStates, setEditCommentStates] = useState([]);

    ////////////////////////////////////////////////////////////////////////////////// SECURITE
    // securite - verifier le token    
    const token = localStorage.getItem('jwt')
    let decodedToken = null
    if (token) {
        decodedToken = jwtDecode(token)
    }

    ///////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - recuperer current article
    const [currentArticle, setCurrentArticle] = useState(null)
    const [comments, setComments] = useState(null)
    const [message, setMessage] = useState(null)
    useEffect(()=>{
        (async()=>{
            const responseOfFetch = await fetch(`https.we-make-team.click/api/articles/${postId}`)
            const responseToJson = await responseOfFetch.json()
            // const postText = responseToJson.data.text.replace(/\r\n|\n|\r/g,'<br/>')
            
            setCurrentArticle(responseToJson.data)  
            setEditCommentStates(Array(2).fill(false))
        })()
    },[postId, comments, message])

    let currentForumCategory = ''
    if (currentArticle){
        {currentArticle.categoryId === 1 && (currentForumCategory = 'dev')}
        {currentArticle.categoryId === 2 && (currentForumCategory = 'student')}
        {currentArticle.categoryId === 3 && (currentForumCategory = 'sport')}
        {currentArticle.categoryId === 4 && (currentForumCategory = 'game')}
    }

    const articleText = () =>{
        const element = []
        if(currentArticle){
            const articleWithEnter = currentArticle.text.substr(1,currentArticle.text.length-2).split(`\\n`);
            articleWithEnter.map(eachline =>{
                return element.push(<p> {eachline} </p>)
            })
        }
        return element
    }
    

    /////////////////////////////////////////////////////////////////////////////////////////////// FUNCTION - LIKE
    // like - toggle like btn
    const [liked, setLiked] = useState(false)
    const addLike =() =>{
        setLiked(!liked)
        if(!liked){
            postLikeRoute()
            window.location.reload()
        } else {
            deleteLikeRoute()
            window.location.reload()
        }
    }

    // BDD - ajoute like
    const postLikeRoute = async() => {
        const token = localStorage.getItem("jwt")
        const responseOfFetch = await fetch(`https.we-make-team.click/api/likes/${postId}`,{
            method : "POST",
            headers : {
                Authorization : `Barer ${token}`
            }
        })
    }

    // BDD - supprimer like
    const deleteLikeRoute = async() => {
        const token = localStorage.getItem("jwt")
        const responseOfFetch = await fetch(`https.we-make-team.click/api/likes/${postId}`,{
            method : "DELETE",
            headers : {
                Authorization : `Barer ${token}`
            }
        })
    }
    

    /////////////////////////////////////////////////////////////////////////////////////////////// COMMENT
    // comment toggle function
    const [wantToEditComment, setWantToEditComment] = useState(false)
    const editComment = (event, index) =>{
        setWantToEditComment(prevState => {
            return {...prevState, [index]: !prevState[index]}
        })
    }

    // comment - create
    const handleCreateComment = async(event) => {
        event.preventDefault()
        const token = localStorage.getItem("jwt")
        if(token){
            const decodedToken = jwtDecode(token)
            const comment = event.target.comment.value
            const commentCreate = {
                text : comment,
                userId : decodedToken.data.username, 
                articleId : postId
            }
            const commentToJson = JSON.stringify(commentCreate)
            const createCommentResponse = await fetch(`https.we-make-team.click/api/comments`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Barer ${token}`
                },
                body : commentToJson
            })
            if(createCommentResponse.status === 200 || createCommentResponse.status ===204 ) {
                setComments(commentCreate.text)
            } else {
                const errorResponse = await createCommentResponse.json()
                setComments(errorResponse.data)
            }
        }
    }

    // comment - edit
    const handleEditComment = async(event, commentId) => {
        event.preventDefault()
        const token = localStorage.getItem("jwt")
        const decodedToken = jwtDecode(token)
        const comment = event.currentTarget.editcomment.value
        const commentUpdate = {
            text : comment,
            userId : decodedToken.data.username, 
            articleId : postId
        }
        const commentToJson = JSON.stringify(commentUpdate)
        const updateCommentResponse = await fetch(`https.we-make-team.click/api/comments/${commentId}`, {
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Barer ${token}`
            },
            body : commentToJson
        })
        if(updateCommentResponse.status === 200 || updateCommentResponse.status ===204 ) {
            setComments(commentUpdate.text)
            setWantToEditComment(false)
        } else {
            const errorResponse = await updateCommentResponse.json()
            setMessage(errorResponse.data)
        }
    }

    // comment - delete
    const handleDeleteComment = async(event, commentId) => {
        const token = localStorage.getItem("jwt")
        if(window.confirm(`do you want to delete this comment?`)){
            alert(`this comment has been succesfuly deleted`)
            const deleteComment = await fetch(`https.we-make-team.click/api/comments/${commentId}`, {
                method : "DELETE",
                headers : {
                    Authorization : `Barer ${token}`
                }
            })
        } else {
            alert('your require was canceled')
        }
        setMessage('delete complete')
    }

    // comment - report 
    const handleReportComment = async(event, commentId) => {
        const token = localStorage.getItem("jwt")
        if(window.confirm(`do you want to report this comment?`)){
            alert(`this comment has been succesfuly reported`)
            const createReportComment = await fetch(`https.we-make-team.click/api/reports/reportComment/${commentId}`, {
                method : "POST",
                headers : {
                    Authorization : `Barer ${token}`
                }
            })
        } else{
            alert('your require was canceled')
        } 
    }


    /////////////////////////////////////////////////////////////////////////////////////////////// ARTICLE
    // article - edit
    const handleEditArticle = async(event, articleId) => {
        if(window.confirm(`do you want to edit this article? All attached files will be reset.`)){
            navigate(`/postedit/${articleId}`)
        } else {
            alert('your require was canceled')
        }
    }

    // article - delete
    const handleDeleteArticle = async() => {
        const token = localStorage.getItem("jwt")
        if(window.confirm(`do you want to delete this article?`)){
            alert(`this article has been succesfuly deleted`)
            const deleteArticle = await fetch(`https.we-make-team.click/api/articles/${currentArticle.id}`, {
                method : "DELETE",
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })
            navigate(`/forum/${currentArticle.category.category}`)
        } else {
            alert('your require was canceled')
        }
        setMessage('delete complete')
    }

    // article - report
    const handleReportArticle = async(event, articleId) => {
        const token = localStorage.getItem("jwt")
        if(window.confirm(`do you want to report this article?`)){
            alert(`this article has been succesfuly reported`)
            const createReportArticle = await fetch(`https.we-make-team.click/api/reports/reportArticle/${articleId}`, {
                method : "POST",
                headers : {
                    Authorization : `Barer ${token}`
                }
            })
        } else{
            alert('your require was canceled')
        } 
    }


    /////////////////////////////////////////////////////////////////////////////////////////////// BOUTON
    // comment edit bouton toggle 
    const toggleEditComment = (index) => {
        setEditCommentStates(prevStates => {
          const newStates = [...prevStates]
          newStates[index] = !newStates[index]
          return newStates
        })
      }

    // montre edit/erase bouton juste pour les authors de commentaire
    const addHandleButtonByUser = (comment, index) => {
        const token = localStorage.getItem("jwt")
        const element = []
        if(token !==null){
            const decodedToken = jwtDecode(token)
            if(comment.userId === decodedToken.data.userId ){
                element.push(
                    <div className="post--comment__by__edit">
                        <span key={index}  onClick={() => toggleEditComment(index)}>edit</span>
                        &nbsp; / &nbsp;
                        <span onClick={(event)=>handleDeleteComment(event, comment.id)}>erase</span>
                    </div>
                )
            } else {
                element.push(
                    <div className="post--comment__by__signal" onClick={(event)=>handleReportComment(event, comment.id)}>* report</div>
                )
            }
        }
        return element
    }


    // montre edit/delete bouton pour l'autre d'article OU montre report bouton pour les autres
    const reportOrDeleteBtn = () => {
        const token = localStorage.getItem("jwt")
        const decodedToken = jwtDecode(token)
        const element = []
        if(decodedToken.data.userId === currentArticle.userId || decodedToken.data.role === 1){
            element.push(
                <div className='post__management'>
                    <span onClick={event=> handleEditArticle(event,currentArticle.id)}>edit &nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span onClick={event => handleDeleteArticle(event, currentArticle.id)}>/&nbsp;&nbsp;&nbsp;&nbsp; delete</span>
                </div>
            )
        } else {
            element.push(
                <span  className='post__management' onClick={event => handleReportArticle(event, currentArticle.id)}>* report</span>
            )
        }
        return element
    }

    const [chatOpen , setChatOpen] = useState(false)
    const [messageAlert, setMessageAlert] = useState(null)
    useEffect(() => {
        if (token !== null) {
            const decoded = jwtDecode(token);
            checkUnreadMessage(decoded.data.userId);
        }
    }, [token]);

    const checkUnreadMessage = async (userId) => {
        try {
            const response = await fetch(`https.we-make-team.click/api/message/unread/${userId} `);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseToJson = await response.json();
            setMessageAlert(responseToJson);
        } catch (error) {
            console.error('Error fetching unread messages:', error);
        }
    };


    return(
        <>
            <Header currentPage={forumCategory}/>
            <main className='post--main'>
                {messageAlert && messageAlert.length >0 && <div className='chat__unread'></div>}
                <div className='chat__btn'  onClick={()=>setChatOpen(!chatOpen)}>
                    <FontAwesomeIcon className='chat__btn__icon' icon={faComments} />
                </div>
                {chatOpen && (
                    <ChatInbox onClick={()=>setChatOpen(false)}/>
                )}
                {currentForumCategory && (
                    <Link to={`/forum/${currentForumCategory}`}>
                        <h3>forum {currentForumCategory} <FontAwesomeIcon icon={faChevronRight} /> </h3>
                    </Link>
                )}
                <hr />
                {currentArticle && (
                    <>                        
                    <div className="post--title">
                        <h2>1/{currentArticle.numOfMember}</h2>
                        <h2>{currentArticle.title.substr(1,currentArticle.title.length-2)}</h2>
                        {token && (
                            <>
                                {liked || currentArticle.likes.find(user => user.userId === jwtDecode(token).data.userId)  ? (
                                    <FontAwesomeIcon icon={faHeart} className='fontawesome' style={{color : 'red'}} onClick={addLike}/>
                                ):(
                                    <FontAwesomeIcon icon={faHeart} className='fontawesome' onClick={addLike}/>
                                )}
                            </>
                        )}

                    </div>
                    <div className="post--user__infos">
                    <Link to={`/userprofile/${currentArticle.user.id}`}><div className="user__img"><img src={currentArticle.user.photo !== null ? (currentArticle.user.photo) : (`https.we-make-team.click/userphotos/randomUser.jpg`)} alt="image utilisateur" /></div></Link>

                        {/* <Link to={`/userprofile/${currentArticle.user.id}`}><div className="user__img"></div></Link> */}
                        <p className="user__name"><Link to={`/userprofile/${currentArticle.user.id}`}>{currentArticle.user.username}</Link></p>
                        <p>{currentArticle.createdAt.substr(0,10)}</p>
                        {token && (
                            <>
                                {reportOrDeleteBtn()}
                            </>
                        )}
                    </div>
                    <div style={{ whiteSpace: 'pre-line' }} className="post--content">
                        {currentArticle.attachment.length >=1 && (
                            // <div className="post--content__img">
                            //     <img src="/assets/imgs/imgsample.PNG" alt="" />
                            //     <img src="/assets/imgs/imgsample.PNG" alt="" />
                            // </div>
                            <div className="post--content__img">
                                {currentArticle.attachment.map((articleImg,index)=>{
                                    return(
                                        <img src={currentArticle.attachment[index]} alt="project image" />

                                     ) 
                                })} 
                                {/* <img src="/assets/imgs/imgsample.PNG" alt="" /> */}
                            </div>
                        )}
                        {articleText()}
                    </div>

                    <p className="post--comment__total">Comments &nbsp;&nbsp; {currentArticle.comments.length}</p>
                    <hr />
                           

                    {currentArticle.comments.map((comment, index) =>{
                        return(
                            <>
                                <div key={index} className="post--comment__by">
                                    <div>
                                    <Link to={`/userprofile/${comment.user.id}`}><div className="user__img"><img src={comment.user.photo !== null ? (comment.user.photo) : (`https.we-make-team.click/userphotos/randomUser.jpg`)} alt="image utilisateur" /></div></Link>
                                    </div>
                                    <div>
                                        <div>
                                            <span className="user__name"><Link to={`/userprofile/${comment.user.id}`}>{comment.user.username}</Link></span>
                                        </div>
                                        {editCommentStates[index] ? (
                                            <form onSubmit={event => {handleEditComment(event,comment.id)}}>
                                                <textarea name="editcomment" id="categoryidea" cols="50" rows="3" className='post--comment__by__edit__textarea' defaultValue={comment.text}></textarea>
                                                <input type="submit" className='post--comment__by__edit__btn' value={"submit"} />
                                            </form>
                                        ):(
                                            <p>{comment.text}</p>
                                        )}
                                        <span className="comment__by__date">{comment.createdAt.substr(0,10)}</span>&nbsp;&nbsp;<span>{comment.user.discordId}</span>
                                    </div>
                                    {token && addHandleButtonByUser(comment, index)}
                                    {/* {token && jwtDecode(token).data.userId !== comment.userId && (
                                        <div className="post--comment__by__signal" onClick={(event)=>handleReportComment(event, comment.id)}>* report</div>
                                    )} */}
                                </div>
                                <hr />
                            </>
                        )
                    })}
                </>
                )}
 
                <form action="" onSubmit={handleCreateComment}>
                    <textarea name="comment" cols="30" rows="5" placeholder="You can leave your comment here"></textarea>
                    <input className="post--submitBtn" type="submit" value="Enter" />
                </form>
            </main>
            <Footer />
        </>
    )
}

export default PostDetailPage
