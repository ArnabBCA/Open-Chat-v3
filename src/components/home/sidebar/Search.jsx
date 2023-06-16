import React, { useContext, useState } from 'react'
import styles from './Search.module.scss';
import { db } from '../../../firebase';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import {AuthContext} from "../../../context/AuthContext";
const Search = () => {
  const {currentUser}=useContext(AuthContext);
  const [userName,setUserName]=useState('');
  const [user,setUser]=useState(null);
  const [error,setError]=useState(false);

  const handleSearch=async()=>{
    const q=query(collection(db,"users"),where("displayName","==",userName));
    const querySnapshot=await getDocs(q);
    if(querySnapshot.empty)
    {
      setError(true);
      return;
    }
    else{
      setError(false);
    }
    querySnapshot.forEach((doc)=>{
      setUser(doc.data());
    });
  }
  const handleKey=e=>{
    e.code==="Enter" && handleSearch();
  }
  const handleSelect=async()=>{
    const combinedId=currentUser.uid > user.uid ? currentUser.uid+user.uid : user.uid+currentUser.uid;
    try{
      const res=await getDoc(doc(db,"chats",combinedId));
      if(!res.exists()){
        await setDoc(doc(db,"chats",combinedId),{messages:[]});
        await updateDoc(doc(db,"userChats",currentUser.uid),{
          [combinedId+".userInfo"]:{
            uid:user.uid,
            displayName:user.displayName,
            photoURL:user.photoURL,
          },
          [combinedId+".date"]:serverTimestamp()
        });
        await updateDoc(doc(db,"userChats",user.uid),{
          [combinedId+".userInfo"]:{
            uid:currentUser.uid,
            displayName:currentUser.displayName,
            photoURL:currentUser.photoURL,
          },
          [combinedId+".date"]:serverTimestamp()
        });
      }
    }catch(error){}
    setUser(null);
    setUserName('');
  }
  return (
    <div className={styles.search}>
        {error && <span>User not Found</span>}
        <div className={styles.searchForm}>
            <input type="text" placeholder='Search User' onKeyDown={handleKey} onChange={e=>setUserName(e.target.value)} value={userName}/>
            <button type ="submit">
                <i className="fa fa-search"></i>
            </button>
        </div>
        {user&&<div className={styles.userChats} onClick={handleSelect}>
            <img referrerPolicy='no-referrer' src={user.photoURL} alt="search" />
            <div className={styles.userChatsInfo}>
                <span>{user.displayName}</span>
            </div>
        </div>}
    </div>
  )
}

export default Search