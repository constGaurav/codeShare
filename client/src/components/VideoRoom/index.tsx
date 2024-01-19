import styles from './styles.module.css';

const VideoRoom = () => {
  return (
    <div className={styles['container']}>
      <div className={styles['otherPersonsVideo']}>
        <div className={styles['videoPlayer']}>V2</div>
        <div className={styles['name']}>Simran Mishra</div>
      </div>
      <div className={styles['myVideo']}>
        <div className={styles['videoPlayer']}>V1</div>
        <div className={styles['name']}>Gaurav Chaudhary (You)</div>
      </div>
    </div>
  );
};

export default VideoRoom;
