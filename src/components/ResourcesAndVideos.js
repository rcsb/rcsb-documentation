import React from 'react';
import { Link } from 'react-router-dom';
import './ResourcesAndVideos.css' 
import videoData from './VideoTutorials/videoData.json';

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
              <a href="https://www.wwpdb.org/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://cdn.rcsb.org/rcsb-pdb/v2/common/images/wwpdb-truncated.png"
                  className="img-responsive"
                  alt="Deposition Resources Icon"
                />
            </a>
            </div>
          </div>
        </div>
        <div className="panel-body">
          <p><a href="https://deposit-2.wwpdb.org/deposition/" target='_blank'>Deposit Experimental Structures</a></p>
          <p><a href="https://data.pdb-dev.org/" target='_blank'>Deposit Integrative Models</a></p>
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
              <a href="https://pdb101.rcsb.org/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://cdn.rcsb.org/rcsb-pdb/v2/common/images/pdb101-truncated.png"
                  className="img-responsive"
                  alt="Learning Resources Icon"
                />
              </a>  
            </div>
          </div>
        </div>
        <div className="panel-body">
          <p><a href="https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/introduction" target='_blank'>Guide to PDB Data</a></p>
          <p><a href="https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/biological-assemblies" target='_blank'>Biological Assemblies</a></p>
          <p><a href="https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/small-molecule-ligands" target='_blank'>Small Molecule Ligands</a></p>
          <p><a href="https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/introduction-to-rcsb-pdb-apis" target='_blank'>Web APIs</a></p>
          <p><a href="https://pdb101.rcsb.org/train/training-events" target='_blank'>Training Courses</a></p>
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
            <a href="https://www.youtube.com/user/RCSBProteinDataBank" target="_blank" rel="noopener noreferrer">
              <i className="fa fa-video-camera fa-lg" style={{ color: '#325880' }} aria-hidden="true"></i>
            </a>
            </div>
          </div>
        </div>
        {/* TODO should come dynemically from videoData.json */}
        <div className="panel-body">
          {videoData.map(section => (
            <p key={section.topic}>
                <Link to={`/videos#${section.topic}`}>{section.title}</Link>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesAndVideos;
