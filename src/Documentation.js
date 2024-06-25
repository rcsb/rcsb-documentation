import React, { useState, useEffect } from 'react';

const Documentation = ({ data }) => {
  const [groupMap, setGroupMap] = useState(data.groupMap);

  useEffect(() => {
    setGroupMap(data.groupMap);
  }, [data.groupMap]);

  const toggle = (_id) => {
    const group = groupMap[_id];
    const _ids = group._ids;
    const open = group.open || false;

    if (open) {
      closeGroup(group);
    } else {
      _ids.forEach(id => document.getElementById(id).classList.remove('hidden'));
      group.open = true;
      document.getElementById(`glyph${_id}`).classList.replace('glyphicon-triangle-bottom', 'glyphicon-triangle-top');
    }
  };

  const closeGroup = (group) => {
    if (group.open) {
      const _ids = group._ids;
      _ids.forEach(id => {
        document.getElementById(id).classList.replace('show', 'hidden');
        if (groupMap[id]) closeGroup(groupMap[id]);
      });
      group.open = false;
      document.getElementById(`glyph${group._id}`).classList.replace('glyphicon-triangle-top', 'glyphicon-triangle-bottom');
    }
  };

  const log = (o, s = '') => {
    console.log(`${s}=${typeof o === 'object' ? JSON.stringify(o, null, 2) : o}`);
  };

  return (
    <div id="docs-container">
      <div className="row">
        <div className="col-lg-3 col-md-4 col-sm-12 hidden-print">
          <div data-elastic-exclude="true">
            <div id="menu">
              <div id="menu-header">Documentation</div>
              {data.menu.map(o => {
                const { _id, depth, href, name, open, parent_id, selected, show, title, type } = o;
                return type === 'group' ? (
                  <div key={_id} className={`group ${show ? 'show' : 'hidden'}`} id={_id} onClick={() => toggle(_id)}>
                    <table>
                      <tbody>
                        <tr>
                          <td style={{ paddingLeft: `${depth * 20 + 4}px` }}>{name}</td>
                          <td>
                            <span className={`glyphicon ${open ? 'glyphicon-triangle-top' : 'glyphicon-triangle-bottom'}`} id={`glyph${_id}`}></span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div key={_id} className={`item ${show ? 'show' : 'hidden'}`} id={_id}>
                    <table>
                      <tbody>
                        <tr>
                          <td className="title" style={{ paddingLeft: `${(depth + 1) * 20 + 4}px` }}>
                            <a href={href} className={selected ? 'docs-index-link' : ''}>{title}</a>
                          </td>
                          {selected && <td><span className="glyphicon glyphicon-chevron-right"></span></td>}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-lg-9 col-md-8 col-sm-12 content-item">
          {data.item && (
            <div data-elastic-include="true">
              <h5 className="menu-path">{data.menuPath}</h5>
              <h1>{data.item.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: data.item.html }}></div>
              <br />
              <hr />
              <div className="item-info">
                <div>Please report any encountered broken links to <a href="mailto:info@rcsb.org">info@rcsb.org</a></div>
                <div>Last updated: {data.item.lastUpdatedStr}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documentation;
