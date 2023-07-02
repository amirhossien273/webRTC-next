"use client";

import { createContext, useEffect, useState } from "react";
import users from '../data/users.json';

export const AuthContext = createContext();


export const AuthContextProvider = ({children}) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
       setUser(makeid(20));

    },[]);
 

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    return <AuthContext.Provider  value={{user}}>{children}</AuthContext.Provider>
}