import React from 'react';
import './App.css';
import { ImageScroller } from './features/imageScroller/ImageScroller';
import { Routes, Route, Link } from 'react-router-dom';
import ImageInfo from './components/ImageInfo';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<ImageScroller />} />
        <Route path="/:imageId" element={<ImageInfo />} />
      </Routes>
    </div>
  );
}

export default App;
