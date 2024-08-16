import React from 'react';
import './HelpMenu.css';

const HelpMenu = () => {
  return (
    <div style={{ marginTop: '-20px' }}>
      <div className="small-menu">
        <p>
          <a href="" style={{ opacity: '50%' }}>
            <i className="fa fa-home" aria-hidden="true"></i> Help Topics
          </a>
          <span className="divider">|</span>
          <a href="">
            <i className="fa fa-question-circle" aria-hidden="true"></i> FAQs
          </a>
          <span className="divider">|</span>
          <a href="">
            <i className="fa fa-book" aria-hidden="true"></i> Glossary
          </a>
        </p>
      </div>
    </div>
  );
};

export default HelpMenu;
