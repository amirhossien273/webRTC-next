"use client";
import React,{useState,useEffect, useContext} from "react";
import OtherShow from "./OtherShowComponent";
import OwnShow from "./OwnShowComponent";
import { VideoCallContext } from "@/context/VideoContext";



export default function VideoCallComponent() {

  const { userVideo, changeVideoCamera, selectedVideoInput, videoInputs, handleCameraToggle } = useContext(VideoCallContext);

  // console.log(userVideo);
  console.log(userVideo);

  return (
    <div >
      ssssss
      <div>
      <label>انتخاب دوربین:</label>
             <select className="form-control rtl mt-2" value={selectedVideoInput} onChange={(e)=>changeVideoCamera(e)}>
                {videoInputs.map((inp,index)=>(
                  <option key={index} value={inp.deviceId}>{inp.label}</option>    
                ))}
            </select>   
      </div>
      {/* <video  muted ref={userVideo} autoPlay playsInline  /> */}
      <button onClick={()=>handleCameraToggle()} className="btn btn-warning rounded-circle rounded-padding" autoFocus>
                                    asasas
                                </button>
      <OwnShow /> 
       <OtherShow /> 
    </div>

  )
}
