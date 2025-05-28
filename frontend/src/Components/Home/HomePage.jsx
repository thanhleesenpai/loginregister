import { useEffect } from "react"
import "./home.css"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getAllUsers,deleteUser } from "../../redux/apiRequest"
import { createAxios } from "../../redux/createInstance"
import { useState } from "react"
import { loginSuccess } from "../../redux/authSlice"
import { resetMsg } from "../../redux/userSlice"; // Import action resetMsg


const HomePage = () => {
const user = useSelector((state) => state.auth.login?.currentUser)
const userList = useSelector((state) => state.users.users?.allUsers)
//const [errorMessage, setErrorMessage] = useState(null)
const reduxMsg = useSelector((state) => state.users?.msg); // Lấy msg từ Redux
const [msg, setMsg] = useState(null)
const dispatch = useDispatch()
const navigate = useNavigate()
let axiosJWT = createAxios(user, dispatch, loginSuccess)
  //DUMMY DATA
  // const userData = [
  //   {
  //     username: "anhduy1202",
  //   },
  //   {
  //     username: "kelly1234",
  //   },
  //   {
  //     username: "danny5678",
  //   },
  //   {
  //     username: "kenny1122",
  //   },
  //   {
  //     username: "jack1234",
  //   },
  //   {
  //     username: "loi1202",
  //   },
  //   {
  //     username: "nhinhi2009",
  //   },
  //   {
  //     username: "kellynguyen1122",
  //   },
    
  // ];
  
  // useEffect(() => {
  //   if (errorMessage) {
  //     // Reset errorMessage sau 3 giây
  //     const timer = setTimeout(() => {
  //       setErrorMessage(null);
  //     }, 3000);

  //     return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
  //   }
  // }, [errorMessage])
  useEffect(() => {
    if (reduxMsg) {
      setMsg(reduxMsg);
  
      // Reset msg sau 3 giây
      const timer = setTimeout(() => {
        setMsg(null);
        dispatch(resetMsg()); // Reset reduxMsg trong Redux
      }, 3000);
  
      return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
    }
  }, [reduxMsg, dispatch]);

  const handleDelete = async (userId) => {
    try {
      console.log(userId);
      await deleteUser(userId, user?.accessToken, dispatch, axiosJWT);
      await getAllUsers(user?.accessToken, dispatch, axiosJWT); 
      // setMessage(msg)
    } catch (error) {
    console.error("Error in handleDelete:", error.response?.data || error.message)
    //setErrorMessage(error.response?.data?.message || "An unexpected error occurred.")
    }
  }

  useEffect(()=>{
    if(!user) {
      navigate("/login")
    }
    if(user?.accessToken) {
      getAllUsers(user?.accessToken, dispatch, axiosJWT)
    }
  },[])

  return (
    <main className="home-container">
      {/* <div>{errorMessage && <div className="error-message">{errorMessage}</div>}</div> */}
      {/* <div>{message && typeof message === "string" && <div className="message">{message}</div>}</div> */}
      <div>{msg && typeof msg === "string" && <div className="message">{msg}</div>}</div>
      <div className="home-title">User List</div>
      <div className="home-roles">
        {/* optional chaining and ternary operator */}
        {`Your role: ${user?.admin ? "Admin" : "User"}`}
      </div>
      <div className="home-userlist">
        {userList?.map((user) => {
          return (
            <div key={user._id}className="user-container">
              <div className="home-user">{user.username}</div>
              <div className="delete-user" onClick={()=>handleDelete(user._id)}> Delete </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default HomePage;
