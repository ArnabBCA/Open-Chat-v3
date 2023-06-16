import React, { useState,useEffect } from 'react'
import styles from './ContactModal.module.scss';
import Contacts from './Contacts';
import { collection, doc, onSnapshot, orderBy, query} from 'firebase/firestore';
import { db } from '../../../firebase';
const ContactModal = (props) => {
  const[messages,setMessages]=useState([]);
  const handleClose=()=>{
    props.contactModal(false);
  }
  useEffect(()=>{
    const q=query(collection(db,'users'))
    const unsubscribe=onSnapshot(q,(querySnapshot)=>{
        let messages=[]
        querySnapshot.forEach((doc)=>{
          messages.push({...doc.data(),id: doc.id})
        })
        setMessages(messages)
    })
    return()=>unsubscribe()
  },[]);
  return (
    <div className={styles.contactBackground}>
        <div className={styles.contactConatiner}>
          <div className={styles.contactBox}>
            <div className={styles.navBar}>
              <span>Contacts</span>
              <button type='button' onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className={styles.contactList}>
              {messages && messages.map(message=>(
                <Contacts key={message.id} message={message}/>
              ))}
            </div>
          </div>
        </div>
    </div>
  )
}

export default ContactModal