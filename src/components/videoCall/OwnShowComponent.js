"use client";
import { useEffect, useRef, useContext } from "react";
import styles from "./style/ownShow.module.css"
import { VideoCallContext } from "../../context/VideoContext";


const Video = (props) => {
  console.log("props props", props);
  const ref = useRef();
  useEffect(() => {
      props.peer.on("stream", stream => {
          ref.current.srcObject = stream;
      })
  }, []);

  return (
      <video style={{width: "200px", borderRadius: "15px"}} playsInline autoPlay ref={ref} />
  );
}

 function OwnShowComponent() {

  const { peers } = useContext(VideoCallContext);

  console.log("peers js",peers);

  return (
    <div className={styles.boxVideo}>
        {peers.map((peer, index) => {
            return (
                <Video key={index} peer={peer} />
            );
        })}
    </div>

  )
}


export default OwnShowComponent
