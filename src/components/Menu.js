import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Menu.css'; // CSS for styling

function Menu({ menu }) {
    const [menuState, setMenuState] = useState({});
    const location = useLocation();

    useEffect(() => {
        // Automatically expand the group that contains the currently selected item
        const selectedItem = menu.find(item => item.href === location.pathname);
        if (selectedItem && selectedItem.parent_id) {
            expandParentGroups(selectedItem.parent_id);
        }
    }, [location.pathname, menu]);

    const toggleGroup = (_id) => {
        setMenuState(prevState => ({
            ...prevState,
            [_id]: !prevState[_id],
        }));
    };

    const expandParentGroups = (parentId) => {
        setMenuState(prevState => ({
            ...prevState,
            [parentId]: true,
        }));
        const parentItem = menu.find(item => item._id === parentId);
        if (parentItem && parentItem.parent_id) {
            expandParentGroups(parentItem.parent_id);
        }
    };

    return (
        <nav id="menu">
            <div id="menu-header">Documentation</div>
            <ul>
                {menu.map(item => (
                    <li key={item._id} className={item.show ? 'show' : 'hidden'}>
                        {item.type === 'group' ? (
                            <div
                                className="group"
                                onClick={() => toggleGroup(item._id)}
                                style={{ paddingLeft: `${item.depth * 20 + 4}px` }}
                            >
                                {item.name}
                                <span
                                    className={`glyphicon ${menuState[item._id] ? 'glyphicon-triangle-top' : 'glyphicon-triangle-bottom'}`}
                                    id={`glyph${item._id}`}
                                />
                            </div>
                        ) : (
                            <div className="item">
                                <Link
                                    to={item.href}
                                    className={item.selected ? 'docs-index-link' : ''}
                                    style={{ paddingLeft: `${(item.depth + 1) * 20 + 4}px` }}
                                >
                                    {item.title}
                                </Link>
                                {item.selected && <span className="glyphicon glyphicon-chevron-right" />}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Menu;
