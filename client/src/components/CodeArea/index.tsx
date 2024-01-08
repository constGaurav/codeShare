import { useState } from 'react';
import styles from './styles.module.css';

interface IUsers {
  usernames: string[];
}

const JoinedUsers = ({ usernames }: IUsers) => {
  return (
    <div className={styles['joinedUsers']}>
      <div style={{ fontWeight: 'bold' }}>Live Users: </div>
      {usernames.map((user, index) => {
        return (
          <div key={index + user} className={styles['userList']}>
            {user}
          </div>
        );
      })}
    </div>
  );
};

const CodeArea = () => {
  const [code, setCode] = useState('');
  const usernames = ['User-1', 'User-2', 'User-3', 'User-4', 'User-5'];

  return (
    <div>
      <JoinedUsers usernames={usernames} />
      <div className={styles['codeEditor']}>
        <textarea
          className={styles['codeArea']}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default CodeArea;
