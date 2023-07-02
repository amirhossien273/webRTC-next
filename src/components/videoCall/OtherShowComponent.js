
"use client";
import { useContext } from "react";
import styles from "./style/videoCall.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faPhoneSlash, faVideo, faVideoSlash, faMicrophoneSlash, faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { VideoCallContext } from "../../context/VideoContext";

export default function OtherShowComponent() {

  const { userVideo } = useContext(VideoCallContext)

  return (
    <div className={styles.boxVideo}>
      <video className={styles.videoCall}  muted ref={userVideo} autoPlay playsInline />
        <div className={styles.boxButton} >
          <span><FontAwesomeIcon icon={faPhone} /></span>
          <span><FontAwesomeIcon icon={faPhoneSlash} /></span>
          <span className={styles.activeButton}><FontAwesomeIcon icon={faVideo} /></span>
          <span><FontAwesomeIcon icon={faVideoSlash} /></span>
          <span><FontAwesomeIcon icon={faMicrophoneSlash} /></span>
          <span><FontAwesomeIcon icon={faMicrophone} /></span>
        </div>
    </div>

  )
}
