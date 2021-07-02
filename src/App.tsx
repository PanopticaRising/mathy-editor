import React from 'react';
import logo from './logo.svg';
import './App.css';
import { PyodideProvider, PyodideContext } from './PyodideContext';
import { Form } from './Mocks/Form';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PyodideProvider>
          <PyodideContext.Consumer>
            {value => <Form pyodide={value}></Form>}
          </PyodideContext.Consumer>
        </PyodideProvider>
      </header>
    </div>
  );
}

export default App;
