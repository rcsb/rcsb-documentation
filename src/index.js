import React from 'react';
import ReactDOM from 'react-dom/client';
import Documentation from './components/Documentation';
import './index.css';

// Sample data, replace with actual data or props
const groupMap = {};
const menu = [];
const item = {};
// Create a root container and render your application into it
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Documentation groupMap={groupMap} menu={menu} item={item} />
  </React.StrictMode>
);
