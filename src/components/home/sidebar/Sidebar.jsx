import React from 'react'
import Chats from './Chats';
import Navbar from './Navbar';
import Search from './Search';
import styles from './Sidebar.module.scss';
import Footer from './Footer';
const Sidebar = (props) => {
  return (
    <>
    <div className={styles.sidebar}>
        <Navbar/>
        <Search/>
        <Chats hide={props.hide} setWelcomeScreen={props.setWelcomeScreen} setGroupChatActive={props.setGroupChatActive} groupChatActive={props.groupChatActive} setMessages={props.setMessages}/>
        <Footer contactModal={props.contactModal}/>
    </div>
    </>
  )
}

export default Sidebar