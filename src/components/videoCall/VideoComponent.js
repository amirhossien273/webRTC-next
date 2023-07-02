"use client";
import styles from "./style/video.module.css"

export default function VideoComponent(props) {


console.log(props);

  return (
    <>
      <video className={styles.videoCall}  muted ref={props.video.userVideo} autoPlay playsInline />
    </>
  )
}
