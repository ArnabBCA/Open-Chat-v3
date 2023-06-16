import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext';
import { ChatContext } from '../../../context/ChatContext';
import styles from './Input.module.scss';
import groupIcon from '../../icons/groupChat.png'
import { db } from '../../../firebase';
import { v4 as uuid, v4 } from 'uuid';
import Gallary from '../../icons/gallary.png';
import { storage } from '../../../firebase';
import { ref,uploadBytes,getDownloadURL } from 'firebase/storage';
const Input = (props) => {
  const current_timestamp = Timestamp.fromDate(new Date());

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };
  const {currentUser}=useContext(AuthContext);
  const {data}=useContext(ChatContext);

  const [text,setText]=useState('');
  const [image,setImage]=useState('');

  const imageChange=(e)=>{
    if(e.target.files[0].size > 2200000){
      alert('Maximum image size 2MB')
      return;
    }
    else{
      setImage(e.target.files[0]);
      e.target.value = '';
    }
  }

  const privateChat=async()=>{
    if(text.trim()){
      await updateDoc(doc(db,"chats",data.chatId),{
        messages:arrayUnion({
          id:uuid(),
          text,
          image:null,
          senderId:currentUser.uid,
          displayName:currentUser.displayName,
          photoURL:currentUser.photoURL,
          timeStamp:Timestamp.now(),
          time:(current_timestamp.toDate().getHours())+':'+(current_timestamp.toDate().getMinutes()),
          date:(current_timestamp.toDate().getDate())+'/'+(current_timestamp.toDate().getMonth())+'/'+(current_timestamp.toDate().getFullYear()),
        })
      })
      await updateDoc(doc(db,"userChats",currentUser.uid),{
        [data.chatId+".lastMessage"]:{
          message:text,
          time:(current_timestamp.toDate().getHours())+':'+(current_timestamp.toDate().getMinutes()),
          date:(current_timestamp.toDate().getDate())+'/'+(current_timestamp.toDate().getMonth())+'/'+(current_timestamp.toDate().getFullYear()),
        },
        [data.chatId+".date"]:serverTimestamp(),
      })
      await updateDoc(doc(db,"userChats",data.user.uid),{
        [data.chatId+".lastMessage"]:{
          message:text,
          time:(current_timestamp.toDate().getHours())+':'+(current_timestamp.toDate().getMinutes()),
          date:(current_timestamp.toDate().getDate())+'/'+(current_timestamp.toDate().getMonth())+'/'+(current_timestamp.toDate().getFullYear()),
        },
        [data.chatId+".date"]:serverTimestamp(),
      })
    }
    if(image){
      const imageRef=ref(storage,`images/${data.chatId +":"+ v4()}`);
      await uploadBytes(imageRef,image);
      const url=await getDownloadURL(imageRef);
      await updateDoc(doc(db,"chats",data.chatId),{
        messages:arrayUnion({
          id:uuid(),
          text:null,
          image:url,
          senderId:currentUser.uid,
          displayName:currentUser.displayName,
          photoURL:currentUser.photoURL,
          timeStamp:Timestamp.now(),
          time:(current_timestamp.toDate().getHours())+':'+(current_timestamp.toDate().getMinutes()),
          date:(current_timestamp.toDate().getDate())+'/'+(current_timestamp.toDate().getMonth())+'/'+(current_timestamp.toDate().getFullYear()),
        })
      })
      await updateDoc(doc(db,"userChats",currentUser.uid),{
        [data.chatId+".lastMessage"]:{
          message:"*Image",
          time:(current_timestamp.toDate().getHours())+':'+(current_timestamp.toDate().getMinutes()),
          date:(current_timestamp.toDate().getDate())+'/'+(current_timestamp.toDate().getMonth())+'/'+(current_timestamp.toDate().getFullYear()),
        },
        [data.chatId+".date"]:serverTimestamp(),
      })
      await updateDoc(doc(db,"userChats",data.user.uid),{
        [data.chatId+".lastMessage"]:{
          message:"*Image",
          time:(current_timestamp.toDate().getHours())+':'+(current_timestamp.toDate().getMinutes()),
          date:(current_timestamp.toDate().getDate())+'/'+(current_timestamp.toDate().getMonth())+'/'+(current_timestamp.toDate().getFullYear()),
        },
        [data.chatId+".date"]:serverTimestamp(),
      })
    }
    setText('');
    setImage('');
  }
  const groupChat=async()=>{
    if(text.trim()){
      await updateDoc(doc(db,"groupChat","GROUPCHATMESSAGES"),{
        messages:arrayUnion({
          id:uuid(),
          text,
          image:null,
          senderId:currentUser.uid,
          displayName:currentUser.displayName,
          photoURL:currentUser.photoURL,
          timeStamp:Timestamp.now(),
          time:(current_timestamp.toDate().getHours())+':'+(current_timestamp.toDate().getMinutes()),
          date:(current_timestamp.toDate().getDate())+'/'+(current_timestamp.toDate().getMonth())+'/'+(current_timestamp.toDate().getFullYear()),
        })
      })
    }
    if(image){
      const imageRef=ref(storage,`images/${currentUser.uid +":"+ v4()}`);
      await uploadBytes(imageRef,image);
      const url=await getDownloadURL(imageRef);
      await updateDoc(doc(db,"groupChat","GROUPCHATMESSAGES"),{
        messages:arrayUnion({
          id:uuid(),
          text:null,
          image:url,
          senderId:currentUser.uid,
          displayName:currentUser.displayName,
          photoURL:currentUser.photoURL,
          timeStamp:Timestamp.now(),
          time:(current_timestamp.toDate().getHours())+':'+(current_timestamp.toDate().getMinutes()),
          date:(current_timestamp.toDate().getDate())+'/'+(current_timestamp.toDate().getMonth())+'/'+(current_timestamp.toDate().getFullYear()),
        })
      })
    }
    setText('');
    setImage('');
  }
  const handleSend=()=>{
    if(props.groupChatActive){
      groupChat();
    }
    else{
      privateChat();
    }
  }
  return (
    <div className={styles.inputForm}>
      <div className={styles.input}>
        {props.groupChatActive ? <img className={styles.profilePic} src={groupIcon} alt="profilepic" /> :<img className={styles.profilePic} src={data.user.photoURL} alt="profilepic" />}
        <input type="text" onKeyDown={handleKeyDown} onChange={e=>setText(e.target.value)} value={text} placeholder='Type Message...'/>
        <input style={{display:"none"}} onChange={imageChange} type="file"  accept='image/*' name='file' id='file'/>
        <label htmlFor='file'>
          {!image?<img src={Gallary} className={styles.imgDisable} alt="gallary"/>:<img src={Gallary} alt="gallary"/>}
        </label>
        {!text && !image ? <button type='submit' className={styles.disable} disabled id="myBtn"onClick={handleSend}><i className="fa fa-paper-plane" aria-hidden="true"></i></button> : <button type='submit' id="myBtn"onClick={handleSend}><i className="fa fa-paper-plane" aria-hidden="true"></i></button>}
      </div>
    </div>
  )
}

export default Input