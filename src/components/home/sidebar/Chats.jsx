import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext';
import { ChatContext } from '../../../context/ChatContext';
import { db } from '../../../firebase';
import styles from './Chats.module.scss';
import GroupChat from './GroupChat';
const Chats = (props) => {
  const [toggleSate,setToggleState]=useState('');
  const [chats,setChats]=useState([]);
  const {currentUser}=useContext(AuthContext);
  const {dispatch}=useContext(ChatContext);
  useEffect(()=>{
    const getChats=()=>{
      const unsub=onSnapshot(doc(db,"userChats",currentUser.uid),(doc)=>{
        setChats(doc.data());
      }); 
      return()=>{
        unsub();
      };
    };
    currentUser.uid && getChats()
  },[currentUser.uid]);

  
  const handleSelect=(u)=>{
    dispatch({type:"CHANGE_USER",payload:u});
    setToggleState(u.uid);
    if(toggleSate!==u.uid)
    {
      props.setMessages([]);
    }
    props.hide(true);
    props.setWelcomeScreen(false);
    if(props.groupChatActive){
      props.setGroupChatActive(false);
    }
  }
  return (
    <div className={styles.chats}>
      <div className={styles.messages}>
        <span>Messages</span>
        <i className ="fa-solid fa-comments"></i>
      </div>
      <GroupChat toggleSate={toggleSate} setToggleState={setToggleState} hide={props.hide} setWelcomeScreen={props.setWelcomeScreen} setGroupChatActive={props.setGroupChatActive} groupChatActive={props.groupChatActive} setMessages={props.setMessages}/>
      {Object.entries(chats)?.sort((a,b)=>b[1].date-a[1].date).map(chat=>(
      <div className={toggleSate === (chat[1].userInfo.uid)? `${styles.userChats} ${styles.active}`:styles.userChats} key={chat[0]} onClick={()=>handleSelect(chat[1].userInfo)}>
        <img referrerPolicy='no-referrer' src={chat[1].userInfo.photoURL}  alt="profile pic" />
        <div className={styles.userChatsInfo}>
          <div className={styles.userChatsData}>
            <span>{chat[1].userInfo.displayName}</span>
            {chat[1].lastMessage && <p>{chat[1].lastMessage.message.length>20 ? chat[1].lastMessage.message.substring(0,20)+"..."  : chat[1].lastMessage.message}</p>}
          </div>
          {chat[1].lastMessage && <div className={styles.userChatsDateTime}>
            <span>{chat[1].lastMessage.date}</span>
            <span>{chat[1].lastMessage.time}</span>
          </div>}
        </div>
      </div>
      ))}
    </div>
  )
}

export default Chats