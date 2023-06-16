import React from 'react'
import styles from '../../modal/Modal.module.css'
import invalidUserIcon from "../../icons/invalidUser.jpg";
import Close from "../../icons/close.png";
const DuplicateEmail = (props) => {
    const resetTakenModal=()=>{
        props.resetTaken(false);
    };
  return (
    <>
        <button type='button' onClick={resetTakenModal}><img className={styles.close} src={Close} alt="close"/></button>
        <div className={styles.messageBox}>
          <img className={styles.icon} src={invalidUserIcon} alt="email not verified icon" />
          <div className={styles.title}>
            <p className={styles.p1}>Email already taken</p>
            <p className={styles.p2}>Multiple accounts cannot be <br/> created with same Email Id</p>
          </div>
        </div>
    </>
  )
}

export default DuplicateEmail