import './CreatPostPage.scss'
import Header from '../../components/guest/Header'
import Footer from '../../components/guest/Footer'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useVerifyUserIsLogged } from '../../utils/security-utils';
import { apiPort, apiUrl } from '../../utils/apiConfigs'


function CreatPostPage(){

    /////////////////////////////////////////////////////////////////////////////////////// ACCES
    // navigate - Accès direct interdit depuis l'URL
    useVerifyUserIsLogged()
    const navigate = useNavigate();
    const token = localStorage.getItem("jwt") 
    const [message, setMessage] = useState(null)


    ///////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - creer un article  
    const handleCreateArticle = async(event) => {
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

        const createArticlesResponse = await fetch(`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/api/articles`, {
            method : "POST",
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
        if(createArticlesResponse.status === 200 || createArticlesResponse.status ===204 ) {
            setMessage('Articles cree!')
            navigate(`/forum/${forumCategory}`)
        } else {
            const errorResponse = await createArticlesResponse.json()
            setMessage(errorResponse.data)
        }
    }


    return(
    <>
        <Header  currentPage={"creatPostPage"}/>
        <main class="creatpost--main">
            {message && <p>{message}</p>}
            <form action="" onSubmit={(event) =>handleCreateArticle(event)}>
                <input type="text" placeholder="Title" name='title' />
                <div class="creatpost__flex">
                    <div>
                        <label for="forumtype">Forum type : 
                            <select name="categoryId" id="forumtype" >
                                <option value="">select...</option>
                                <option value="1">dev</option>
                                <option value="2">sport</option>
                                <option value="3">game</option>
                                <option value="4">student</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label for="membernum">number of memeber wished : 
                            <select name="numOfMember" id="membernum" >
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
                <textarea name="text" id="" cols="30" rows="10" placeholder="write here description on your project"></textarea>
                <label for="file">uploade file or image : (*max : 3fiiles, only pdf, jpg, jpeg, png)</label>
                <input type="file" id="file" accept=".pdf, .jpg, .jpeg, .png" class="creatpost__file" name='attachment' multiple/>
                <input type="submit" class="createpost__btn" /> 
            </form>
        </main>
        <Footer />
    </>
    )
}

export default CreatPostPage