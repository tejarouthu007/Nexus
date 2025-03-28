import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from './context/SocketProvider';
import Home from './pages/Home';
import Editor from './pages/Editor';

function App() {

  return (
    <div >
      <SocketProvider>
        <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<Editor />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </SocketProvider>
    </div>
  )
}

export default App;
