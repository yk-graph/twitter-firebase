import React, { useState } from "react";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { Avatar, Button, IconButton } from "@material-ui/core";
import { AddToPhotos } from "@material-ui/icons";

import { selectUser } from "../features/user/userSlice";
import { auth, db, storage } from "../firebase";
import styles from "./TweetInput.module.css";

const TweetInput = () => {
  const user = useSelector(selectUser);

  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState("");

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const makeImageUrl = (imageFileName: string) => {
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
      .map((n) => S[n % S.length])
      .join("");
    return randomChar + "_" + imageFileName;
  };

  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let imageUrlPath = "";

    if (tweetImage) {
      const tweetFileName = makeImageUrl(tweetImage.name);
      const uploadTweetImg = storage
        .ref(`images/${tweetFileName}`)
        .put(tweetImage);

      uploadTweetImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (error: any) => alert(error.message),
        async () => {
          await storage
            .ref("images")
            .child(imageUrlPath)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection("posts").add({
                avatar: user.photoUrl,
                image: url,
                text: tweetMsg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
              });
            })
            .catch();
        }
      );
    } else {
      db.collection("posts").add({
        avatar: user.photoUrl,
        image: "",
        text: tweetMsg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      });
    }
    setTweetMsg("");
    setTweetImage(null);
  };

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
