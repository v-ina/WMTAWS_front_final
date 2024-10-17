import './ForumPage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faChevronLeft, faChevronRight, faComments } from '@fortawesome/free-solid-svg-icons'
import { apiPort, apiUrl } from '../../utils/apiConfigs'
import { jwtDecode } from 'jwt-decode'
import ChatInbox from '../../components/ChatInbox'


function ForumPage(){
    
    ////////////////////////////////////////////////////////////////////////////// VARIABLES
    // les variables pour la pagination
    const [tableSize] = useState(10)
    const [startIndex, setStartIndex] = useState(1)
    const [endIndex, setEndIndex] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(1)
    const [maxIndex, setMaxIndex] = useState(1)

    // Get tout les postings + category
    const {forumCategory} = useParams()
    const [articles, setArticles] = useState(null)
    const [currentCategory, setCurrentCategory] = useState(null)
    const [currentForumArticle, setCurrentForumArticle] = useState(null)

    // la variable pour la barre de recherche 
    const [searchQuery, setSearchQuery] = useState(null)


    ///////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - récupérer nom de categorie
    useEffect(()=>{
        (async()=>{
            const responseOfFetch = await fetch(`https://https.we-make-team.click/api/categories/${forumCategory}`)
            const responseToJson = await responseOfFetch.json()
            return setCurrentCategory(responseToJson.data[0])
        })()        
    },[forumCategory])

    // BDD - récupérer les articles
    useEffect(()=>{
        (async()=>{
            const responseOfFetch = await fetch(`https://https.we-make-team.click/api/articles`)
            const responseToJson = await responseOfFetch.json()
            return setArticles(responseToJson.data)  
        })()
    },[])

    // merge articles et categorie
    useEffect(() => {
        if (articles && currentCategory) {
            compareIdFunction(articles, currentCategory)
        }
      }, [currentCategory, articles]);
    const compareIdFunction = (articles, currentCategory) => {
        const filteredArticles = articles.filter(article => article.categoryId === currentCategory.id);
        const sortedArticles = filteredArticles.sort((a,b) => {return new Date(b.createdAt) - new Date(a.createdAt)})
        setCurrentForumArticle(sortedArticles)
    }

    ////////////////////////////////////////////////////////////////////////////// PAGINATION
    // pagination - maxIndex calcul
    const preLoadCalculations = () => {
        let maxIndexValue = currentForumArticle.length / tableSize
        if (currentForumArticle.length % tableSize !== 0) {
          maxIndexValue++
        }
        setMaxIndex(maxIndexValue)
      };

    // pagination - mis a jour de pagination les 4 cas de changements
    useEffect(() => {
        if(currentForumArticle){
            setStartIndex((currentIndex - 1) * tableSize + 1)
            let end = (startIndex + tableSize) - 1
            if (end > currentForumArticle.length) {
                end = currentForumArticle.length;
            }
            setEndIndex(end)
            preLoadCalculations()
            hightlightIndexButton()
            displayIndexButtons()
            displayTableRows()
        }
    }, [startIndex, endIndex, currentIndex, currentForumArticle]);
    
    // pagination - mis a jour de pagination le cas de changer le category
    useEffect(()=>{
        setStartIndex(1)
        setEndIndex(0) 
        setCurrentIndex(1)
        setMaxIndex(1)
        setSearchQuery(null)
    },[currentCategory])

    // pagination - creeation de boutons
    const displayIndexButtons = () => {
        if(currentForumArticle){
            const buttons = [];
            buttons.push(<button key="prev" className='btn__pagination' onClick={prev}><FontAwesomeIcon icon={faChevronLeft} /></button>);
            for (let i = 1; i <= maxIndex; i++) {
                buttons.push(
                    <button key={i} className='btn__pagination' style={{
                        fontWeight: currentIndex === i && 'bold'
                    }} onClick={() => indexPagination(i)}>{i}</button>
                )
            }
            buttons.push(<button key="next" className='btn__pagination' onClick={next}><FontAwesomeIcon icon={faChevronRight} /></button>);
            return buttons;
        }
    }
    
    // pagination - definir startIndex & endIndex + creer le tableau d'article(displayTableRows())
    const hightlightIndexButton = () => {
        if(currentForumArticle){
            setStartIndex((currentIndex - 1) * tableSize + 1);
            let end = (startIndex + tableSize) - 1;
            if (end > currentForumArticle.length) {
                end = currentForumArticle.length;
            }
            setEndIndex(end)
            displayTableRows()
        }
    }
    const displayTableRows = (pcOrMobile) => {
        if(currentForumArticle){
            const tableRows = []

            if (currentForumArticle && currentForumArticle.length > 0){
                let tabStart = startIndex - 1
                let tabEnd = endIndex

                if(pcOrMobile === 'pc'){
                    for (let i = tabStart; i < tabEnd; i++) {
                        const article = currentForumArticle[i]
                        tableRows.push(
                            <tr className='table__postcontent'>                 
                                <td>
                                    <Link to={`/userprofile/${article.user.id}`} title='more user info'>
                                        {article.user.username}
                                    </Link>
                                </td>
                                <td>{article.numOfMember}</td>
                                <td>
                                    {article.attachment.length >=1 ? (
                                        <Link to={`/forum/${currentCategory.category}/${article.id}`}>
                                            {article.title.substr(1,article.title.length-2)}  
                                            &nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon={faImages} />
                                        </Link>
                                    ) : (
                                        <Link to={`/forum/${currentCategory.category}/${article.id}`}>
                                            {article.title.substr(1,article.title.length-2)}
                                        </Link>
                                    )}
                                </td>
                                <td>{article.comments.length}</td>
                                <td>{article.createdAt.substr(0,10)}</td>
                            </tr>
                        )
                    }
                }

                if(pcOrMobile === 'mobile'){
                    for (let i = tabStart; i < tabEnd; i++) {
                        const article = currentForumArticle[i]
                        tableRows.push(            
                            <div className="forum--mobile">
                                <div className="forum--mobile__left">
                                    <h3><Link to={`/forum/${currentCategory.category}/${article.id}`}>{article.title.substr(1,article.title.length-2)}</Link></h3>
                                    <span>{article.user.username}</span>
                                    <span>{article.createdAt.substr(0,10)}</span>
                                </div> 
                                {article.attachment.length >=1 ? (
                                    <div className='forum--mobile__middle'></div>
                                ) : (
                                    <div></div> 
                                )}
                                <div className="forum--mobile__right">
                                    <p>{article.comments.length}</p>
                                    <p>cmts</p>
                                </div>
                            </div>
                        )
                    }
                }
            }
            return tableRows
        }
    }
    
    // pagination - changer currentIndex + definir startIndex & endIndex + creer le tableau d'article(hightlightIndexButton())
    const next = () => {
        if (currentIndex < maxIndex-1) {
            setCurrentIndex(currentIndex + 1)
            hightlightIndexButton()
        }
    }
    const prev = () => {
        if (currentIndex > 1) {
            setCurrentIndex(currentIndex - 1)
            hightlightIndexButton()
        }
    }
    const indexPagination = (index) => {
        setCurrentIndex(parseInt(index))
        hightlightIndexButton()
    }
    displayIndexButtons()

    ///////////////////////////////////////////////////////////////////////////////////// BARRE DE RECHERCHE
    // BDD - requete de la barre de recherche
    const handleSearchQuery = async(event, keyword) => {
        event.preventDefault()
        if(keyword.trim().length>0){
            const responseOfFetch = await fetch(`https://https.we-make-team.click/api/articles?search=${keyword}`)
            const responseToJson = await responseOfFetch.json()
            const sortedArticles = responseToJson.data.sort((a,b) => {return new Date(b.createdAt) - new Date(a.createdAt)})
            setCurrentForumArticle(sortedArticles)
            setSearchQuery(keyword)
            setStartIndex(1)
            setEndIndex(0) 
            setCurrentIndex(1)
            setMaxIndex(1)
        }
    }

    ////////////////////////////////////////////////////////////////////////////////// FUNCTION       
    // rafraichir - retourner a la page forum precedent
    const handleRefresh = () => {
        window.location.reload()
    }

    const [chatOpen , setChatOpen] = useState(false)
    const [messageAlert, setMessageAlert] = useState(null)
    const token = localStorage.getItem("jwt")
    useEffect(() => {
        if (token !== null) {
            const decoded = jwtDecode(token);
            checkUnreadMessage(decoded.data.userId);
        }
    }, [token]);

    const checkUnreadMessage = async (userId) => {
        try {
            const response = await fetch(`https://https.we-make-team.click/api/message/unread/${userId} `);
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
        {currentForumArticle !== null && (
            <main className="forum--main"> 
                {messageAlert && messageAlert.length >0 && <div className='chat__unread'></div>}
                <div className='chat__btn'  onClick={()=>setChatOpen(!chatOpen)}>
                    <FontAwesomeIcon className='chat__btn__icon' icon={faComments} />
                </div>
                {chatOpen && (
                    <ChatInbox onClick={()=>setChatOpen(false)}/>
                )}
                {!searchQuery ? (
                    <h2>
                        FORUM - {forumCategory}
                    </h2>
                ):(
                    <>
                        <p className='btn__goBack' onClick={handleRefresh}><FontAwesomeIcon icon={faChevronLeft} /> &nbsp;&nbsp;GO BACK</p>
                        <h2> Search every result by keword &nbsp;&nbsp;"{searchQuery}"</h2>
                    </>
                )}

                {currentForumArticle.length > 0 ? (
                    <>
                        <table className='forum--desktop'>
                            <colgroup>
                                <col className='col-1'/>
                                <col className='col-2'/>
                                <col className='col-3'/>
                                <col className='col-4'/>
                                <col className='col-5'/>
                            </colgroup> 
                            <thead>
                                <tr className='table__tableheader'>
                                    <th>username</th>
                                    <th>member</th>
                                    <th>title</th>
                                    <th>comment</th>
                                    <th>date / time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayTableRows('pc')}
                            </tbody>  
                        </table>
                        <div>
                            {displayTableRows('mobile')}
                        </div>   
                        <div className='index_buttons'>
                            {displayIndexButtons()}
                        </div>
                    </>             
                ):(
                    <div className='noResult'>
                        <hr />
                        <p>no result</p>
                        <hr />
                    </div>
                )}    
                <div className='searchBar'>
                    <form onSubmit={(event)=> handleSearchQuery(event,event.target.keyword.value)} action="">
                        <input type="text" placeholder='search keyword' name='keyword' />
                        <input type="submit" value={'search'} />
                    </form>
                </div>
            </main>
        )}
        <Footer />
    </>
    )
}

export default ForumPage