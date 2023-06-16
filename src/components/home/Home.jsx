import React, {useState}  from 'react'
import Chat from './chat/Chat';
import styles from './Home.module.scss';
import Sidebar from './sidebar/Sidebar';
import ContactModal from './contact/ContactModal';
const Home = () => {
  const [visible,setVisible]=useState(false);
  const [welcomeScreen,setWelcomeScreen]=useState(true);
  const [conatct,setContact]=useState(false);
  const [groupChatActive,setGroupChatActive]=useState(false);
  const [messages,setMessages]=useState([]);
  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <Sidebar visible={visible} hide={setVisible} setWelcomeScreen={setWelcomeScreen} contactModal={setContact} setGroupChatActive={setGroupChatActive} groupChatActive={groupChatActive} setMessages={setMessages}/>
        {<Chat visible={visible} welcomeScreen={welcomeScreen} hide={setVisible} groupChatActive={groupChatActive} messages={messages} setMessages={setMessages}/>}
        {conatct && <ContactModal contactModal={setContact}/>}
      </div>
    </div>
  )
}

export default Home