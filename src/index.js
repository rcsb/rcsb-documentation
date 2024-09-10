import React from 'react'; 
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';
import ErrorBoundary from './components/ErrorBoundary';

// Import the API functions from docsApi.js
// import {
//   fetchLastUpdated,
//   fetchIndex,
//   fetchItem,
//   processItem,
//   getEnv,
//   initializeIndex,
//   getItem,
//   getFirstItemHref,
//   setIndex,
//   rootToIndex,
//   getIndexObj,
//   getMenuPath,
//   returnData,
//   getMenuObj,
//   setParentGroupState,
// } from './api/docsApi';

const NotFound = () => (
  <div>
    Oops, looks like this page is not exist. Try going back to the homepage.
  </div>
);

const AppContent = () => {
  return (
    <main className="doc-container mt-5">
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

//Set the global variable for basename
const basename =window.__DOCUMENTATION_BASEROUTE__ || '';
const App = () => {
  return (
    <ErrorBoundary>
      <Router basename={basename}>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App basename={basename} />
  </React.StrictMode>
);

// Export the API functions for external use
// export {
//   fetchLastUpdated,
//   fetchIndex,
//   fetchItem,
//   processItem,
//   getEnv,
//   initializeIndex,
//   getItem,
//   getFirstItemHref,
//   setIndex,
//   rootToIndex,
//   getIndexObj,
//   getMenuPath,
//   returnData,
//   getMenuObj,
//   setParentGroupState,
// };