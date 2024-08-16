import React from 'react';
import SearchBar from './SearchBar';
import Resources from './Resources';
import ResourcesAndVideos from './ResourcesAndVideos';
import HelpMenu from './HelpMenu';
import data from '../resourcesData.json'; // Import the JSON data
// import './HomePage.css'; // Custom styles for the homepage

const HomePage = () => {
  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-lg-8 col-md-8 col-sm-12">
          <h1 className="text-left mb-3">RCSB PDB Help</h1>
          <SearchBar />
          <Resources data={data} />
        </div>
        <div className="col-lg-4 col-md-4 col-sm-12">
          <HelpMenu />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
