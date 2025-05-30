import React from 'react';
import { useLocation } from 'react-router-dom';
import './HelpMenu.css';

const HelpMenu = ({ basename }) => {
  const location = useLocation();
  
  const isHomePage = (basename === '' && location.pathname === '/') || 
                     (basename !== '' && location.pathname === '/')
  const helpTopicsHref = basename || '/'; // Set the correct href for "Help Topics" based on basename

  return (
    <div style={{ marginTop: '-20px' }}>
      <div className="small-menu">
        <p>
          <i className="fa fa-home" aria-hidden="true"></i>&nbsp;
          <a href={helpTopicsHref}
          style={{ opacity: isHomePage ? '50%' : '100%', pointerEvents: isHomePage ? 'none' : 'auto' }}>Help Topics</a>
          <span className="divider">|</span>
          
          <i className="fa fa-question-circle" aria-hidden="true"></i>&nbsp;
          <a href="/docs/general-help/website-faq">FAQs</a>
          <span className="divider">|</span>
          
          <i className="fa fa-book" aria-hidden="true"></i>&nbsp;
          <a href="/docs/general-help/glossary">Glossary</a>
        </p>
      </div>
    </div>
  );
};

export default HelpMenu;
