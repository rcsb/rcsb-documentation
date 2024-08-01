import React from 'react';
import './Resources.css'; // Custom CSS for additional styles

const Resources = ({ data }) => {
  return (
    <div className="resourcesContainer">
      {Object.keys(data).map((category, index) => (
        <div key={index} className="resourceBox">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">{category}</h3>
            </div>
            <div className="panel-body">
              <ul className="list-unstyled">
                {data[category].map((item, i) => (
                  <li key={i}>
                    <a href={item.link}>{item.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Resources;
