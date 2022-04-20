import React from 'react'
import { auth } from '../firebase'

const Feed: React.FC = () => {
  const logout = async () => {
    await auth.signOut()
  }
  return (
    <div className="">
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Feed
