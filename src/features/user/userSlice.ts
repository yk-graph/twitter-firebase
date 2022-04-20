import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

interface User {
  displayName: string
  photoUrl: string
}

const initialState = {
  user: { uid: '', photoUrl: '', displayName: '' },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     *@description ログインが成功したら、ユーザー情報をGlobalStateに格納する関数
     *@action { payload } payloadの値：ログインに成功した時のユーザー情報
     */
    login: (state, action) => {
      state.user = action.payload
    },
    /**
     *@description ログアウトが成功したら、GlobalStateのユーザー情報を初期化する関数
     */
    logout: (state) => {
      state.user = { uid: '', photoUrl: '', displayName: '' }
    },
    /**
     *@description ユーザーのアバター画像とニックネームをプロフィールに追加したい時の関数
     *@action { payload } payloadの値：displayName, photoUrl
     */
    updateUserProfile: (state, action: PayloadAction<User>) => {
      state.user.displayName = action.payload.displayName
      state.user.photoUrl = action.payload.photoUrl
    },
  },
})

export const { login, logout, updateUserProfile } = userSlice.actions

export const selectUser = (state: RootState) => state.user.user

export default userSlice.reducer
