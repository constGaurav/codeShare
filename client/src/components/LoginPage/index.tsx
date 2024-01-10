import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { v4 as uuidv4 } from 'uuid';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    roomID: '',
  });

  const handleNewRoom = (e: any) => {
    e.preventDefault();
    const roomId = uuidv4();
    setLoginDetails({ ...loginDetails, roomID: roomId });
  };

  const handleJoinRoom = (e: any) => {
    e.preventDefault();
    const username = loginDetails.username.trim();
    const roomId = loginDetails.roomID.trim();

    if (!username || !roomId) {
      return;
    }

    navigate('/code', { state: { username, roomId } });
  };

  return (
    <>
      <div className={styles['container']}>
        <form onSubmit={handleJoinRoom} className={styles['loginForm']}>
          <h1 className={styles['loginHeading']}>Join Room</h1>
          <input
            type='text'
            placeholder='Username'
            value={loginDetails.username}
            onChange={(e) =>
              setLoginDetails({ ...loginDetails, username: e.target.value })
            }
            required
          />
          <input
            type='password'
            placeholder='Room ID'
            value={loginDetails.roomID}
            onChange={(e) => {
              setLoginDetails({
                ...loginDetails,
                roomID: e.target.value.trim(),
              });
            }}
            required
          />
          <button type='submit' className={styles['loginButton']}>
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

export default LoginPage;
