import React, { useState } from 'react';
import videoPanels from '../videoData.json'; 
import './VideoLandingPage.css'; 

const VideoLandingPage = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleCloseVideo = () => setSelectedVideo(null);

  return (
    <div className="video-landing-page">
      {videoPanels.map((panel, panelIndex) => {
        const [showAll, setShowAll] = useState(false);
        const displayedVideos = showAll ? panel.videos : panel.videos.slice(0, 4);

        return (
          <div key={panelIndex} className="video-section" id={panel.topic}> 
            <div className="row">
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
                    className="video-thumbnail"
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
          <div className="video-player">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.id}`}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              width="800"
            ></iframe>
            <button className="btn btn-link close-video-btn" onClick={handleCloseVideo}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLandingPage;
