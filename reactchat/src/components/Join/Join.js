//Join.js
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import './Join.css';
import { Context } from '../Context';

export let Join = () => {
 let { room, name, hashWord, setHashWord, setRoom, setName, setAuth, socket, urlUser, urlRooms } = useContext(Context);
 let [rooms, setRooms] = useState([]);
 
 useEffect(() => { getRooms() }, []);

 let onClick = async (e) => {
  e.preventDefault()
  let isField = 0, isRoom = 0, isUser = 0;
  isField = isValidFields();
  if (isField) isRoom = isValidRoom();
  if (isField && isRoom) isUser = await isDbUser();
  if (isField && isRoom && isUser) {
   socket.emit('getUsers', { room }, () => { });
   socket.on('userData', users => {
    if (users.filter(user => user.name === name).length === 0) {
     setAuth(1)
    } else {
     console.log('Username taken.')
    }
   });
  }
 };

 let isValidFields = () => {
  let i = 1;
  if (!name || !hashWord || !room) { i = 0; alert('All Fields are required') }
  return i;
 };

 let isValidRoom = () => {
  let i = 1;
  if (rooms.findIndex(r => r === room) === -1) { i = 0; alert('Invalid Room') }
  return i;
 };

 let isDbUser = async () => {
  let token = new Date().getTime().toString();
  let params = { params: { hashWord: hashWord, userName: name, token: token } };
  let fetch = await axios.get(urlUser, params);
  let i = await fetch.data[0].Authenticated;
  if (!i) alert('Username or password does not exists')
  return i;
 };

 async function getRooms() {
  let token = new Date().getTime().toString();
  let params = { params: { token: token } };  
  let fetch = await axios.get(urlRooms, params);
  let data = await fetch.data;
  setRooms(data.map(room => room.roomName))
 };

 return (
  <div className="joinOuterContainer">
   <div className="joinInnerContainer">

    <form onSubmit={onClick}>
     <h1 className="heading">Join</h1>
     <div>
      <input placeholder="Username" className="joinInput" type="text"
       onChange={(e) => setName(e.target.value)} />
     </div>

     <div>
      <input placeholder="Password" className="joinInput mt-20" type="text"
       onChange={(e) => setHashWord(e.target.value)} />
     </div>

     <div>
      <input
       placeholder="Room"
       className="joinInput mt-20"
       type="text"
       required list="rooms"
       autoComplete='off'
       onChange={(e) => setRoom(e.target.value)} />
      <datalist id="rooms" autoComplete='off'>
       {rooms.map((room, i) => <option key={i} value={room}></option>)}
      </datalist>
     </div>

     <button className={'button mt-20'} type="submit"
      onClick={(e) => onClick(e)}>SIGN IN</button>
    </form>
   </div>
  </div>
 );

}
