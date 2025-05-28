import axios from 'axios'
import { loginStart, loginSuccess, LoginFailed, registerSuccess, registerFailed, registerStart, logoutStart, logoutSuccess, logoutFailed } from './authSlice'
import { getUsersStart, getUsersSuccess, getUsersFailed, deleteUserStart, deleteUserSuccess, deleteUserFailed } from './userSlice'

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart())
  try {
    const res = await axios.post("/v1/auth/login", user)
    dispatch(loginSuccess(res.data))
    navigate("/")
  } catch (error) {
    dispatch(LoginFailed())
  }
}

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart())
  try {
    await axios.post("/v1/auth/register", user)
    dispatch(registerSuccess())
    navigate("/login")
  } catch (error) {
    dispatch(registerFailed())
  }
}

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getUsersStart())
  try {
    const res = await axiosJWT.get("/v1/user", {
      headers: {
        token: `Bearer ${accessToken}`
      }
    })
    dispatch(getUsersSuccess(res.data))

  } catch (error) {
    dispatch(getUsersFailed())
  }
}
export const deleteUser = async (userId, accessToken, dispatch, axiosJWT) => {
  dispatch(deleteUserStart());
  try {
    const res = await axiosJWT.delete(`/v1/user/${userId}`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    dispatch(deleteUserSuccess(res.data));
  } catch (error) {
    dispatch(deleteUserFailed(error.response?.data));
    //throw error
  }
}

export const logoutUser = async (dispatch, id, navigate, accessToken, axiosJWT) => {
  dispatch(logoutStart())
  try {
    await axiosJWT.post("/v1/auth/logout", id, {
      headers: {
        token: `Bearer ${accessToken}`
      }
    })
    dispatch(logoutSuccess())
    navigate("/login")
  } catch (error) {
    dispatch(logoutFailed())
  }
}