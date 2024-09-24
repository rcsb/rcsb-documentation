import React from 'react'; 
import HomePage from './components/HomePage';
import SearchResults from './components/SearchResults';
import VideoLandingPage from './components/VideoLandingPage';

const basename = window.__DOCUMENTATION_BASEROUTE__ || '';

const routes = [
  { path: '/', element: <HomePage basename={basename} /> },
  { path: '/:query', element: <SearchResults basename={basename}/> },
  { path: '/videos', element: <VideoLandingPage basename={basename}/> }, 
];

export default routes;
