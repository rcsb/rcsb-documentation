import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SUGGEST_URL_DOCUMENTS = '/docs-search/query_suggestion?query=';

const SearchBar = () => {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [menuIndex, setMenuIndex] = useState(-1);
    const navigate = useNavigate();

    useEffect(() => {
        if (value.length > 1) {
            fetchSuggestions(value);
        } else {
            setMenuItems([]);
            setMenuOpen(false);
        }
    }, [value]);

    const fetchSuggestions = async (query) => {
        try {
            const response = await fetch(SUGGEST_URL_DOCUMENTS + encodeURIComponent(query));
            const data = await response.json();
            setSuggestions(data.results.documents.map(doc => doc.suggestion));
            setMenuItems(data.results.documents.map(doc => doc.suggestion));
            setMenuOpen(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleInputChange = (e) => {
        setValue(e.target.value);
    };

    const handleInputClick = () => {
        if (value.length > 1 && menuItems.length > 0) {
            setMenuOpen(true);
        }
    };

    const handleSearch = (query) => {
        navigate(`/document-search/${encodeURIComponent(query)}`);
    };

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

    return (
        <div className="search-bar">
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                onClick={handleInputClick}
                onKeyDown={handleKeyDown}
                placeholder="Enter search terms(s), e.g. structure motif"
                autoComplete="off"
                spellCheck="false"
                autoFocus
            />
            {menuOpen && (
                <div id="search-bar-menu">
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className={index === menuIndex ? 'value-selected' : 'value'}
                            onClick={() => handleMenuSelect(item)}
                            dangerouslySetInnerHTML={{ __html: item }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
