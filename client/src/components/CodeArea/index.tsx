import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import { ESocketActions } from '../../SocketActions';
import { useLocation, Navigate } from 'react-router-dom';
import { initSocket } from '../../socket';

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
      // TODO: Handle socket errors, connect_error, connect_failed

      // When a you join
      socketRef.current.emit(ESocketActions.JOIN, {
        roomId: location.state?.roomId,
        username: location.state?.username,
      });

      // When Other users join
      socketRef.current.on(
        ESocketActions.JOINED,
        ({ username, users }: IJoinedUsers) => {
          // Notify other users that one new user has joined
          if (location.state?.username !== username) {
            console.log(`User ${username} has joined`);
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
          setUsers((users) => {
            return users.filter((user) => user.socketId !== socketId);
          });
        }
      );
    };

    init();
  }, []);

  const handleCodeOnChange = (e: any) => {
    setCode(e.target.value);
    // socketRef.current.emit(ESocketActions.ON_CODE_CHANGE, {
    //   roomId: location.state.roomId,
    //   username: location.state.username,
    //   code: e.target.value,
    // });
  };

  if (!location.state) {
    return <Navigate to={'/'} />;
  }

  return (
    <div>
      <JoinedUsers users={users} />
      <div className={styles['codeEditor']}>
        <textarea
          className={styles['codeArea']}
          value={code}
          onChange={handleCodeOnChange}
        />
      </div>
    </div>
  );
};

export default CodeArea;
