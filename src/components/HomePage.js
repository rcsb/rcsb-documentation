import React from 'react';
import SearchBar from './SearchBar';
import Resources from './Resources';
import ResourcesAndVideos from './ResourcesAndVideos';
import HelpMenu from './HelpMenu';
import data from '../resourcesData.json'; // Import the JSON data
// import './HomePage.css'; // Custom styles for the homepage

const HomePage = ( {basename} ) => {
  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-lg-9 col-md-9 col-sm-12">
          <h1 className="text-left mb-3">RCSB PDB Help</h1>
          <SearchBar />
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <HelpMenu basename={basename}/>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-9 col-md-9 col-sm-12">
          <Resources data={data} />
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <ResourcesAndVideos />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
