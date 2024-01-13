import './AdminUserMangePage.scss'
import AdminHeader from '../../components/admin/AdminHeader'
import Footer from '../../components/guest/Footer'
import { useEffect, useState } from 'react'
import { useVerifyUserIsLogged } from '../../utils/security-utils'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'


function AdminUserMangePage(){

    const [users, setUsers] = useState(null)

    /////////////////////////////////////////////////////////////////////////////////////// ACCES
    // navigate - Accès direct interdit depuis l'URL
    // useVerifyUserIsLogged()
    // const navigate = useNavigate()
    // useEffect(()=>{
    //     if(localStorage.getItem("jwt") === null){
    //         return navigate('/')
    //     } else if(jwtDecode(localStorage.getItem("jwt")).data.role ===3){
    //         return navigate('/')
    //     }
    // },[])

    const useVerifyUserIsLogged = () => {
        const navigate = useNavigate()
        const token = localStorage.getItem("jwt")
    
        useEffect(() => {
            if (!token) {
                navigate("/login")
                console.log('1')
            } else {
                try {
                    const decodedToken = jwtDecode(token);
                    if (!decodedToken.data || decodedToken.data.role !== 1) {
                        navigate("/")
                        console.log('2')
                    }
                } catch (error) {
                    navigate("/login")
                    console.log('3')
                }
            }
        }, [])
    }

    useVerifyUserIsLogged()


    ///////////////////////////////////////////////////////////////////////////////////// REQUETE
    // BDD - récupérer des utilisateurs
    const fetchUsers = async() => {
        const token = localStorage.getItem('jwt')
        if(token !== null){
            const responseAfterFetch = await fetch("http://localhost:3333/api/users", {method : "GET", headers : {'Authorization': `Bearer ${token}`}})
            const responseToJson = await responseAfterFetch.json()
            setUsers(responseToJson.data)
        }
    }
    useEffect(()=>{
        fetchUsers()
    },[])

    // BDD - supprimer un utilisatuer
    const handleDeleteUser = async(event, userId) => {
        if(window.confirm(`are you sure that want to delete this user n° ${userId}?`)){
            const token = localStorage.getItem('jwt')
            alert(`this user id n°${userId} has been succesfuly deleted`)
            await fetch(`http://localhost:3333/api/users/${userId}`, {method : "DELETE", headers : {'Authorization': `Bearer ${token}`}})
            fetchUsers()
            window.location.reload()
        } else {
            alert('your require was canceled')
        }
    }


    /////////////////////////////////////////////////////////////////////////////////// PAGINATION
    // pagination - les variables
    const [tableSize] = useState(10)
    const [startIndex, setStartIndex] = useState(1)
    const [endIndex, setEndIndex] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(1)
    const [maxIndex, setMaxIndex] = useState(1)

    // pagination - maxIndex calcul
    const preLoadCalculations = () => {
        let maxIndexValue = users.length / tableSize
        if (users.length % tableSize !== 0) {
          maxIndexValue++
        }
        setMaxIndex(maxIndexValue)
      };

    // pagination - mis a jour de pagination les 4 cas de changements
    useEffect(() => {
        if(users){
            setStartIndex((currentIndex - 1) * tableSize + 1)
            let end = (startIndex + tableSize) - 1
            if (end > users.length) {
                end = users.length;
            }
            setEndIndex(end)
            preLoadCalculations()
            hightlightIndexButton()
            displayIndexButtons()
            displayTableRows()
        }
    }, [startIndex, endIndex, currentIndex, users]);

    // pagination - creeation de boutons
    const displayIndexButtons = () => {
        if(users){
            const buttons = [];
            buttons.push(<button key="prev" className='btn__pagination' onClick={prev}>Prev</button>);
            for (let i = 1; i <= maxIndex; i++) {
                buttons.push(
                    <button key={i} className='btn__pagination' style={{
                        fontWeight: currentIndex === i && 'bold'
                    }} onClick={() => indexPagination(i)}>{i}</button>
                )
            }
            buttons.push(<button key="next" className='btn__pagination' onClick={next}>Next</button>);
            return buttons;
        }
    }
    
    // pagination - definir startIndex & endIndex + creer le tableau d'article(displayTableRows())
    const hightlightIndexButton = () => {
        if(users){
            setStartIndex((currentIndex - 1) * tableSize + 1);
            let end = (startIndex + tableSize) - 1;
            if (end > users.length) {
                end = users.length;
            }
            setEndIndex(end)
            displayTableRows()
        }
    }
    const displayTableRows = () => {
        const tableRows = []
        if(users){
            for (let i = startIndex-1; i < endIndex; i++) {
                const user = users[i]
                tableRows.push(
                    <tr className='table__postcontent'>
                        <td>{user.roleId}</td>
                        <td>{user.username}</td>
                        <td>{user.id}</td>
                        <td>{user.firstname}</td>
                        <td>{ user.roleId !==1 && (<button onClick={(event)=> handleDeleteUser(event, user.id)}>delete</button>) }</td>
                    </tr>                        
                )
            }
        }
        return tableRows
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


    return(
    <>
        <AdminHeader />
        <main className='adminUserManage--main'>
            <h2>admin user manage page</h2>
            <table className='admin--manageUser'>
                <colgroup>
                    <col className='col-1'/>
                    <col className='col-2'/>
                    <col className='col-3'/>
                    <col className='col-4'/>
                </colgroup>
                <thead>
                    <tr className='table__tableheader'>
                        <th>role id</th>
                        <th>username</th>
                        <th>user id</th>
                        <th>firstname</th>
                        <th>management</th>
                    </tr>
                </thead>

                {users ? (
                    <tbody>
                        {displayTableRows()}
                    </tbody>
                ) : (
                    <p>chargement en cours</p>
                )}

            </table>
            <div className='index_buttons'>
                {displayIndexButtons()}
            </div>
        </main>
        <Footer />
    </>
    )
}

export default AdminUserMangePage