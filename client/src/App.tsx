import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import Room from './pages/Room';
import RoomLandingPage from './pages/RoomLandingPage';

function App() {
  return (
    <>
      <Toaster position='top-center' />
      <Routes>
        <Route path='/' element={<RoomLandingPage />} />
        <Route path='/room' element={<Room />} />
      </Routes>
    </>
  );
}

export default App;
