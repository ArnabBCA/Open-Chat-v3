import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { ChatContext } from '../../../context/ChatContext';
import Message from './Message';
import styles from './Messages.module.scss';
import { db } from '../../../firebase';
const Messages = (props) => {
  const {data}=useContext(ChatContext);

  let sameChatId=[];
  let sameDate=[];

  let id=[];
  id=props.messages.map(obj=>obj.id)

  let senderId=[];
  senderId=props.messages.map(obj=>obj.senderId);
  let k=0;
  let temp=senderId[0];

  for (let i = 1; i < senderId.length; i++) {
    if(temp===senderId[i])
    {
      sameChatId[k]=id[i];
      k++;
    }
    else{
      temp=senderId[i];
    }
  }

  let date=[];
  date=props.messages.map(obj=>obj.date);
  let j=0;
  let tempDate=date[0];

  for (let i = 1; i < senderId.length; i++) {
    if(tempDate===date[i])
    {
      sameDate[j]=id[i];
      j++;
    }
    else{
      tempDate=date[i];
    }
  }

  if(!props.groupChatActive)
  {
    useEffect(()=>{
      setTimeout(() => {
        const unSub=onSnapshot(doc(db,"chats",data.chatId),(doc)=>{
          doc.exists() && props.setMessages(doc.data().messages)
        })
        return()=>{
          unSub();
        }
      },[1000]);
    },[data.chatId])
  }
  else
  {
    useEffect(()=>{
      setTimeout(() => {
        const unSub=onSnapshot(doc(db,"groupChat","GROUPCHATMESSAGES"),(doc)=>{
          doc.exists() && props.setMessages(doc.data().messages)
        })
        return()=>{
          unSub();
        }
      },[1000]);
    },["GROUPCHATMESSAGES"])
  }
  return (
    <div className={styles.messages}>
      {props.messages.map((m)=>(
        <Message message={m} sameChatId={sameChatId} sameDate={sameDate} key={m.id}/>
      ))}
    </div>
  )
}

export default Messages