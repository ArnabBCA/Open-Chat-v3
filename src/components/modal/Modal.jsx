import React from 'react'
import styles from './Modal.module.css';
const Modal = (props) => {
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        {props.children}
      </div>
    </div>
  )
}

export default Modal