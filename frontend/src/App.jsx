import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from './context/SocketProvider';
import Home from './pages/Home';
import Editor from './pages/Editor';

function App() {

  const [roomId, setRoomId] = useState(() => localStorage.getItem("roomId") || null);
  const [username, setUsername] = useState(() => localStorage.getItem("username") || null);
  
  return (
    <div >
      <SocketProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home roomId={roomId} setRoomId={setRoomId} username={username} setUsername={setUsername}/>} />
          <Route path="/editor" element={<Editor roomId={roomId} username={username} />} />
        </Routes>
        </BrowserRouter>
      </SocketProvider>
    </div>
  )
}

export default App;
