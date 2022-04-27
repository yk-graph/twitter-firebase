import React from "react";
import TweetInput from "./TweetInput";
import styles from "./Feed.module.css";

const Feed: React.FC = () => {
  return (
    <div className={styles.feed}>
      <TweetInput />
    </div>
  );
};

export default Feed;
