import React from 'react'; 
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';
import ErrorBoundary from './components/ErrorBoundary';

const NotFound = () => (
  <div>
    Oops, looks like this page is not exist. Try going back to the homepage.
  </div>
);

const AppContent = () => {
  return (
    <main className="container mt-5">
      <Routes>
        {routes.map((route, index) => (
          <Route 
            key={index} 
            path={route.path} 
            element={route.element} 
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <Router basename="/doc-search">
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

