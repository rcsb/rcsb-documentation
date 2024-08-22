import React from 'react';
import { Link } from 'react-router-dom';

function Menu({ menu }) {
    return (
        <nav>
            <ul>
                {menu.map(item => (
                    <li key={item._id}>
                        <Link to={item.href}>{item.title || item.name}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Menu;
