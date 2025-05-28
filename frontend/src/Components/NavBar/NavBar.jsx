//import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./navbar.css"
import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "../../redux/apiRequest"
import { createAxios } from "../../redux/createInstance"
import { logoutSuccess } from "../../redux/authSlice"
const NavBar = () => {
  // const [user,setUSer] = useState(null)
  const user = useSelector((state) => state.auth.login.currentUser)
  const accessToken = user?.accessToken
  const id = user?._id
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let axiosJWT = createAxios(user, useDispatch(), logoutSuccess)

  const handleLogout = () => {
    logoutUser(dispatch, id, navigate, accessToken, axiosJWT)
  }
  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-home"> Home </Link>
      {user? (
        <>
        <p className="navbar-user">Hi, <span> {user.username}  </span> </p>
        <Link to="/logout" className="navbar-logout" onClick={handleLogout}> Log out</Link>
        </>
      ) : (    
        <>
      <Link to="/login" className="navbar-login"> Login </Link>
      <Link to="/register" className="navbar-register"> Register</Link>
      </>
)}
    </nav>
  );
};

export default NavBar;
