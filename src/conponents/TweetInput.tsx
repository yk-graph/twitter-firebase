import React from "react";
import { useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";

import { selectUser } from "../features/user/userSlice";
import { auth } from "../firebase";
import styles from "./TweetInput.module.css";

const TweetInput = () => {
  const user = useSelector(selectUser);

  return (
    <div>
      <Avatar
        className={styles.tweet_avatar}
        src={user.photoUrl}
        onClick={() => auth.signOut()}
      />
    </div>
  );
};

export default TweetInput;
