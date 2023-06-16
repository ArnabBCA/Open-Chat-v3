import React from 'react'
import styles from './Spiner.module.css';
const Spiner = () => {
  return (
    <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
    </div>
  )
}

export default Spiner