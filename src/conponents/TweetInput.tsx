import React, { useState } from "react";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { Avatar, Button, IconButton } from "@material-ui/core";
import { AddToPhotos } from "@material-ui/icons";

import { selectUser } from "../features/user/userSlice";
import { auth, db, storage } from "../firebase";
import styles from "./TweetInput.module.css";

const TweetInput: React.FC = () => {
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
      // ①inputから選択されたファイルオブジェクトから.nameでファイル名を取得する
      // ②fireStorageに格納する用にファイル名をランダムな文字列に変換してtweetFileNameに格納する
      const tweetFileName = makeImageUrl(tweetImage.name);
      // ③refで「どこに格納するか」を指定。putで格納する画像ファイルを指定。
      const uploadTweetImg = storage
        .ref(`images/${tweetFileName}`)
        .put(tweetImage);

      // ④srorageに格納した時に返却されたオブジェクトに対してonメソッドを使うと、そのオブジェクトの状態に変化があった時の後処理を記述できるらしい
      uploadTweetImg.on(
        // ⑤.TaskEvent.STATE_CHANGEDには、3つ関数を設けて制御できるらしい
        firebase.storage.TaskEvent.STATE_CHANGED,
        // ⑥uploadの進捗を管理する時に使う関数
        () => {},
        // ⑦エラーハンドリングをする時に使う関数
        (error) => alert(error.message),
        // ⑧正常終了した時に実行できる関数
        async () => {
          // ⑨storageに格納した画像のpathを取得したら -> then
          await storage
            .ref("images")
            .child(tweetFileName)
            .getDownloadURL()
            // ⑩画像のpathのURLを 返り値(url) として受け取る
            .then(async (url) => {
              // ⑪firestoreに画像のURLのpathを登録する
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
    <>
      <form onSubmit={sendTweet}>
        <div className={styles.tweet_form}>
          <Avatar
            className={styles.tweet_avatar}
            src={user.photoUrl}
            onClick={() => auth.signOut()}
          />
          <input
            className={styles.tweet_input}
            placeholder="What's happening?"
            type="text"
            autoFocus
            value={tweetMsg}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTweetMsg(e.target.value)
            }
          />
          <IconButton>
            <label>
              <AddToPhotos
                className={
                  tweetImage ? styles.tweet_addIconLoaded : styles.tweet_addIcon
                }
              />
              <input
                className={styles.tweet_hiddenIcon}
                type="file"
                onChange={onChangeImageHandler}
              />
            </label>
          </IconButton>
        </div>
        <Button
          type="submit"
          disabled={!tweetMsg}
          className={
            tweetMsg ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
          }
        >
          Tweet
        </Button>
      </form>
    </>
  );
};

export default TweetInput;
