// store/redux/user/reducer.js
import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/services/api/auth";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // Đồng bộ khi đăng nhập thành công
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
      }
    );

    // Đồng bộ khi lấy thông tin người dùng hiện tại
    builder.addMatcher(
      // authApi.endpoints.getCurrentUser.matchFulfilled,
      authApi.endpoints.getMyInfo.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
      }
    );

    // Đồng bộ khi cập nhật thông tin người dùng
    builder.addMatcher(
      authApi.endpoints.updateUser.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
      }
    );
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectUserId = (state) => state.user.user?.id;

export default userSlice.reducer;
