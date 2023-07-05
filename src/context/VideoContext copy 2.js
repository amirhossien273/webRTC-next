"use client";

import { createContext, useEffect, useState, useRef, useContext} from "react";
import { SocketContext } from "./SocketContext";
import Peer from "simple-peer";
// import { useParams } from "react-router-dom";

export const VideoCallContext = createContext();


export const VideoCallContextProvider = ({children, user}) => {

    const [stream, setStream] = useState(null);
    const [peers, setPeers] = useState([]);
    const [selectedVideoInput, setSelectedVideoInput] = useState("");
    const {socket} = useContext(SocketContext);
    const peersRef = useRef([]);
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
            

          })

          console.log("ddddddddddddddddddddddddddddddddddddddddddd", videoDevice);
          // setVideoInputs(videoDevice);

          startStream();

          // console.log("socket emit in", socket.emit("join room", {roomID : "roomID", userId: "userId"}));
        //   })
        // console.log("getDevices() device:",getDevices());
        // showVideo(true, true);
       
        // console.log("socket run" ,socket);

    }, [socket]);

    useEffect(() => {
      console.log("selectedVideoInput for devices",selectedVideoInput);
      startStream(selectedVideoInput);
    }, [selectedVideoInput]);
  
    async function getDevices() {
      let stream = null;


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
    

    function startStream (deviceId) {
        // if (stream) {
        //   stream.getTracks().forEach((track) => {
        //     if (track.kind === "video") {
        //       prevTrack = track;
        //       track.stop();
        //     }
        //   });
        // }
    
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
            
            // if (connectionRef.current) {
            //   stream.removeTrack(stream.getVideoTracks()[0]);
            //   stream.addTrack(str.getVideoTracks()[0]);
            //   connectionRef.current.replaceTrack(
            //     prevTrack,
            //     str.getVideoTracks()[0],
            //     stream
            //   );
            //   // myVideo.current.muted = false;
            // } else {
            //   setStream(str);
            //   // myVideo.current.muted = true;
            // }
            userVideo.current.srcObject  = str;

            const roomID = "J5uGgH1DmZPZWLo0vOMi1234";
            console.log("show user in log", user);
            const userId = user;
            console.log("socket emit in dsssssssssssssss", socket.emit("join room", {roomID : "roomID", userId: "userId"}));
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
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socket.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
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
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socket.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
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

    



    return <VideoCallContext.Provider value={{userVideo, changeVideoCamera, selectedVideoInput, videoInputs, peers}}>{children}</VideoCallContext.Provider>
}