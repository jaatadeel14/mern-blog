import React,{useContext,useEffect}from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
const DeletePost = () => {

  const navigate = useNavigate();

  const {currentUser}=useContext(UserContext)
  const token = currentUser?.token;

  // redirect the login page if the user canot login 
  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  },[])



  return (
    <div>DeletePost</div>
  )
}

export default DeletePost