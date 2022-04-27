import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import firebase from "firebase/app";

import { db } from "../firebase";
import { selectUser } from "../features/user/userSlice";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";
import { Message, Send } from "@material-ui/icons";
import styles from "./Post.module.css";

interface Props {
  post: PostType;
}

type PostType = {
  id: string;
  avatar: string;
  image: string;
  text: string;
  timestamp: any;
  username: string;
};

const Post: React.FC<Props> = ({ post }) => {
  return (
    <div className={styles.post}>
      <div className={styles.post_avatar}>
        <Avatar src={post.avatar} />
      </div>
      <div className={styles.post_body}>
        <div>
          <div className={styles.post_header}>
            <h3>
              <span className={styles.post_headerUser}>@{post.username}</span>
              <span className={styles.post_headerTime}>
                {new Date(post.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
          <div className={styles.post_tweet}>
            <p>{post.text}</p>
          </div>
        </div>
        {post.image && (
          <div className={styles.post_tweetImage}>
            <img src={post.image} alt="tweet" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
