import React from 'react';
import { Link } from 'react-router-dom';
import './ResourcesAndVideos.css'
import videoData from './VideoTutorials/videoData.json';

const ResourcesAndVideos = () => {
  return (
    <div className="resources-and-videos-container">
      {/* Deposition Resources Panel */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">

          <h4 className="panel-title">Deposition Resources</h4>

          <a href="https://www.wwpdb.org/" target="_blank" rel="noopener noreferrer">
            <img
              src="https://cdn.rcsb.org/rcsb-pdb/v2/common/images/wwpdb-truncated.png"
              className="logo-icon"
              alt="Deposition Resources Icon"
            />
          </a>

        </div>
        <div className="card-body">
          <p><a href="https://deposit-2.wwpdb.org/deposition/" target='_blank'>Deposit Experimental Structures</a></p>
          <p><a href="https://data.pdb-ihm.org/" target='_blank'>Deposit Integrative Structures</a></p>
          <p><a href="http://www.wwpdb.org/deposition/tutorial#video-tutorials" target='_blank'>Data Deposition Related Video Tutorials</a></p>
          <p><a href="/#Category-deposit">Other Deposition Resources</a></p>
        </div>
      </div>

      {/* Learning Resources Panel */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">

          <h4 className="panel-title">Learning Resources</h4>


          <a href="https://pdb101.rcsb.org/" target="_blank" rel="noopener noreferrer">
            <img
              src="https://cdn.rcsb.org/rcsb-pdb/v2/common/images/pdb101-truncated.png"
              className="logo-icon"
              alt="Learning Resources Icon"
            />
          </a>


        </div>
        <div className="card-body">
          <p><a href="https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/introduction" target='_blank'>Guide to PDB Data</a></p>
          <p><a href="https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/biological-assemblies" target='_blank'>Biological Assemblies</a></p>
          <p><a href="https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/small-molecule-ligands" target='_blank'>Small Molecule Ligands</a></p>
          <p><a href="https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/introduction-to-rcsb-pdb-apis" target='_blank'>Web APIs</a></p>
          <p><a href="https://pdb101.rcsb.org/train/training-events" target='_blank'>Training Courses</a></p>
        </div>
      </div>

      {/* Video Tutorials Panel */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="panel-title">Video Tutorials</h4>
          <a href="https://www.youtube.com/user/RCSBProteinDataBank" target="_blank" rel="noopener noreferrer">
            <i className="fa-solid fa-video brand-text" aria-hidden="true"></i>
          </a>
        </div>

        {/* TODO should come dynemically from videoData.json */}
        <div className="card-body">
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
