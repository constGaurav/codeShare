import styles from './styles.module.css';
import { IUser } from './types';

export const JoinedUsers = ({ users }: { users: IUser[] }) => {
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
