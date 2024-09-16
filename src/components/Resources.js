import React from 'react';
import './Resources.css'; // Custom CSS for additional styles

const Resources = ({ data }) => {
  return (
    <div className="resourcesContainer">
      {Object.keys(data).map((category, index) => (
        <div key={index} className="resourceBox">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">
                {category}
                <span className="tooltip-icon" data-tooltip={data[category].description}> 
                  <i className="glyphicon glyphicon-info-sign"></i>
                </span>
              </h3>
            </div>
            <div className="panel-body">
              <ul className="list-unstyled">
                {data[category].subheadings.map((item, i) => (
                  <li key={i} className="subheading-container">
                    <a href={`${item.link}`}>{item.title}</a>
                    <p className="subheading-description">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel-footer">
              <a href="#">Related FAQs</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Resources;
