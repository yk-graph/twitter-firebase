import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: { uid: "", photoUrl: "", displayName: "" },
  },
  reducers: {
    /**
     *@description ログイン認証が通ったユーザーの情報をグローバルステートに格納する関数
     *@payload {uid: string, photoUrl: string, displayName: string}
     */
    login: (state, action) => {
      state.user = action.payload;
    },
    /**
     *@description ログアウト処理が通った場合、グローバルステートを初期化する関数
     *@payload {uid: string, photoUrl: string, displayName: string}
     */
    logout: (state) => {
      state.user = { uid: "", photoUrl: "", displayName: "" };
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
