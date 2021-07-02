import React from 'react';
import logo from './logo.svg';
import './App.css';
import { PyodideProvider } from './PyodideContext';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PyodideProvider>
          
        </PyodideProvider>
      </header>
    </div>
  );
}

export default App;
