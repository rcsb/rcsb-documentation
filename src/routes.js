import HomePage from './components/HomePage';
import SearchResults from './components/SearchResults';
import DocumentationPage from './components/DocumentationPage'

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/:query', element: <SearchResults /> },
  { path: '/docs/:docId', element: <DocumentationPage /> },
  { path: '/docs', element: <DocumentationPage /> },
];

export default routes;
