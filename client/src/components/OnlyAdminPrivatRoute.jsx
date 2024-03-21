import {  useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { Navigate } from "react-router-dom"

export default  function OnlyAdminPrivatRoute() {
    
    const {currentUser } = useSelector((state)=> state.user)
  return currentUser && currentUser.isAdmin ? (
  <Outlet/>
  ):(
    <Navigate to='/sign-in'/>
  );
     
}


