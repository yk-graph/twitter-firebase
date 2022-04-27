<<<<<<< HEAD
import React, { useEffect, useState, useCallback } from 'react'
import { Counter } from './features/counter/Counter'
import './App.css'
import CleanUp from './CleanUp'

const App: React.FC = () => {
  const [status, setStatus] = useState<string | number>('tset')
  const [input, setInput] = useState('')
  const [counter, setCounter] = useState(0)
  const [display, setDisplay] = useState(true)

  useEffect(() => {
    console.log('Appコンポーネント呼ばれたで!')
  }, [])

  const onCloseDisplay = useCallback(() => setDisplay(false), [])

  return (
    <div className="App">
      <header className="App-header">
        <h4>{status}</h4>
        <button onClick={() => setStatus(1)}>Button</button>
        <h4>{input}</h4>
        <input
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
        <h4>{counter}</h4>
        <button onClick={() => setCounter((preCounter) => preCounter + 1)}>
          add
        </button>
        {display && <CleanUp onCloseDisplay={onCloseDisplay} />}
        <button onClick={() => setDisplay(!display)}>Open Display</button>
        <hr />
        <Counter />
      </header>
    </div>
  )
}
=======
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { login, logout, selectUser } from "./features/user/userSlice";
import { auth } from "./firebase";
import styles from "./App.module.css";
import Feed from "./conponents/Feed";
import Auth from "./conponents/Auth";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return () => unSub();
  }, [dispatch]);

  return (
    <>
      {user.uid ? (
        <div className={styles.app}>
          <Feed />
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
};
>>>>>>> firebase-ver8-material-ver4

export default App
