import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"


export const useVerifyUserIsLogged = () =>{
    const navigate = useNavigate();
    useEffect(()=>{
        const token = localStorage.getItem("jwt") 
        if(!token){
            navigate("/login")
        } else{
            const decodedToken = jwtDecode(token)
            if(!decodedToken.data){
                navigate("/login")
            }
        }
    },[])
}
