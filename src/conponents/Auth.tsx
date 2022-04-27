import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'
import { AccountCircle, Email, Lock, Send } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import { auth, provider, storage } from '../firebase'
import { updateUserProfile } from '../features/user/userSlice'
import styles from './Auth.module.css'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  modal: {
    outline: 'none',
    position: 'absolute',
    width: 400,
    borderRadius: 10,
    backgroundColor: 'white',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const Auth: React.FC = () => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [avatarImage, setAvatarImage] = useState<File | null>(null)
  const [avatarImageFileName, setAvatarImageFileName] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [openModal, setOpenModal] = useState(false)

  const signInEmail = async () => {
    await auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
  }

  const signUpEmail = async () => {
    let avatarUrlPath = ''
    const authUser = await auth
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    // アバター画像が選択されていたらfireStorageに画像を格納する
    if (avatarImage) {
      await storage.ref(`avatars/${avatarImageFileName}`).put(avatarImage)
      avatarUrlPath = await storage
        .ref('avatars')
        .child(avatarImageFileName)
        .getDownloadURL()
    }
    // signupの処理が通っていたら(authUserが存在していたら)fireStoreのユーザー情報を更新＆グローバルステートに値を格納させる
    if (authUser) {
      await authUser.user?.updateProfile({
        displayName: username,
        photoURL: avatarUrlPath,
      })
      dispatch(
        updateUserProfile({
          displayName: username,
          photoUrl: avatarUrlPath,
        })
      )
    }
  }

  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((error) => alert(error.message))
  }

  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setOpenModal(false)
        setResetEmail('')
      })
      .catch((error) => {
        alert(error.message)
        setResetEmail('')
      })
  }

  const makeImageUrl = (imageFileName: string) => {
    const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const N = 16
    const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
      .map((n) => S[n % S.length])
      .join('')
    return randomChar + '_' + imageFileName
  }

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e.target.files![0]で、選択した画像のデータが取得できる
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0])
      // fireStorageに画像ファイルを格納する時のファイル名を作成してuseStateで保持する
      setAvatarImageFileName(makeImageUrl(e.target.files![0].name))
      // fileの選択をする時に、valueの中身が残っているとファイルを選択できないため、初期化が必要
      e.target.value = ''
    }
  }

  const isDisabled = () => {
    if (isLogin) {
      return !email || password.length < 6
    } else {
      return !username || !email || password.length < 6
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Lock />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin ? 'Sign in' : 'Register'}
          </Typography>
          <form className={classes.form} noValidate>
            {!isLogin && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUsername(e.target.value)
                  }}
                />
                <Box textAlign="center">
                  <IconButton>
                    <label>
                      <AccountCircle
                        fontSize="large"
                        className={
                          avatarImage
                            ? styles.login_addIconLoaded
                            : styles.login_addIcon
                        }
                      />
                      <input
                        className={styles.login_hiddenIcon}
                        type="file"
                        onChange={onChangeImageHandler}
                      />
                    </label>
                  </IconButton>
                </Box>
              </>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              startIcon={<Email />}
              onClick={isLogin ? signInEmail : signUpEmail}
              disabled={isDisabled()}
            >
              {isLogin ? 'Sign in' : 'Register'}
            </Button>
            <Grid container>
              <Grid item xs>
                <span
                  onClick={() => setOpenModal(true)}
                  className={styles.login_reset}
                >
                  Forgot Password?
                </span>
              </Grid>
              <Grid item>
                <span
                  className={styles.login_toggleMode}
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Create New account' : 'Back to login'}
                </span>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={signInGoogle}
            >
              SignIn with Google
            </Button>
          </form>

          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div style={getModalStyle()} className={classes.modal}>
              <div className={styles.login_modal}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="email"
                  name="email"
                  label="Reset E-mail"
                  value={resetEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setResetEmail(e.target.value)
                  }}
                />
                <IconButton onClick={sendResetEmail}>
                  <Send />
                </IconButton>
              </div>
            </div>
          </Modal>
        </div>
      </Grid>
    </Grid>
  )
}

export default Auth
