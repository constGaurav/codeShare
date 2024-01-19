import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import styles from './styles.module.css';

const RoomLandingPage = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: '',
    roomID: '',
  });

  const handleNewRoom = (e: any) => {
    e.preventDefault();
    const roomId = uuidv4();
    setUserDetails({ ...userDetails, roomID: roomId });
  };

  const handleJoinRoom = (e: any) => {
    e.preventDefault();
    const username = userDetails.username.trim();
    const roomId = userDetails.roomID.trim();

    if (!username || !roomId) {
      return;
    }

    navigate('/code', { state: { username, roomId } });
  };

  return (
    <>
      <div className={styles['container']}>
        <form onSubmit={handleJoinRoom} className={styles['joiningRoomForm']}>
          <h1 className={styles['joinRoomHeading']}>Join Room</h1>
          <input
            type='text'
            placeholder='Username'
            value={userDetails.username}
            onChange={(e) =>
              setUserDetails({ ...userDetails, username: e.target.value })
            }
            required
          />
          <input
            type='password'
            placeholder='Room ID'
            value={userDetails.roomID}
            onChange={(e) => {
              setUserDetails({
                ...userDetails,
                roomID: e.target.value.trim(),
              });
            }}
            required
          />
          <button type='submit' className={styles['joiningRoomButton']}>
            Join
          </button>

          <div className={styles['newRoom']}>
            New Room? <button onClick={handleNewRoom}>Create Room</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RoomLandingPage;
