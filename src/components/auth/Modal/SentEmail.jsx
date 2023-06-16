import React from 'react'
import styles from '../../modal/Modal.module.css';
import Close from "../../icons/close.png";
import Email from "../../icons/email.jpg";

import { useNavigate } from 'react-router-dom';
const SentEmail = (props) => {
  const navigate=useNavigate();
  const handleReset=()=>{
    props.reset();
    props.resetModal();
    navigate("/login");
  };
  return (
      <>
        <button type='button' onClick={handleReset}><img className={styles.close} src={Close} alt="close"/></button>
        <div className={styles.messageBox}>
          <img className={styles.icon} src={Email} alt="email icon" />
          <div className={styles.title}>
            <p className={styles.p1}>Verification email sent !!!</p>
            <p className={styles.p2}>A verification email is sent to :<br/>{props.email}</p>
          </div>
        </div>
      </>          
  )
}

export default SentEmail