import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import CodeArea from './components/CodeArea';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position='top-center' />
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/code' element={<CodeArea />} />
      </Routes>
    </>
  );
}

export default App;
