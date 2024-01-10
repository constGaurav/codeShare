import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ESocketActions } from '../../SocketActions';
import { initSocket } from '../../socket';
import { JoinedUsers } from '../JoinedUsers';
import styles from './styles.module.css';
import { IJoinedUsers, IUser } from './types';

const CodeArea = () => {
  const location = useLocation();
  const [users, setUsers] = useState<IUser[]>([]);
  const [code, setCode] = useState('');
  const socketRef = useRef<any>(null);
  const reactNavigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      return;
    }

    const isAlreadyJoined = users.find(
      (user) => user.username === location.state?.username
    );

    const init = async () => {
      if (isAlreadyJoined) {
        return;
      }

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

      // When a you join
      socketRef.current.emit(ESocketActions.JOIN, {
        roomId: location.state?.roomId,
        username: location.state?.username,
      });

      // When Other users join
      socketRef.current.on(
        ESocketActions.JOINED,
        ({ username, users, socketId }: IJoinedUsers) => {
          // Notify other users that one new user has joined
          if (location.state?.username !== username) {
            console.log(`User ${username} has joined`);
            toast.success(`${username} has joined the room`);
          }
          setUsers(users);

          // Emit for Syncing code for new users
          socketRef.current.emit(ESocketActions.CODE_SYNC, {
            socketId,
            code,
          });
        }
      );

      // Handle on change of code
      socketRef.current.on(ESocketActions.ON_CODE_CHANGE, ({ code }: any) => {
        if (code !== null) {
          setCode(code);
        }
      });

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

    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ESocketActions.JOINED).disconnect();
      socketRef.current.off(ESocketActions.ON_CODE_CHANGE).disconnect();
      socketRef.current.off(ESocketActions.DISCONNECTED).disconnect();
    };
  }, []);

  const handleCodeOnChange = (e: any) => {
    setCode(e.target.value);
    socketRef.current.emit(ESocketActions.ON_CODE_CHANGE, {
      roomId: location.state.roomId,
      username: location.state.username,
      code: e.target.value,
    });
  };

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
    <>
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
      <div className={styles['codeEditor']}>
        <textarea
          className={styles['codeArea']}
          value={code}
          onChange={handleCodeOnChange}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
        />
      </div>
    </>
  );
};

export default CodeArea;
