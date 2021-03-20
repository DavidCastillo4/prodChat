import React, { useContext } from 'react';
import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';
import './InfoBar.css';
import { Context } from '../Context'

export let InfoBar = () => {
 let { room } = useContext(Context);

 return (
   <div className="infoBar">
     <div className="leftInnerContainer">
       <img className="onlineIcon" src={onlineIcon} alt="online icon" />
       <h3>{room}</h3>
     </div>
     <div className="rightInnerContainer">
       <a href='/Chat/' >
         <img src={closeIcon} alt="close icon" />
       </a>
     </div>
   </div>
 );

}
