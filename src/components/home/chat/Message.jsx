import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../../../context/AuthContext';
import styles from './Message.module.scss';
const Message = ({message,sameChatId,sameDate}) => {
  const {currentUser}=useContext(AuthContext);
  const ref=useRef();
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message]);
  return (
    <>
    {!sameDate.includes(message.id) && <div className={styles.date}>
      <span>{message.date}</span>
    </div>}
    <div className={message.senderId===currentUser.uid ? styles.messageOwner : styles.message} ref={ref}>
      {!sameChatId.includes(message.id) && <img className={styles.profilePic} referrerPolicy='no-referrer' src={message.photoURL} alt="avatar" />}
      <div className={sameChatId.includes(message.id)?(message.senderId===currentUser.uid? styles.messageContentOwnerSameChat : styles.messageContentSameChat):(message.senderId===currentUser.uid? styles.messageContentOwner : styles.messageContent)}>
        {!sameChatId.includes(message.id) && <h6>{message.displayName}</h6>}
        {message.text && <p>{message.text}<sub>{message.time}</sub></p>}
        {message.image && <img src={message.image} alt='userImage'/>}
        {message.image &&<span>{message.time}</span>}
      </div>
    </div>
    </>
  )
}

export default Message