import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.css';

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
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>RCSB PDB Help</h1>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.searchBarComponent}>
                    <div className={styles.menuContainer}>
                        <div className={styles.searchBarInput}>
                            <div className={styles.inputContainer}>
                                <input type="text"
                                       className={styles.searchBarInputText}
                                       onClick={handleInputClick}
                                       onChange={handleInputChange}
                                       onKeyDown={handleKeyDown}
                                       placeholder="Enter search terms(s), e.g. structure motif"
                                       autoComplete="off"
                                       spellCheck="false"
                                       autoFocus
                                       value={value} />
                                {menuOpen && (
                                    <div className={styles.searchBarMenu}>
                                        {menuItems.map((item, i) => (
                                            <div
                                                className={i === menuIndex ? styles.valueSelected : styles.value}
                                                key={item}
                                                onClick={() => handleMenuSelect(item)}
                                                dangerouslySetInnerHTML={{ __html: item }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={styles.searchIcon} onClick={handleButtonClick}>
                                <span className={`glyphicon glyphicon-search ${styles.searchBtn}`} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.newComponent}>
                    {/* Add your new component here */}
                    <p>New Component Content</p>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
