import React from 'react';
import styles from './Resources.module.css';

const Resources = ({ data }) => {
  return (
    <div className={styles.resourcesContainer}>
      {Object.keys(data).map((category, index) => (
        <div key={index} className={styles.resourceBox}>
          <h3>{category}</h3>
          <ul>
            {data[category].map((item, i) => (
              <li key={i}>
                <a href={item.link}>{item.title}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Resources;
