import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'; // Custom styles

const SUGGEST_URL_DOCUMENTS = 'http://localhost:8080/docs-search/query_suggestion?query='; //TODO: Remove localhost for deployment; used only for local testing

const SearchBar = () => {
    const [value, setValue] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuIndex, setMenuIndex] = useState(-1);
    const navigate = useNavigate();

    const fetchSuggestions = useCallback(async (query) => {
        try {
            const response = await fetch(SUGGEST_URL_DOCUMENTS + encodeURIComponent(query));
            const data = await response.json();
            const suggestions = data.results.documents.map(doc => doc.suggestion);
            setMenuItems(suggestions);
            setMenuOpen(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }, []);

    useEffect(() => {
        if (value.length > 1) {
            fetchSuggestions(value);
        } else {
            setMenuItems([]);
            setMenuOpen(false);
        }
    }, [value, fetchSuggestions]);

    const handleInputChange = (e) => {
        setValue(e.target.value);
    };

    const handleInputClick = () => {
        if (value.length > 1 && menuItems.length > 0) {
            setMenuOpen(true);
        }
    };

    const handleSearch = useCallback((query) => {
        navigate(`/${encodeURIComponent(query)}`);
    }, [navigate]);

    const handleMenuSelect = (item) => {
        handleSearch(item);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setMenuIndex((prevIndex) => (prevIndex + 1) % menuItems.length);
        } else if (e.key === 'ArrowUp') {
            setMenuIndex((prevIndex) => (prevIndex - 1 + menuItems.length) % menuItems.length);
        } else if (e.key === 'Enter') {
            handleMenuSelect(menuItems[menuIndex]);
        }
    };

    const handleButtonClick = () => {
        if (value.trim()) {
            handleSearch(value);
        }
    };
    
    return (
        <div className="search-bar-container">
            <div className="search-bar">
                <input type="text"
                    className="form-control"
                    onClick={handleInputClick}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Structure Motif, Hemoglobin, Webinar"
                    autoComplete="off"
                    spellCheck="false"
                    autoFocus
                    value={value} />
                <button className="search-button" onClick={handleButtonClick}>
                    Search
                </button>
                <span className="tooltip-icon" data-tooltip="Search for help resources, PDB-101 learning resources, and archived news items">
                    <i className="glyphicon glyphicon-info-sign"></i>
                </span>
            </div>
            {menuOpen && (
                <ul className="dropdown-menu">
                    {menuItems.map((item, i) => (
                        <li key={item} className={i === menuIndex ? 'active' : ''}>
                            <a href="" onClick={() => handleMenuSelect(item)} dangerouslySetInnerHTML={{ __html: item }} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;