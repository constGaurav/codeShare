import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    roomID: '',
  });

  const handleJoinRoom = (e: any) => {
    e.preventDefault();
    const username = loginDetails.username.trim();
    const roomId = loginDetails.roomID.trim();

    if (!username || !roomId) {
      return;
    }

    navigate('/code', { state: { username, roomId } });
    console.log(username, roomId);
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
          />
          <button type='submit' className={styles['loginButton']}>
            Join
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
