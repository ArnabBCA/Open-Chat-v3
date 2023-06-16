import React from 'react'
import styles from '../../modal/Modal.module.css'
import Close from "../../icons/close.png";
import invalidEmailIcon from "../../icons/invalidEmail.jpg";
const EmailNotVerified = (props) => {
    const closeModal=()=>{
        props.verify(false);
    };
  return (
    <>
        <button type='button' onClick={closeModal}><img className={styles.close} src={Close} alt="close"/></button>
        <div className={styles.messageBox}>
          <img className={styles.icon} src={invalidEmailIcon} alt="email not verified icon" />
          <div className={styles.title}>
            <p className={styles.p1}>Email not verified !!!</p>
            <p className={styles.p2}>A verification email was sent to :<br/>{props.email}</p>
          </div>
        </div>
    </>
  )
}

export default EmailNotVerified