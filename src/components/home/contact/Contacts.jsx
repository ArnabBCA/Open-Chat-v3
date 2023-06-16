import React, { useContext, useState } from 'react'
import styles from './Contacts.module.scss';
import { db } from '../../../firebase';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { AuthContext } from '../../../context/AuthContext';
const Contacts = ({message}) => {
    const {currentUser}=useContext(AuthContext);
    const addContact=async()=>{
      if(message.uid===currentUser.uid){
        return;
      }
        const combinedId=currentUser.uid > message.uid ? currentUser.uid+message.uid : message.uid+currentUser.uid;
        try{
          const res=await getDoc(doc(db,"chats",combinedId));
          if(!res.exists()){
            await setDoc(doc(db,"chats",combinedId),{messages:[]});
            await updateDoc(doc(db,"userChats",currentUser.uid),{
              [combinedId+".userInfo"]:{
                uid:message.uid,
                displayName:message.displayName,
                photoURL:message.photoURL,
              },
              [combinedId+".date"]:serverTimestamp()
            });
            await updateDoc(doc(db,"userChats",message.uid),{
              [combinedId+".userInfo"]:{
                uid:currentUser.uid,
                displayName:currentUser.displayName,
                photoURL:currentUser.photoURL,
              },
              [combinedId+".date"]:serverTimestamp()
            });
          }
        }catch(error){}
      }
  return (
    <div className={styles.contact} onClick={addContact}>
        <img referrerPolicy='no-referrer' src={message.photoURL} alt="avatar" />
        <span>{message.displayName}</span>
    </div>
  )
}

export default Contacts