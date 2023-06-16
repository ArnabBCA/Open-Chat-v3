import React from 'react'
import styles from './Footer.module.scss';
import contactIcon from '../../icons/addContact.png';
import githubIcon from '../../icons/github.png';
const Footer = (props) => {
  const handleContact=()=>{
    props.contactModal(true);
  }
  return (
    <div className={styles.footer}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <span className={styles.open}>Open</span>
          <span className={styles.chat}>Chat</span>
        </div>
        <span>By Arnab Ghosh</span>
      </div>
      <a href='https://github.com/ArnabBCA/Open-Chat-v3' target="_blank" rel="noopener noreferrer">
        <div className={styles.githubLink}>
            <img className={styles.github} src={githubIcon} alt="Github" />
            <span>Source<br/>Code</span>
        </div>
      </a>
      <img onClick={handleContact} src={contactIcon} alt="contact" />
    </div>
  )
}

export default Footer