

import styles from "./style/Message.module.css"

export default function MessageComponent() {


  return (
    <>
          <ul>
            <li  className={styles.me} >
                <div className={styles.entete}>
                    {/* <span className="status green"></span> */}
                    {/* <h2>name</h2> */}
                    {/* <h3>2-2-2021</h3> */}
                </div>
                <div className={styles.triangle}></div>
                <div className={styles.message}>dsdsdsdsdsdsds</div>
            </li>
            <li  className={styles.you} >
                <div className={styles.entete}>
                    {/* <span className="status green"></span> */}
                    {/* <h2>name</h2> */}
                    {/* <h3>2-2-2021</h3> */}
                </div>
                <div className={styles.triangle}></div>
                <div className={styles.message}>dsdsdsdsdsdsds</div>
            </li>
          </ul>
    </>
  )
}
