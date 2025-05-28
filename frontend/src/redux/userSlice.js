import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: {
      allUsers: null,
      isFetching: false,
      error: false
    },
    msg:""
  },
  reducers: {
    getUsersStart: (state) => {
      state.users.isFetching = true
    },
    getUsersSuccess: (state, action) => {
      state.users.isFetching = false
      state.users.allUsers = action.payload
    },
    getUsersFailed: (state) => {
      state.users.isFetching = false
      state.users.error = true
    },
    deleteUserStart: (state) => {
      state.users.isFetching = true;
      state.users.error = false;
    },
    deleteUserSuccess: (state, action) => {
      state.users.isFetching = false;
      state.users.allUsers = state.users.allUsers.filter(
        (user) => user.id !== action.payload
      )
      state.msg = "Delete user successfully"
    },
    deleteUserFailed: (state, action) => {
      state.users.isFetching = false
      state.users.error = true
      state.msg = "You are not allowed to do that"
    },
    resetMsg: (state) => {
      state.msg = null; // Đặt lại msg về null
    },
  }
})

export const {
  getUsersStart,
  getUsersSuccess,
  getUsersFailed,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailed,
  resetMsg
} = userSlice.actions
export default userSlice.reducer