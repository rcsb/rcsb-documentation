import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'; // Custom styles

const SUGGEST_URL_DOCUMENTS = '/docs-api/query_suggestion?query=';

const SearchBar = () => {
    const [value, setValue] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuIndex, setMenuIndex] = useState(-1);
    const navigate = useNavigate();
    const searchBarRef = useRef(null);

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
        setMenuOpen(false);
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
            if (menuIndex >= 0 && menuItems.length > 0) {
                handleMenuSelect(menuItems[menuIndex]);
            } else {
                handleSearch(value);
            }
        }
    };

    const handleButtonClick = () => {
        if (value.trim()) {
            handleSearch(value);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="doc-search-bar-container" ref={searchBarRef}>
            <div className="doc-search-bar">
                <input type="text"
                    className="form-control"
                    onClick={handleInputClick}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for help e.g. 3D Motif, Hemoglobin, Webinar"
                    autoComplete="off"
                    spellCheck="false"
                    autoFocus
                    value={value} />
                <button className="doc-search-button" onClick={handleButtonClick}>
                    Search
                </button>
                <span className="tooltip-icon" data-tooltip="Search for help resources, PDB-101 learning resources, and archived news items">
                    <i className="glyphicon glyphicon-info-sign"></i>
                </span>
            </div>
            {menuOpen && menuItems.length > 0 && (
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
