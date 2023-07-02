"use client";

import Room from "@/components/room/RoomComponent";
import { AuthContext } from "@/context/AuthContext";
import { SocketContextProvider } from "@/context/SocketContext";
import { VideoCallContextProvider } from "@/context/VideoContext";
import { useContext } from "react";

export default function Home() {

  const {user} = useContext(AuthContext);

  return (
    <>
     patient page
     <SocketContextProvider user={user}>
          <VideoCallContextProvider user={user}>
            <Room></Room>
          </VideoCallContextProvider>
      </SocketContextProvider>
    </>
  )
}
