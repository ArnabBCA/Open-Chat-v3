import React, { useContext, useState } from 'react'
import { ChatContext } from '../../../context/ChatContext';
import styles from './Chat.module.scss';
import Input from './Input';
import Messages from './Messages';
import groupIcon from '../../icons/groupChat.png'
import { AuthContext } from '../../../context/AuthContext';
const Chat = (props) => {
  const {data}=useContext(ChatContext);
  const {currentUser}=useContext(AuthContext);
  return (
    <div className={props.visible ? styles.chatVisible : styles.chat}>
      {props.welcomeScreen && <div className={styles.welcomeContainer}>
        <div className={styles.logo}>
          <span className={styles.open}>Open</span>
          <span className={styles.chat}>Chat</span>
        </div>
        <span>By Arnab Ghosh</span>
      </div>}     
      {!props.welcomeScreen && <div className={styles.chatContainer}>
        <div className={styles.chatInfo}>
          <div className={styles.userInfo}>
            <div className={styles.dualAvatar}>
              <img src={currentUser.photoURL} alt="avatar" />
              {!props.groupChatActive && <img src={data.user.photoURL} alt="avatar" />}
              {props.groupChatActive && <img src={groupIcon} alt="group chat" />}
            </div>
            {!props.groupChatActive && <span>{data.user.displayName}</span>}
            {props.groupChatActive && <span>Group Chat</span>}
          </div>
          <button type='button' onClick={()=>props.hide(false)}><i className="fa-solid fa-left-long"></i></button>
        </div>
        <Messages groupChatActive={props.groupChatActive} messages={props.messages} setMessages={props.setMessages}/>
        <Input groupChatActive={props.groupChatActive}/>
      </div>}
    </div>
  )
}

export default Chat