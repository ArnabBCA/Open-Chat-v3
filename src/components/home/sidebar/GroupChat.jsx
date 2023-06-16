import React, { useEffect, useState } from 'react'
import styles from './GroupChat.module.scss';
import groupIcon from '../../icons/groupChat.png'
import { db } from '../../../firebase';
import { collection, onSnapshot, query} from 'firebase/firestore';
const GroupChat = (props) => {
  const[avatars,setAvatars]=useState([]);
  const handleGroup=()=>{
    props.setToggleState('GROUPCHAT');
    props.hide(true);
    props.setWelcomeScreen(false);
    if(!props.groupChatActive){
      props.setGroupChatActive(true);
      props.setMessages([]);
    }
  }
  useEffect(()=>{
    const q=query(collection(db,'users'))
    const unsubscribe=onSnapshot(q,(querySnapshot)=>{
        let avatars=[]
        querySnapshot.forEach((doc)=>{
          avatars.push({...doc.data(),id: doc.id})
        })
        setAvatars(avatars)
    })
    return()=>unsubscribe()
  },[]);
  return (
    <div className={props.toggleSate === 'GROUPCHAT'? `${styles.groupChat} ${styles.active}`:styles.groupChat} onClick={handleGroup}>
        <div className={styles.groupInfo}>
            <img src={groupIcon} alt="" />
            <span>Group Chat</span>
        </div>
        <div className={styles.groupProfile}>
          {avatars && avatars.slice(0, 5).map(avatars=>(
            <img src={avatars.photoURL} key={avatars.id}/>
          ))}
          <div className={styles.avatarCount}>{avatars.length}</div>
        </div>
    </div>
  )
}

export default GroupChat