import React from 'react';
import './ResourcesAndVideos.css' 

const ResourcesAndVideos = () => {
  return (
    <div className="resources-and-videos-container">
      {/* Deposition Resources Panel */}
      <div className="panel panel-default">
        <div className="panel-heading-gray">
          <div className="row">
            <div className="col-md-8 col-sm-10 col-xs-10">
              <h3 className="panel-title">Deposition Resources</h3>
            </div>
            <div className="col-md-4 col-sm-2 col-xs-2">
              <img
                src="https://cdn.rcsb.org/rcsb-pdb/v2/common/images/wwpdb-truncated.png"
                className="img-responsive"
                alt="Deposition Resources Icon"
              />
            </div>
          </div>
        </div>
        <div className="panel-body">
          <p><a href="">Deposit Experimental Structures</a></p>
          <p><a href="">Deposit Integrative Models</a></p>
        </div>
      </div>

      {/* Learning Resources Panel */}
      <div className="panel panel-default">
        <div className="panel-heading-gray">
          <div className="row">
            <div className="col-md-8 col-sm-10 col-xs-10">
              <h3 className="panel-title">Learning Resources</h3>
            </div>
            <div className="col-md-4 col-sm-2 col-xs-2">
              <img
                src="https://cdn.rcsb.org/rcsb-pdb/v2/common/images/pdb101-truncated.png"
                className="img-responsive"
                alt="Learning Resources Icon"
              />
            </div>
          </div>
        </div>
        <div className="panel-body">
          <p><a href="">Guide to PDB Data</a></p>
          <p><a href="">Biological Assemblies</a></p>
          <p><a href="">Small Molecule Ligands</a></p>
          <p><a href="">RCSB PDB APIs</a></p>
          <p><a href="">Training Courses</a></p>
        </div>
      </div>

      {/* Video Tutorials Panel */}
      <div className="panel panel-default">
        <div className="panel-heading-gray">
          <div className="row">
            <div className="col-md-8 col-sm-10 col-xs-10">
              <h3 className="panel-title">Video Tutorials</h3>
            </div>
            <div className="col-md-4 col-sm-2 col-xs-2 text-right">
              <i className="fa fa-video-camera fa-lg" style={{ color: '#325880' }} aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div className="panel-body">
          <p><a href="">Search and Browse</a></p>
          <p><a href="">Visualize 3D Structures</a></p>
          <p><a href="">Analyze 3D Structural Data</a></p>
          <p><a href="">APIs</a></p>
        </div>
      </div>
    </div>
  );
};

export default ResourcesAndVideos;
