import React, { useState } from 'react';
import Slider from 'react-slick';
import videoPanels from '../videoData.json';
import './VideoLandingPage.css';
import HelpMenu from './HelpMenu';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const VideoLandingPage = ({ basename }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [arrowVisibility, setArrowVisibility] = useState({
    showLeft: false,
    showRight: true,
  });

  const handleCloseVideo = () => setSelectedVideo(null);

  const getSliderSettings = (numVideos) => ({
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: numVideos > 4, // Show arrows only if there are more than 4 videos
    beforeChange: (current, next) => {
      const totalSlides = numVideos - 1;
      if (next === 0) {
        setArrowVisibility({ showLeft: false, showRight: true });
      } else if (next === totalSlides) {
        setArrowVisibility({ showLeft: true, showRight: false });
      } else {
        setArrowVisibility({ showLeft: true, showRight: true });
      }
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, numVideos), // Adjust slidesToShow based on the number of videos
          slidesToScroll: 1,
          arrows: numVideos > 3, // Show arrows only if there are more than 3 videos
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(2, numVideos), // Adjust slidesToShow for smaller screen
          slidesToScroll: 1,
          arrows: numVideos > 2, // Show arrows only if there are more than 2 videos
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: numVideos > 1, // Show arrows only if there's more than 1 video
        }
      }
    ]
  });
  

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
      {videoPanels.map((panel, panelIndex) => (
        <div key={panelIndex} className="video-section mb-4" id={panel.topic}>
          <div className="row mb-3 align-items-center video-panel-header">
            <div className="col-md-8">
              <h3 className="video-section-title">{panel.title}</h3>
            </div>
          </div>

          <Slider {...getSliderSettings(panel.videos.length)}>
            {panel.videos.map((video, videoIndex) => (
              <div key={videoIndex} className="video-item">
                <div className="video-thumbnail-container" onClick={() => setSelectedVideo(video)}>
                  <img src={video.image} alt={video.title} className="video-thumbnail img-responsive" />
                </div>
                <div className="video-metadata">
                  <p className="video-title">{video.title}</p>
                </div>
              </div>
            ))}
          </Slider>

          {panelIndex < videoPanels.length - 1 && <hr className="video-divider" />}
        </div>
      ))}

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
