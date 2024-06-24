
import React, { useState, useEffect } from 'react';

const Documentation = ({ groupMap, menu, item }) => {
  const [activeItem, setActiveItem] = useState(item);
  const [activeGroupMap, setActiveGroupMap] = useState(groupMap);
  const [activeMenu, setActiveMenu] = useState(menu);

  useEffect(() => {
    // Fetch initial data or use props
    setActiveItem(item);
    setActiveGroupMap(groupMap);
    setActiveMenu(menu);
  }, [item, groupMap, menu]);

  const toggleGroup = (id) => {
    const group = activeGroupMap[id];
    const updatedGroup = { ...group, open: !group.open };
    setActiveGroupMap({ ...activeGroupMap, [id]: updatedGroup });
    // Update activeMenu accordingly
  };

  return (
    <div id="docs-container">
      <div className="menu">
      <h1>Testing</h1>
        <div className="menu-header">Documentation</div>
        {activeMenu.map((o) => {
          const { _id, depth, href, name, open, show, title, type } = o;
          if (type === 'group') {
            return (
              <div key={_id} className={`group ${show ? 'show' : 'hidden'}`} onClick={() => toggleGroup(_id)}>
                <span style={{ paddingLeft: `${depth * 20 + 4}px` }}>{name}</span>
                <span className={`glyphicon ${open ? 'glyphicon-triangle-top' : 'glyphicon-triangle-bottom'}`} />
              </div>
            );
          }
          return (
            <div key={_id} className={`item ${show ? 'show' : 'hidden'}`}>
              <a href={href} style={{ paddingLeft: `${(depth + 1) * 20 + 4}px` }}>{title}</a>
            </div>
          );
        })}
      </div>
      <div className="content-item">
        <h1>{activeItem.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: activeItem.html }} />
      </div>
    </div>
  );
};

export default Documentation;
