import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Resources from './Resources';
import data from '../resourcesData.json'; // Import the JSON data
import './SearchBar.css'; // Custom styles

const SUGGEST_URL_DOCUMENTS = '/docs-search/query_suggestion?query=';

const SearchBar = () => {
    const [value, setValue] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
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

    const handleInputChange = (e) => {
        setValue(e.target.value);
    };

    const handleInputClick = () => {
        if (value.length > 1 && menuItems.length > 0) {
            setMenuOpen(true);
        }
    };

    const handleSearch = useCallback((query) => {
        navigate(`/document-search/${encodeURIComponent(query)}`);
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
        <div className="container my-4">
            <div className="row">
                <div className="col-lg-8 col-md-8 col-sm-12">
                    <h1 className="text-left mb-3">RCSB PDB Help</h1>
                    <div className="input-group search-bar">
                        <input type="text"
                               className="form-control"
                               onClick={handleInputClick}
                               onChange={handleInputChange}
                               onKeyDown={handleKeyDown}
                               placeholder="Enter search terms(s), e.g. structure motif"
                               autoComplete="off"
                               spellCheck="false"
                               autoFocus
                               value={value} />
                        <span className="input-group-btn">
                            <button className="btn btn-primary search-button" onClick={handleButtonClick}>
                                <i className="glyphicon glyphicon-search"></i>
                            </button>
                        </span>
                        {menuOpen && (
                            <ul className="dropdown-menu w-100" style={{ display: 'block', position: 'absolute', top: '100%' }}>
                                {menuItems.map((item, i) => (
                                    <li key={item} className={i === menuIndex ? 'active' : ''}>
                                        <a href="#!" onClick={() => handleMenuSelect(item)} dangerouslySetInnerHTML={{ __html: item }} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <Resources data={data} />
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                    <div className="p-3 bg-white">
                        <p>Help Links and Videos Tutorials</p>
                        {/* Placeholder for help and video components */}
                        <div className="row">
                            <div className="col-12">
                                <div className="mini-component-placeholder">
                                    {/* component 1 */}
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mini-component-placeholder">
                                    {/* component 2 */}
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mini-component-placeholder">
                                    {/* component 3 */}
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mini-component-placeholder">
                                    {/*  component 4 */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
