import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    isLogin: false,
    UserInfo: null,
    userRole: null,
  },
  reducers: {
    // Auth
    login: (state) => {
      state.isLogin = true;
    },
    logout: (state) => {
      state.isLogin = false;
    },

    addBasicInfo: (state, action) => {
      state.UserInfo = action.payload; // storing user as array with 1 object
    },

    setUserRole: (state, action) => {
      state.userRole = action.payload; // storing user role (buyer/seller)
    },
  },
});

export const { login, logout, addBasicInfo, setUserRole } = userSlice.actions;

export default userSlice.reducer;
