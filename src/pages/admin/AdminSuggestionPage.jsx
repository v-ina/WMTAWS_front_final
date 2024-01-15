import './AdminSuggestionPage.scss'
import AdminHeader from '../../components/admin/AdminHeader'
import Footer from '../../components/guest/Footer'
import { useEffect, useState } from 'react'
import { useVerifyUserIsLogged } from '../../utils/security-utils'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { apiPort, apiUrl } from '../../utils/apiConfigs'


function AdminSuggestionPage(){

    const [suggestions, setSuggestions] = useState(null)
    
    ////////////////////////////////////////////////////////////////////////////////// ACCES
    // navigate - Accès direct interdit depuis l'URL

    useVerifyUserIsLogged()
    const navigate = useNavigate()
    // useEffect(()=>{
    //     if(localStorage.getItem("jwt") !== null || jwtDecode(localStorage.getItem("jwt")).data.role ===3){
    //         return navigate('/')
    //     }
    // },[])
    useEffect(()=>{
        if(localStorage.getItem("jwt") === null){
            return navigate('/')
        } else if(jwtDecode(localStorage.getItem("jwt")).data.role ===3){
            return navigate('/')
        }
    },[])


    ////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - récupérer des suggestions    
    const fetchSuggestions = async() => {
        const token = localStorage.getItem('jwt')
        if(token !== null){
            const responseAfterFetch = await fetch(`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/api/suggestions`, {method : "GET", headers : {'Authorization': `Bearer ${token}`}})
            const responseToJson = await responseAfterFetch.json()
            setSuggestions(responseToJson.data)
        }
    }
    useEffect(()=>{
        fetchSuggestions()
    },[])

    // BDD - supprimer une suggestion    
    const handleDeletSuggestion = async(event, suggestionId) => {
        if(window.confirm(`are you sure that want to delete this suggestion?`)){
            alert(`suggestion id n°${suggestionId} has been succesfuly deleted`)
            const token = localStorage.getItem('jwt')
            await fetch(`http://ec2-${apiUrl}.eu-west-3.compute.amazonaws.com:${apiPort}/api/suggestions/${suggestionId}`, {method : "DELETE", headers : {'Authorization': `Bearer ${token}`}})
            fetchSuggestions()
        } else {
            alert('your require was canceled')
        }
    }


    ////////////////////////////////////////////////////////////////////////////////// CREATION HTML
    // element - créer des éléments HTML
    const displayTableRows = () => {
        const tableRows = []
        for (let i = 0; i < suggestions.length; i++) {
            const suggestion = suggestions[i]
            tableRows.push(
                <tr className='table__postcontent'>
                    <td>{suggestion.id}</td>
                    <td>{suggestion.text}</td>
                    <td>{suggestion.user.username}</td>
                    <td>{suggestion.createdAt.substr(0,10)}</td>
                    <td><button onClick={event => {handleDeletSuggestion(event,suggestion.id)}}>delete</button></td>
                </tr>                          
            )
        }
        return tableRows
    }


    return(
    <>
        <AdminHeader />
        {suggestions && (
            <main className='adminSuggestion--main'>
            <h2>admin suggestion page</h2>
            {suggestions.length === 0 ? (
                <div className='noResult'>
                    <hr />
                    <p>Any suggestion yet</p>
                    <hr />
                </div>
            ):(
                <table className='admin--suggestion'>
                    <colgroup>
                        <col className='col-1'/>
                        <col className='col-2'/>
                        <col className='col-3'/>
                        <col className='col-4'/>
                        <col className='col-5'/>
                    </colgroup>
                    <thead>
                        <tr className='table__tableheader'>
                            <th>id</th>
                            <th>text</th>
                            <th>username</th>
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

export default AdminSuggestionPage