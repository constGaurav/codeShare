import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import CodeArea from './components/CodeArea';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/code' element={<CodeArea />} />
    </Routes>
  );
}

export default App;
