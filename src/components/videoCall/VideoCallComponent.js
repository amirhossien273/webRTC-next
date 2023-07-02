"use client";
import React,{useState,useEffect, useContext} from "react";
import OtherShow from "./OtherShowComponent";
import OwnShow from "./OwnShowComponent";
import { VideoCallContext } from "@/context/VideoContext";



export default function VideoCallComponent() {

  const { userVideo } = useContext(VideoCallContext);

  // console.log(userVideo);
  console.log(userVideo);

  return (
    <div >
      ssssss
      <video  muted ref={userVideo} autoPlay playsInline  />
       {/* <OwnShow /> */}
       {/* <OtherShow /> */}
    </div>

  )
}
