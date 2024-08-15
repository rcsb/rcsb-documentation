import HomePage from './components/HomePage';
import SearchResults from './components/SearchResults';

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/:query', element: <SearchResults /> },
];

export default routes;
