import React from 'react'
import styles from './Modal.module.css'
import ErrorIcon from "../icons/error.png";
import Close from "../icons/close.png";
const Error = (props) => {
    const closeModal=()=>{
      props.error(false);
      props.resetMessage('');
    };
  return (
    <>
        <button type='button' onClick={closeModal}><img className={styles.close} src={Close} alt="close"/></button>
        <div className={styles.messageBox}>
          <img className={styles.icon} src={ErrorIcon} alt="error icon" />
          <div className={styles.title}>
            <p className={styles.p1}>Opps !!!<br/>Something went wrong</p>
            <p className={styles.p2}>{props.message}</p>
          </div>
        </div>
    </>
  )
}

export default Error