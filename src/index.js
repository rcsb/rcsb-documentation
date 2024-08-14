import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchResults from './components/SearchResults';
import HomePage from './components/HomePage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/doc-search" element={<HomePage />} />
      <Route path="/doc-search/:query" element={<SearchResults />} />
    </Routes>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

