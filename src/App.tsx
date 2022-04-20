import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { login, logout, selectUser } from './features/user/userSlice'
import { auth } from './firebase'
import styles from './App.module.css'

const App: React.FC = () => {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        )
      } else {
        dispatch(logout)
      }
    })
    return () => unSub()
  }, [dispatch])

  return <div className={styles.app}></div>
}

export default App
