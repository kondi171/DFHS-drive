import React from 'react';
import ReactDOM from 'react-dom/client';
import DFHS from './components/DFHS';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <DFHS />
    </Router>
  </React.StrictMode>
);