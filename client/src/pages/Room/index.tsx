import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ESocketActions } from '../../SocketActions';
import { CodeArea, VideoRoom } from '../../components';
import { initSocket } from '../../socket';
import { JoinedUsers } from './JoinedUsers';
import styles from './styles.module.css';
import { IJoinedUsers, IUser } from './types';

const Room = () => {
  const location = useLocation();
  const reactNavigate = useNavigate();
  const socketRef = useRef<any>(null);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (!location.state) {
      return;
    }

    const initSocketConnection = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on('connect_error', (error: { message: any }) => {
        console.log('Gaurav bhai, Connection Error hai:', error.message);
        toast.error('Connection Error, Please try again!');
        reactNavigate('/');
      });

      socketRef.current.on('connect_failed', (error: { message: any }) => {
        console.log('Gaurav bhai, Connection Failed:', error.message);
        toast.error('Connection Failed, Please try again!');
        reactNavigate('/');
      });

      // When you Join a room
      socketRef.current.emit(ESocketActions.JOIN, {
        roomId: location.state?.roomId,
        username: location.state?.username,
      });

      // When Others Join the room
      socketRef.current.on(
        ESocketActions.JOINED,
        ({ username, users }: IJoinedUsers) => {
          // Notify other users that one new user has joined
          if (location.state?.username !== username) {
            console.log(`User ${username} has joined`);
            toast.success(`${username} has joined the room`);
          }
          setUsers(users);
        }
      );

      // On Disconnection
      socketRef.current.on(
        ESocketActions.DISCONNECTED,
        ({ username, socketId }: any) => {
          // Notify other users that one user has left
          console.log(`User ${username} has left`);
          toast.error(`${username} has left the room`);
          setUsers((users) => {
            return users.filter((user) => user.socketId !== socketId);
          });
        }
      );
    };

    // Initiate the socket connection
    initSocketConnection();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ESocketActions.JOINED).disconnect();
      socketRef.current.off(ESocketActions.DISCONNECTED).disconnect();
    };
  }, []);

  const handleRoomIDCopy = async () => {
    try {
      await navigator.clipboard.writeText(location.state.roomId);
      toast.success('Copied RoomID');
    } catch (error) {
      toast.error('Could not copy RoomID');
    }
  };

  if (!location.state) {
    return <Navigate to={'/'} />;
  }

  return (
    <div>
      <div className={styles['header']}>
        <JoinedUsers users={users} />
        <div className={styles['headerBtns']}>
          <button
            className={styles['copyRoomIdBtn']}
            onClick={handleRoomIDCopy}
          >
            Copy Room ID
          </button>
          <button
            className={styles['leaveBtn']}
            onClick={() => reactNavigate('/')}
          >
            Leave
          </button>
        </div>
      </div>
      <div className={styles['container']}>
        <div className={styles['codeArea']}>
          <CodeArea socketRef={socketRef} />
        </div>
        <VideoRoom />
      </div>
    </div>
  );
};

export default Room;
