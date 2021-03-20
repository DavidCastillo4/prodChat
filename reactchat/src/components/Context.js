//Context.js
import React, { useState, createContext } from 'react';
import io from "socket.io-client";
export let Context = createContext();

let socket
,urlUser = process.env.REACT_APP_urlUser
,urlRooms = process.env.REACT_APP_urlRooms
,urlBleep = process.env.REACT_APP_urlBleep;

//socket = io.connect(process.env.REACT_APP_urlSocket, { path: '/expressChatSocket3106/socket.io' });
socket = io.connect(process.env.REACT_APP_urlSocket);

export let ContextProvider = ({ children }) => {
 let [name, setName] = useState('');
 let [hashWord, setHashWord] = useState('');
 let [room, setRoom] = useState('');
 let [auth, setAuth] = useState(0);

 return (
  <Context.Provider value={{
   name: name,
   setName: setName,
   hashWord: hashWord,
   setHashWord: setHashWord,
   room: room,
   setRoom: setRoom,
   auth: auth,
   setAuth: setAuth,
   socket: socket,
   urlUser: urlUser,
   urlRooms: urlRooms,
   urlBleep: urlBleep
  }}>
   {children}
  </Context.Provider>
 )
};

