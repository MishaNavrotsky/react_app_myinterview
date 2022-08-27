import React, { useEffect } from 'react';
import logo from './logo.svg';
import { search } from './api/giphy'
import './App.css';
import { ImageScroller } from './features/imageScroller/ImageScroller';

function App() {
  return (
    <div className="App">
      <ImageScroller />
    </div>
  );
}

export default App;
