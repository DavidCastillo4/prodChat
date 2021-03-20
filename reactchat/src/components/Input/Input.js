import React from 'react';
import './Input.css';

export let Input = ({ setMessage, sendMessage, message, typing }) => {
 return (
   <form className="form">
     <div id='typing'>{typing}</div>
     <input
       className="input"
       type="text"
       placeholder="Type a message..."
       value={message}
       onChange={({ target: { value } }) => setMessage(value)}
       onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
     />
     <button className="sendButton" onClick={e => sendMessage(e)}>SEND</button>
   </form>
 )
}