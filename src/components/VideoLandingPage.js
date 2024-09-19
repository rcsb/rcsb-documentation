import React, { useState } from 'react';
import videoPanels from '../videoData.json';
import './VideoLandingPage.css';
import HelpMenu from './HelpMenu';

const VideoLandingPage = ({ basename }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleCloseVideo = () => setSelectedVideo(null);

  return (
    <div className="container my-4 video-landing-page">
      {/* Title and HelpMenu Section */}
      <div className="row mb-4 align-items-center video-tutorials-header">
        <div className="col-lg-9 col-md-9 col-sm-12">
          <h2 className="text-left">Video Tutorials</h2>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12">
          <HelpMenu basename={basename} />
        </div>
      </div>

      {/* Video Panels Section */}
      {videoPanels.map((panel, panelIndex) => {
        const [showAll, setShowAll] = useState(false);
        const displayedVideos = showAll ? panel.videos : panel.videos.slice(0, 5); // Display 5 videos per row

        return (
          <div key={panelIndex} className="video-section mb-4" id={panel.topic}>
            <div className="row mb-3 align-items-center video-panel-header">
              <div className="col-md-8">
                <h3 className="video-section-title">{panel.title}</h3>
              </div>
              {panel.videos.length > 5 && (
                <div className="col-md-4 text-right">
                  <button className="video-show-all-btn" onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Show Less' : 'Show All'}
                  </button>
                </div>
              )}
            </div>

            <div className="row">
              {displayedVideos.map((video, videoIndex) => (
                <div key={videoIndex} className="col-lg-2 col-md-4 col-sm-6 col-xs-12 video-item">
                  <div className="video-thumbnail-container" onClick={() => setSelectedVideo(video)}>
                    <img src={video.image} alt={video.title} className="video-thumbnail img-responsive" />
                    <div className="video-duration">{video.duration}</div>
                  </div>
                  <div className="video-metadata">
                    <p className="video-title">{video.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add horizontal line between sections except after the last section */}
            {panelIndex < videoPanels.length - 1 && <hr className="video-divider" />}
          </div>
        );
      })}

      {selectedVideo && (
        <div className="video-overlay" onClick={handleCloseVideo}>
          <div className="video-player-container">
            <div className="embed-responsive embed-responsive-16by9">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                title={selectedVideo.title}
                className="embed-responsive-item"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <button className="video-close-btn" onClick={handleCloseVideo}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLandingPage;
