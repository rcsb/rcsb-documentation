import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import videoPanels from './videoData.json';
import './VideoLandingPage.css';
import HelpMenu from '../HelpMenu';

const CustomPrevArrow = ({ onClick }) => (
  <button className="custom-prev" onClick={onClick}>
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button className="custom-next" onClick={onClick}>
  </button>
);

const VideoLandingPage = ({ basename }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleVideos, setVisibleVideos] = useState({}); // To store visible videos count dynamically based on screen size
  const [scrollPositions, setScrollPositions] = useState({}); // Track scroll position for each panel
  const location = useLocation();

  const handleCloseVideo = () => setSelectedVideo(null);

  // Handle manual scrolling for video panels
  const handleScroll = (panelId, direction) => {
    const container = document.getElementById(panelId);
    const scrollAmount = container.offsetWidth;
    const newScrollPosition = direction === 'next'
      ? container.scrollLeft + scrollAmount
      : container.scrollLeft - scrollAmount;

    container.scrollLeft = newScrollPosition;

    // Update scroll position state
    setScrollPositions((prev) => ({
      ...prev,
      [panelId]: newScrollPosition,
    }));
  };

  // Calculate the number of visible videos based on screen size
  useEffect(() => {
    const calculateVisibleVideos = () => {
      const visible = {};
      const scrollPos = {};
      const videoWidth = 240; // Assuming each video takes up 240px width
      videoPanels.forEach((_, index) => {
        const container = document.getElementById(`panel-${index}`);
        if (container) {
          const containerWidth = container.offsetWidth;
          visible[`panel-${index}`] = Math.floor(containerWidth / videoWidth); // Calculate how many videos fit in the available width
          scrollPos[`panel-${index}`] = 0; // Initialize scroll position to 0
        }
      });
      setVisibleVideos(visible);
      setScrollPositions(scrollPos);
    };

    calculateVisibleVideos();
    window.addEventListener('resize', calculateVisibleVideos);
    return () => window.removeEventListener('resize', calculateVisibleVideos);
  }, []);

  // Scroll to the specific section if a hash is present in the URL
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

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
        const panelId = `panel-${panelIndex}`;
        const videosVisible = visibleVideos[panelId] || 0;
        const showArrows = panel.videos.length > videosVisible; // Show arrows if there are more videos than visible ones
        const isScrolled = scrollPositions[panelId] > 0; // Check if the user has scrolled

        return (
          <div key={panelIndex} className="video-section mb-4" id={panel.topic}>
            <div className="row mb-3 align-items-center video-panel-header">
              <div className="col-sm-12">
                <h3 className="video-section-title">{panel.title}</h3>
              </div>
            </div>

            <div className="video-panel-container">
              {showArrows && isScrolled && (
                <CustomPrevArrow onClick={() => handleScroll(panelId, 'prev')} />
              )}

              <div className="video-panel row" id={panelId}>
                {panel.videos.map((video, videoIndex) => (
                  <div key={videoIndex} className="col-xs-12 col-sm-6 col-md-3 video-item">
                    <div
                      className="video-thumbnail-container"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <img
                        src={video.image}
                        alt={video.title}
                        className="video-thumbnail img-responsive"
                      />
                    </div>
                    <div className="video-metadata">
                      <p className="video-title">{video.title}</p>
                    </div>
                  </div>
                ))}
              </div>

              {showArrows && (
                <CustomNextArrow onClick={() => handleScroll(panelId, 'next')} />
              )}
            </div>

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
