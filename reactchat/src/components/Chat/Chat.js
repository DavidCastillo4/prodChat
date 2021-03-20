//Chat.js
import React, { useState, useEffect, useContext } from "react";
//import {TextContainer} from '../TextContainer/TextContainer';
import { Messages } from '../Messages/Messages';
import { InfoBar } from '../InfoBar/InfoBar';
import { Input } from '../Input/Input';
import './Chat.css';
import { Context } from '../Context';

export let Chat = () => {
 let [message, setMessage] = useState('');
 let [messages, setMessages] = useState([]);
 let [typing, setTyping] = useState('');
 let [users, setUsers] = useState();
 let { room, name, socket, urlBleep } = useContext(Context);

 useEffect(() => {
  socket.emit('join', { name, room }, (error) => { });
 }, [name, room]);

 useEffect(() => {
  socket.on('message', message => {
   new Audio(urlBleep).play();
   setMessages(messages => [...messages, message]);
  });
  socket.on("roomData", ({ users }) => { setUsers(users); });
 }, []);

 useEffect(() => {
  socket.emit('keyPress', { name, room }, () => { });
  socket.on('msg', msg => {
   setTyping(msg);
   setTimeout(() => { setTyping(''); }, 500);
  });
 }, [message]);

 let sendMessage = (e) => {
  e.preventDefault();
  if (message) { socket.emit('sendMessage', message, () => setMessage('')); }
 };

 return (
  <div className="outerContainer">
   <div className="container">
    <InfoBar />
    <Messages messages={messages} name={name} />
    <Input message={message} setMessage={setMessage} sendMessage={sendMessage} typing={typing} />
   </div>
   {/* <TextContainer users={users} /> */}
  </div>
 );
};


