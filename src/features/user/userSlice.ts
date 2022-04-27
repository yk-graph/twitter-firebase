import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

type User = {
  displayName: string
  photoUrl: string
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: { uid: '', photoUrl: '', displayName: '' },
  },
  reducers: {
    /**
     *@description ログイン認証が通ったユーザーの情報をグローバルステートに格納する関数
     *@payload {uid: string, photoUrl: string, displayName: string}
     */
    login: (state, action) => {
      state.user = action.payload
    },
    /**
     *@description ログアウト処理が通った場合、グローバルステートを初期化する関数
     *@payload {uid: string, photoUrl: string, displayName: string}
     */
    logout: (state) => {
      state.user = { uid: '', photoUrl: '', displayName: '' }
    },
    /**
     *@description ユーザーの新規作成時に追加情報があった際、情報を追加する関数
     *@payload {displayName: string, photoUrl: string}
     */
    updateUserProfile: (state, action: PayloadAction<User>) => {
      state.user.displayName = action.payload.displayName
      state.user.photoUrl = action.payload.photoUrl
    },
  },
})

export const { login, logout, updateUserProfile } = userSlice.actions

// コンポーネントからuseSelector(selectUser)を使ってグローバルステートの値を取得できるようにする(state.スライス名.プロパティ名)
export const selectUser = (state: RootState) => state.user.user

export default userSlice.reducer
