"use client";


import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
// import { useNavigate } from "react-router-dom";
import Peer from "simple-peer";
import config from "../config/app";

// const token = localStorage.getItem("token");
const VideoContext = createContext();
let socket;
// if (localStorage.getItem("token") && localStorage.getItem("user_id")) {
socket = io(config.socket.url);
// }
const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState({});
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [openCallDialog, setOpenCallDialog] = useState(false);
  const [showUsersList, setShowUsersList] = useState(true);
  const [otherPartyInfo, setOtherPartyInfo] = useState("");
  const [videoInputs, setVideoInputs] = useState([]);
  const [selectedVideoInput, setSelectedVideoInput] = useState("");
  const [micStatus, setMicStatus] = useState(true);
  const [cameraStatus, setCameraStatus] = useState(true);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const isMountedRef = useRef(null);
  const myAudioRef = useRef();
  const userAudioRef = useRef();
//   const navigate = useNavigate();

  useEffect(() => {
    startStream();
    isMountedRef.current = true;

    const userId = "retgffyrty654676578657865865";
    navigator.mediaDevices
      .enumerateDevices()
      .then(gotVideoDevices)
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });

    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((str) => {
    //     setStream(str);
    //     myVideo.current.srcObject = str;
    //   });

    socket.emit("allUsersList", userId);
    socket.on("allUsersList", (users) => {
      //console.log(users);
      if (isMountedRef.current) {
        setUsersList(users);
      }
    });

    socket.emit("getMe");
    socket.on("getMe", (info) => {
      console.log(info);
      // if (isMountedRef.current) {
      setMe(info);
      // }
    });

    socket.on("reloadOtherParty", () => {
      socket.emit("getMe");
      socket.emit("allUsersList", userId);
      window.location.reload();
    });

    socket.on("callRequest", ({ otherParty, from, signal }) => {
      // if (isMountedRef.current) {
      setCall({ isRecievedCall: true, otherParty, from, signal });
      setCallEnded(false);
      // }
      if (userAudioRef.current) {
        console.log(userAudioRef.current);
        userAudioRef.current.muted = false;
      }
    });
    socket.on("callEnded", (status) => {
      // if (isMountedRef.current) {
      setCallEnded(status);
      // }
      window.location.reload();
      // setOpenCallDialog(false);
      // setCallAccepted(false);
      // setShowUsersList(true);
      // connectionRef.current.destroy();
    });

    return () => {
      isMountedRef.current = false;
      setStream(null);
      setMe({});
      setCall({});
      setCallAccepted(false);
      setCallEnded(false);
      setUsersList([]);
      setOpenCallDialog({});
      setShowUsersList(true);
      setVideoInputs([]);
      setSelectedVideoInput("");
      // socket.disconnect();
    };
  }, []);

  useEffect(() => {
    startStream();
  }, [selectedVideoInput]);

  let videoInputsArray = [...videoInputs];
  const gotVideoDevices = (devices) => {
    if (devices) {
      devices.forEach(function (device) {
        if (device.kind === "videoinput") {
          videoInputsArray.push(device);
        }
      });
      setVideoInputs(videoInputsArray);
    }
  };

  let prevTrack;
  const startStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.kind === "video") {
          prevTrack = track;
          track.stop();
        }
      });
    }

    let constraints = {
      audio: "true",
      video: {
        deviceId: selectedVideoInput
          ? { exact: selectedVideoInput }
          : undefined,
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((str) => {
        if (connectionRef.current) {
          stream.removeTrack(stream.getVideoTracks()[0]);
          stream.addTrack(str.getVideoTracks()[0]);
          connectionRef.current.replaceTrack(
            prevTrack,
            str.getVideoTracks()[0],
            stream
          );
          myVideo.current.muted = false;
        } else {
          setStream(str);
          myVideo.current.muted = true;
        }
        myVideo.current.srcObject = str;
      })
      .then(gotVideoDevices)
      .catch(handleError);
  };

  const handleError = (error) => {
    console.log(
      "navigator.MediaDevices.getUserMedia error: ",
      error.message,
      error.name
    );
  };

  const changeVideoCamera = (e) => {
    setSelectedVideoInput(e.target.value);
  };

  const answerCall = () => {
    userAudioRef.current.muted = true;
    setCallAccepted(true);
    setShowUsersList(false);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("callAnswer", {
        otherParty: { clientId: call.otherParty },
        signal: data,
      });
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
      userVideo.current.muted = false;
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    setOpenCallDialog(true);
    myAudioRef.current.muted = false;
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("callRequest", {
        otherParty: {
          clientId: id,
        },
        from: `${me.fname} ${me.lname}`,
        signalData: data,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
      userVideo.current.muted = false;
    });
    socket.on("callAccepted", (signal) => {
      myAudioRef.current.muted = true;
      setCallAccepted(true);
      setOpenCallDialog(false);
      setCallEnded(false);
      setShowUsersList(false);
      peer.signal(signal);
    });

    connectionRef.current = peer;
    console.log(connectionRef.current);
  };

  const leaveCall = (clientId) => {
    if (userAudioRef.current) {
      userAudioRef.current.muted = true;
    }
    if (myAudioRef.current) {
      myAudioRef.current.muted = true;
    }
    socket.emit("callEnded", {
      otherParty: { clientId },
    });
    // setOpenCallDialog(false);
    // setCallAccepted(false);
    // setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    window.location.reload();
  };

  const logout = () => {
    if (connectionRef.current) {
      const clientId = call.otherParty;
      socket.emit("reloadOtherParty", {
        otherParty: { clientId },
      });
      socket.disconnect();
    }
    // localStorage.removeItem("token");
    // localStorage.removeItem("user_id");
    window.location.reload();
    // navigate("/login");
  };

  const endCall = (clientId) => {
    if (userAudioRef.current) {
      userAudioRef.current.muted = true;
    }
    if (myAudioRef.current) {
      myAudioRef.current.muted = true;
    }
    socket.emit("callEnded", {
      otherParty: { clientId },
    });
    setCallAccepted(false);
    setCallEnded(true);
    setShowUsersList(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  const handleMicToggle = () => {
    setMicStatus(!stream.getAudioTracks()[0].enabled);
    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
  };

  const handleCameraToggle = () => {
    setCameraStatus(!stream.getVideoTracks()[0].enabled);
    stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
  };

  const value = {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    openCallDialog,
    showUsersList,
    name,
    usersList,
    setName,
    callEnded,
    me,
    callUser,
    leaveCall,
    answerCall,
    setCall,
    endCall,
    videoInputs,
    changeVideoCamera,
    selectedVideoInput,
    logout,
    handleCameraToggle,
    handleMicToggle,
    micStatus,
    cameraStatus,
    myAudioRef,
    userAudioRef,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};

export { ContextProvider, VideoContext };
