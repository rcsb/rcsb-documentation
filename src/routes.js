import HomePage from './components/HomePage';
import SearchResults from './components/SearchResults';

const routes = [
  { path: '/', element: <HomePage basename={window.__DOCUMENTATION_BASEROUTE__ || ''} /> },
  { path: '/:query', element: <SearchResults /> }
];

export default routes;
