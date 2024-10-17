import './PostEditPage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useVerifyUserIsLogged } from '../../utils/security-utils';
import { apiPort, apiUrl } from '../../utils/apiConfigs'


function PostEditPage(){

    useVerifyUserIsLogged()
    const navigate = useNavigate();
    const token = localStorage.getItem("jwt") 
    const [message, setMessage] = useState(null)
    const {articleId} = useParams()
    const [article, setArticle] = useState(null)

    ///////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - récupérer l'article  
    useEffect(()=>{
        (async()=>{
            const responseOfFetch = await fetch(`https.we-make-team.click/api/articles/${articleId}`)
            const responseToJson = await responseOfFetch.json()
            setArticle(responseToJson.data)
        })()
    },[]) 


    ///////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - corriger l'article  
    const handleEditArticle = async(event) => {
        event.preventDefault()
        const title = event.target.title.value
        const categoryId = parseInt(event.target.categoryId.value)
        const numOfMember = parseInt(event.target.numOfMember.value)
        const text = event.target.text.value
        const formData = new FormData() 

        if(event.target.categoryId.value === ""){
            return setMessage('il faut avoir une categorie')
        }
        if(event.target.attachment.files.length > 0){
            formData.append("title", JSON.stringify(title))
            formData.append("categoryId", JSON.stringify(categoryId))
            formData.append("numOfMember", JSON.stringify(numOfMember))
            formData.append("text", JSON.stringify(text))
            formData.append("attachment", event.target.attachment.files[0])
            formData.append("attachment", event.target.attachment.files[1])
            formData.append("attachment", event.target.attachment.files[2])
            if(event.target.attachment.files[3]){
                return setMessage('only 3 files acceptable.')
            }
        } else {
            formData.append("title", JSON.stringify(title))
            formData.append("categoryId", JSON.stringify(categoryId))
            formData.append("numOfMember", JSON.stringify(numOfMember))
            formData.append("text", JSON.stringify(text))
        }
        const editArticlesResponse = await fetch(`https.we-make-team.click/api/articles/${articleId}`, {
            method : "PUT",
            headers : {
                Authorization : `Barer ${token}`
            },
            body : formData
        })

        let forumCategory = ''
        {categoryId === 1 && (forumCategory = 'dev')}
        {categoryId === 2 && (forumCategory = 'sport')}
        {categoryId === 3 && (forumCategory = 'game')}
        {categoryId === 4 && (forumCategory = 'student')}
        if(editArticlesResponse.status === 200 || editArticlesResponse.status ===204 ) {
            setMessage('Articles cree!')
            navigate(`/forum/${forumCategory}`)
        } else {
            const errorResponse = await editArticlesResponse.json()
            setMessage(errorResponse.data)
        }
    }


    return(
    <>
        <Header  currentPage={"creatPostPage"}/>
        {article && (
            <main class="creatpost--main">
            {message && <p>{message}</p>}
            <form action="" onSubmit={(event) =>handleEditArticle(event)}>
                <input type="text" placeholder="Title" name='title' defaultValue={article.title.substr(1,article.title.length-2)}  />
                <div class="creatpost__flex">
                    <div>
                        <label for="forumtype">Forum type : 
                            <select name="categoryId" id="forumtype" defaultValue={article.categoryId}>
                                <option value="">select...</option>
                                <option value="1">dev</option>
                                <option value="4">student</option>
                                <option value="2">sport</option>
                                <option value="3">game</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label for="membernum">number of memeber wished : 
                            <select name="numOfMember" id="membernum" defaultValue={article.numOfMember} >
                                <option value="">select...</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                        </label>
                    </div>
                </div>
                <textarea name="text" id="" cols="30" rows="10" placeholder="write here description on your project" defaultValue={article.text.substr(1,article.text.length-2)}></textarea>
                <label for="file">uploade file or image : (*max : 3fiiles, only pdf, jpg, jpeg, png)</label>
                <input type="file" id="file" accept=".pdf, .jpg, .jpeg, .png" class="creatpost__file" name='attachment' multiple/>
                <input type="submit" class="createpost__btn" /> 
            </form>
            </main>
        )}
        <Footer />
    </>
    )
}

export default PostEditPage