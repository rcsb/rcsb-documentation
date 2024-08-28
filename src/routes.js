import HomePage from './components/HomePage';
import SearchResults from './components/SearchResults';
import DocumentationPage from './components/DocumentationPage'

const routes = [
  { path: '/', element: <HomePage basename={window.__DOCUMENTATION_BASEROUTE__ || ''} /> },
  { path: '/:query', element: <SearchResults /> },
  { path: '/docs/*', element: <DocumentationPage basename={window.__DOCUMENTATION_BASEROUTE__ || ''} /> },
  { path: '/docs', element: <DocumentationPage basename={window.__DOCUMENTATION_BASEROUTE__ || ''} /> }
];

export default routes;
