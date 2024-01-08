import { useState } from 'react';
import styles from './styles.module.css';

const CodeArea = () => {
  const [code, setCode] = useState('');
  const usernames = ['User-1', 'User-2', 'User-3', 'User-4', 'User-5'];

  return (
    <div>
      <div className={styles['joinedUsers']}>
        {usernames.map((user, index) => {
          return (
            <div key={index + user} className={styles['userList']}>
              {user}
            </div>
          );
        })}
      </div>
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
