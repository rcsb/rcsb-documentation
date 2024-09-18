import React from 'react'; 
import HomePage from './components/HomePage';
import SearchResults from './components/SearchResults';

const routes = [
  { path: '/', element: <HomePage basename={window.__DOCUMENTATION_BASEROUTE__ || ''} /> },
  { path: '/:query', element: <SearchResults basename={window.__DOCUMENTATION_BASEROUTE__ || ''}/> }
];

export default routes;
