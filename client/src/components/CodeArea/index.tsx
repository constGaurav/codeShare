import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ESocketActions } from '../../SocketActions';
import styles from './styles.module.css';

const CodeArea = ({ socketRef }: { socketRef: any }) => {
  const location = useLocation();
  const [code, setCode] = useState('');

  useEffect(() => {
    if (!socketRef.current) {
      return;
    }

    // Handle on change of code
    socketRef.current.on(ESocketActions.ON_CODE_CHANGE, ({ code }: any) => {
      if (code !== null) {
        setCode(code);
      }
    });

    return () => {
      socketRef.current.off(ESocketActions.ON_CODE_CHANGE).disconnect();
    };
  }, [socketRef.current]);

  const handleCodeOnChange = (e: any) => {
    setCode(e.target.value);
    socketRef.current.emit(ESocketActions.ON_CODE_CHANGE, {
      roomId: location.state.roomId,
      username: location.state.username,
      code: e.target.value,
    });
  };

  return (
    <div className={styles['codeEditor']}>
      <textarea
        className={styles['codeArea']}
        value={code}
        onChange={handleCodeOnChange}
      />
    </div>
  );
};

export default CodeArea;
