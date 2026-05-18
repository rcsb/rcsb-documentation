import React from 'react';
import SearchBar from './SearchBar';
import HelpTopicCards from './HelpTopicCards';
import HelpMenu from './HelpMenu';
import './HomePage.css';

const HomePage = ({ basename }) => {
  return (
    <div className="help-homepage">
      <div className="row">
        <div className="col-lg-9 col-md-9 col-sm-12">
          <h1 className="help-homepage__title">RCSB PDB Help</h1>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12 help-homepage__top-links">
          <HelpMenu basename={basename} />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-lg-12">
          <div className="doc-search-bar-background">
            <SearchBar />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <HelpTopicCards />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
