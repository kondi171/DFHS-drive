import React from 'react';
import ReactDOM from 'react-dom/client';
import DFHS from './components/DFHS';
import { BrowserRouter as Router } from 'react-router-dom';
import AppProvider from './components/AppContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider>
      <Router>
        <DFHS />
      </Router>
    </AppProvider>
  </React.StrictMode>
);