import './AdminReportPage.scss'
import AdminHeader from '../../components/admin/AdminHeader'
import Footer from '../../components/guest/Footer';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useVerifyUserIsLogged } from '../../utils/security-utils';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
import {apiUrl, apiPort} from '../../utils/apiConfigs'


function AdminReportPage(){
    
    const [reports, setReports] = useState(null)
    // const token = localStorage.getItem('jwt')
    
    ////////////////////////////////////////////////////////////////////////////////// ACCES
    // navigate - Accès direct interdit depuis l'URL
    useVerifyUserIsLogged()
    const navigate = useNavigate()
    useEffect(()=>{
        if(localStorage.getItem("jwt") === null){
            return navigate('/')
        } else if(jwtDecode(localStorage.getItem("jwt")).data.role ===3){
            return navigate('/')
        }
    },[])



    ////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - récupérer des rapports
    const fetchReports = async() => {
        const token = localStorage.getItem('jwt')
        if(token){
            const responseAfterFetch = await fetch(`https.we-make-team.click/api/reports`, {method : "GET", headers : {'Authorization': `Bearer ${token}`}})
            const responseToJson = await responseAfterFetch.json()
            setReports(responseToJson.data)
        }
    }
    useEffect(()=>{ 
        fetchReports()
        
    },[])

    // BDD - supprimer un rapport
    const handleIgnoreReports = async(event, reportId) => {
        const token = localStorage.getItem('jwt')
        await fetch(`https.we-make-team.click/api/reports/${reportId}`, {method : "DELETE", headers : {'Authorization': `Bearer ${token}`}})
        fetchReports()
    }

    // BDD - supprimer un article
    const handleDeleteArticle = async(event, articleId, reportId) => {
        if(window.confirm(`are you sure that want to delete this reported article?`)){
            alert(`article id n°${articleId} has been succesfuly deleted`)
            const token = localStorage.getItem('jwt')
            await fetch(`https.we-make-team.click/api/articles/${articleId}`, {method : "DELETE", headers : {'Authorization': `Bearer ${token}`}})
            handleIgnoreReports(event, reportId)
            fetchReports()
        } else {
            alert('your require was canceled')
        }
    }

    // BDD - supprimer une commentaire
    const handleDeleteComment = async(event, commentId, reportId) => {
        if(window.confirm(`are you sure that want to delete this reported comment?`)){
            alert(`comment id n°${commentId} has been succesfuly deleted`)
            const token = localStorage.getItem('jwt')
            await fetch(`https.we-make-team.click/api/comments/${commentId}`, {method : "DELETE", headers : {'Authorization': `Bearer ${token}`}})
            handleIgnoreReports(event, reportId)
            fetchReports()
        } else {
            alert('your require was canceled')
        }
    }


    ////////////////////////////////////////////////////////////////////////////////// CREATION HTML
    // element - créer des éléments HTML
    const displayTableRows = () => {
        const tableRows = []
        for (let i = 0; i < reports.length; i++) {
            const report = reports[i]

            if(report.articleId !== null && report.commentId === null){
                tableRows.push(
                    <tr className='table__postcontent'>
                        <td>{report.id}</td>
                        <td><Link to={`/forum/${report.article.category.category}/${report.articleId}`}>{report.article.title}</Link></td>
                        <td> - </td>
                        <td>{report.article.user.username}</td>
                        <td>{report.createdAt.substr(0,10)}</td>
                        <td>
                            <button onClick={(event) => { handleIgnoreReports(event, report.id)}}>ignore</button>
                            <button onClick={(event) => {handleDeleteArticle(event, report.articleId, report.id)}}>delete</button>
                        </td>
                    </tr>
                )
            }
            if(report.articleId === null && report.commentId !== null){
                tableRows.push(
                    <tr className='table__postcontent'>
                        <td>{report.id}</td>
                        <td> - </td>
                        <td><Link to={`/forum/${report.comment.article.category.category}/${report.comment.article.id}`}>{report.comment.text}</Link></td>
                        <td>{report.comment.user.username}</td>
                        <td>{report.createdAt.substr(0,10)}</td>
                        <td>
                            <button onClick={(event) => { handleIgnoreReports(event, report.id)}}>ignore</button>
                            <button onClick={(event)=> {handleDeleteComment(event, report.commentId, report.id)}}>delete</button>
                        </td>
                    </tr>
                )
            }
        }
        return tableRows
    }


    return(
    <>
        <AdminHeader />
        {reports && (
            <main className='adminReport--main'>
                <h2>admin report manage page</h2>
                {reports.length === 0 ? (
                    <div className='noResult'>
                        <hr />
                        <p>Any report yet</p>
                        <hr />
                    </div>
                ) : (
                    <table className='admin--manageReport'>
                        <colgroup>
                            <col className='col-1'/>
                            <col className='col-2'/>
                            <col className='col-3'/>
                            <col className='col-4'/>
                            <col className='col-5'/>
                            <col className='col-6'/>
                        </colgroup>
                        <thead>
                            <tr className='table__tableheader'>
                                <th>report id</th>
                                <th>article title</th>
                                <th>comment text</th>
                                <th>reported user</th> 
                                <th>created at</th>
                                <th>management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayTableRows()}
                        </tbody>
                    </table>
                )}
            </main>
        )}
        <Footer />
    </>
    )
}


export default AdminReportPage