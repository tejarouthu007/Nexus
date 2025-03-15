import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Editor from './pages/Editor';

function App() {

  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<Home />} />
            <Route path="/editor/:roomid" element={<Editor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
