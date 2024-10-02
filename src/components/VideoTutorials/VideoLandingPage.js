import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import videoPanels from './videoData.json';
import './VideoLandingPage.css';
import HelpMenu from '../HelpMenu';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components
const CustomPrevArrow = ({ onClick, currentSlide }) => {
  if (currentSlide === 0) return null; // Hide the left arrow if on the first slide
  return (
    <button className="slick-prev" onClick={onClick}>
      &#8592;
    </button>
  );
};

const CustomNextArrow = ({ onClick, currentSlide, slideCount }) => {
  if (currentSlide === slideCount - 1) return null; // Hide the right arrow if on the last slide
  return (
    <button className="slick-next" onClick={onClick}>
      &#8594;
    </button>
  );
};

const VideoLandingPage = ({ basename }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide
  const location = useLocation();

  const handleCloseVideo = () => setSelectedVideo(null);

  const getSliderSettings = (numVideos) => ({
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(4, numVideos), 
    slidesToScroll: 1,
    arrows: numVideos > 4,
    prevArrow: <CustomPrevArrow currentSlide={currentSlide} />, 
    nextArrow: <CustomNextArrow currentSlide={currentSlide} slideCount={numVideos} />,
    beforeChange: (current, next) => {
      setCurrentSlide(next); // Update current slide for arrow logic
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, numVideos),
          slidesToScroll: 1,
          variableWidth: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(2, numVideos),
          slidesToScroll: 1,
          variableWidth: true,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true,
        }
      }
    ]
  });

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        // Scroll the element into view smoothly
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
