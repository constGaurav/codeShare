import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import { ESocketActions } from '../../SocketActions';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { initSocket } from '../../socket';
import toast from 'react-hot-toast';

interface IUser {
  username: string;
  socketId: string;
}

interface IJoinedUsers {
  users: IUser[];
  username: string;
  socketId: string;
}

const JoinedUsers = ({ users }: { users: IUser[] }) => {
  return (
    <div className={styles['joinedUsers']}>
      <div style={{ fontWeight: 'bold' }}>Live Users: {users.length} </div>
      {users.map((user) => {
        return (
          <div key={user.socketId} className={styles['userList']}>
            {user.username}
          </div>
        );
      })}
    </div>
  );
};

const CodeArea = () => {
  const location = useLocation();
  const [users, setUsers] = useState<IUser[]>([]);
  const [code, setCode] = useState('');
  const socketRef = useRef<any>(null);
  const navigator = useNavigate();

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
        navigator('/');
      });

      socketRef.current.on('connect_failed', (error: { message: any }) => {
        console.log('Gaurav bhai, Connection Failed:', error.message);
        toast.error('Connection Failed, Please try again!');
        navigator('/');
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

  if (!location.state) {
    return <Navigate to={'/'} />;
  }

  return (
    <div>
      <div className={styles['header']}>
        <JoinedUsers users={users} />
        <button className={styles['leaveBtn']} onClick={() => navigator('/')}>
          Leave
        </button>
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
    </div>
  );
};

export default CodeArea;
