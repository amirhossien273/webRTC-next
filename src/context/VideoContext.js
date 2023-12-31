"use client";

import { createContext, useEffect, useState, useRef, useContext} from "react";
import { SocketContext } from "./SocketContext";
import Peer from "simple-peer";
// import { useParams } from "react-router-dom";

export const VideoCallContext = createContext();


export const VideoCallContextProvider = ({children, user}) => {

    const [stream, setStream] = useState(null);
    const [peers, setPeers] = useState([]);
    const [selectedVideoInput, setSelectedVideoInput] = useState(null);
    const {socket} = useContext(SocketContext);
    const peersRef = useRef();
    const connectionRef = useRef();
    const [videoInputs, setVideoInputs] = useState([]);

    const userVideo = useRef();
    // const userVideo = useRef();
    // const peersRef = useRef([]);
    // const params = useParams();
    // const roomID = params.roomI  ;
    // const userId = user?.id;
    

    useEffect(() => {

        if(socket === null) return;

        // if(userId !== undefined) 
        let dd = "";
        // let myPromise = new Promise(function(myResolve, myReject) {
          // console.log("socket emit on", socket.emit("join room", {roomID : "roomID", userId: "userId"}));
          
          let videoDevice = [];
          getDevices().then( (devices) =>{

            devices.map((device) => {
              if(device.kind == "videoinput"){
                videoDevice.push(device);
              }
            });
            
                  setVideoInputs(videoDevice);
                // showVideo(true, true);
                startStream(videoDevice[0].deviceId);
          })

          // setVideoInputs(videoDevice);
          // showVideo(true, true);
          // startStream();

          // console.log("socket emit in", socket.emit("join room", {roomID : "roomID", userId: "userId"}));
        //   })
        // console.log("getDevices() device:",getDevices());
        // showVideo(true, true);
       
        // console.log("socket run" ,socket);

    }, [socket]);

    useEffect(() => {
      if(selectedVideoInput !== null){ 
        startStream(selectedVideoInput);
      }
    }, [selectedVideoInput]);
  
    async function getDevices() {


      return new Promise((resolve, reject) => {
        navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {resolve(devices)})
    });
    
     await navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      // devices.forEach((device) => {
        // console.log("devices log all", devices[0]);
        return devices;
        // if(device.kind == "videoinput"){
            // console.log("show all device",device);
        // }
      // });
    })
    }
    
    let prevTrack;
    function startStream (deviceId) {
        if (stream) {
          stream.getTracks().forEach((track) => {
            console.log("track video :",track);
            if (track.kind === "video") {
              prevTrack = track;
              track.stop();
            }
          });
        }
    
        let constraints = {
          audio: true,
          video: {
            deviceId: deviceId
          },
        };
        // console.log("navigator.mediaDevices.getUserMedia(): ",navigator.mediaDevices.getUserMedia());
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then( str => {
            // console.log("constraints LOG: ",str);
            
            if (peersRef.current) {
              // peersRef.current.destroy();
              console.log("tr.getVideoTracks()[0]: ", str.getVideoTracks()[0]);
              stream.removeTrack(stream.getVideoTracks()[0]);
              stream.addTrack(str.getVideoTracks()[0]);
              peersRef.current.replaceTrack(
                prevTrack,
                str.getVideoTracks()[0],
                stream
              );
              userVideo.current.muted = false;
            } else {
              setStream(str);
              userVideo.current.muted = true;
            }
            userVideo.current.srcObject  = str;
            console.log("???????????????????????????????????????????????????");
            console.log(str);
            console.log("???????????????????????????????????????????????????");
            const roomID = "J5uGgH1DmZPZWLo0vOMi1234";
            console.log("show user in log", user);
            const userId = user;
            socket.emit("join room", {roomID, userId});
            socket.on("all users", users => {
                console.log("all users show: ",users);
                const peers = [];
                users.forEach(user => {
                  console.log("*******************************************");
                  console.log(str);
                  console.log("*******************************************");
                    const peer = createPeer(user.socketId, socket.id, str);
                    peersRef.current = peer;
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socket.on("user joined", payload => {
              console.log("+++++++++++++++++++++++++++++++++++++++++++++");
              console.log(str);
              console.log("++++++++++++++++++++++++++++++++++++++++++++++");
                const peer = addPeer(payload.signal, payload.callerID, str);
                peersRef.current = peer;

                setPeers(users => [...users, peer]);
            });

            socket.on("receiving returned signal", payload => {
                const item = peersRef.current;
                item.signal(payload.signal);
            });

          })
          .then(gotVideoDevices)
          .catch();
      };
      // let videoInputsArray = [...videoInputs];
      function   gotVideoDevices(devices) {
      //   console.log("show devices ",devices);
      //   if (devices) {
      //     console.log("show devices1 ",devices);
      //     devices.forEach(function (device) {
      //       if (device.kind === "videoinput") {
      //         videoInputsArray.push(device);
      //       }
      //     });
      //     setVideoInputs(videoInputsArray);
      //   }
      };

      function changeVideoCamera(e) {
        setSelectedVideoInput(e.target.value);
      };

    function showVideo (video, audeio) {
        navigator.mediaDevices.getUserMedia({ video: video, audio: audeio }).then(stream => {
            
            userVideo.current.srcObject = stream;
            const roomID = "J5uGgH1DmZPZWLo0vOMi1234";
            console.log("show user in log", user);
            const userId = user;
            socket.emit("join room", {roomID, userId});
            socket.on("all users", users => {
                console.log("all users show: ",users);
                const peers = [];
                users.forEach(user => {
                    const peer = createPeer(user.socketId, socket.id, stream);
                    peersRef.current.push({
                        peerID: user.socketId,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socket.on("user joined", payload => {
                console.log(1);
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current = peer;

                setPeers(users => [...users, peer]);
            });

            // socket.on("receiving returned signal", payload => {
            //     const item = peersRef.current.find(p => p.peerID === payload.id);
            //     item.peer.signal(payload.signal);
            // });
        });
    }

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socket.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socket.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }
    function handleCameraToggle() {
      setCameraStatus(!stream.getVideoTracks()[0].enabled);
      stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
    };

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++

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

    



    return <VideoCallContext.Provider value={{userVideo, changeVideoCamera, selectedVideoInput, videoInputs, peers, handleCameraToggle}}>{children}</VideoCallContext.Provider>
}