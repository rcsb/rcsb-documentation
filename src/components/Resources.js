import React from 'react';
import './Resources.css';


const Resources = ({ data }) => {
  return (
    <div className="resourcesContainer row gx-3 gy-4 mb-4">
      {Object.keys(data).map((category, index) => (
        <div key={index} className="col-md-4 d-flex">
          <div className="card card-navy w-100">
            <div className="card-header">
              <h4>{category}</h4>
              <span className="tooltip-icon" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title={data[category].description}>
                <i className="i-help"></i>
              </span>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                {data[category].subheadings.map((item, i) => (
                  <li key={i} className="subheading-container">
                    <a href={`${item.link}`}>{item.title}</a>
                    <p className="subheading-description mb-2">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer">
              <a href={data[category].faqlink}>Related FAQs</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Resources;
