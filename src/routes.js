import React from 'react'; 
import HomePage from './components/HomePage';
import SearchResults from './components/SearchResults';
import VideoLandingPage from './components/VideoLandingPage';

const routes = [
  { path: '/', element: <HomePage basename={window.__DOCUMENTATION_BASEROUTE__ || ''} /> },
  { path: '/:query', element: <SearchResults basename={window.__DOCUMENTATION_BASEROUTE__ || ''}/> },
  { path: '/videos', element: <VideoLandingPage /> }, 
];

export default routes;
