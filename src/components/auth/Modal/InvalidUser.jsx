import React from 'react'
import styles from '../../modal/Modal.module.css'
import Close from "../../icons/close.png";
import invalidUserIcon from "../../icons/invalidUser.jpg";
const InvalidUser = (props) => {
    const closeInvalidUser=()=>{
        props.user(false);
    };
  return (
    <>
        <button type='button' onClick={closeInvalidUser}><img className={styles.close} src={Close} alt="close"/></button>
        <div className={styles.messageBox}>
          <img className={styles.icon} src={invalidUserIcon} alt="invalid user icon" />
          <div className={styles.title}>
            <p className={styles.p1}>Invalid Email or Password !!!</p>
            <p className={styles.p2}>Please check your email and password</p>
          </div>
        </div>
    </>
  )
}

export default InvalidUser