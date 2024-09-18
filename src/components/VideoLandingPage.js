import React, { useState } from 'react';
import videoPanels from '../videoData.json'; 
import './VideoLandingPage.css'; 
import HelpMenu from './HelpMenu'; 

const VideoLandingPage = ({ basename }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleCloseVideo = () => setSelectedVideo(null);

  return (
    <div className="container my-4 video-landing-page">
        <div className="row mb-4">
            <div className="col-lg-9 col-md-9 col-sm-12">
            <h2 className="text-left">Video Tutorials</h2>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-12">
            <HelpMenu basename={basename} />
            </div>
        </div>

        {videoPanels.map((panel, panelIndex) => {
            const [showAll, setShowAll] = useState(false);
            const displayedVideos = showAll ? panel.videos : panel.videos.slice(0, 4);

        return (
          <div key={panelIndex} className="video-section" id={panel.topic}> 
            <div className="row mb-3">
              <div className="col-md-8">
                <h3>{panel.title}</h3>
              </div>
              {panel.videos.length > 4 && (
                <div className="col-md-4 text-right">
                  <button className="btn btn-link show-all-btn" onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Show Less' : 'Show All'}
                  </button>
                </div>
              )}
            </div>

            <div className="row video-list">
              {displayedVideos.map((video, videoIndex) => (
                <div key={videoIndex} className="col-lg-3 col-md-4 col-sm-6 col-xs-12 video-item">
                  <img
                    src={video.image}
                    alt={video.title}
                    className="video-thumbnail img-responsive"
                    onClick={() => setSelectedVideo(video)}
                  />
                  <p>{video.title}</p>
                </div>
              ))}
            </div>
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
            <button className="btn btn-link close-video-btn" onClick={handleCloseVideo}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLandingPage;
