"use client";

import { createContext, useEffect, useState } from "react";
import {io} from "socket.io-client";
import config from "../config/app";

export const SocketContext = createContext();


export const SocketContextProvider = ({children, user}) => {

    const [socket, setSocket] = useState(null);

    useEffect(() => { 
        console.log("users login video call",user); 
        const newSocket = io(config.socket.url);
        setSocket(newSocket);
        
        return () => {
            newSocket.disconnect();
        }
     },[user]);
 
    return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
}