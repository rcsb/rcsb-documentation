import React, { useState } from 'react';

const SUGGEST_URL_DOCUMENTS = '/document-search/suggest/';

const SearchBar = () => {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const inputChange = async (e) => {
        const value = e.target.value;
        setValue(value);
        if (value.length > 1) {
            try {
                const response = await fetch(SUGGEST_URL_DOCUMENTS + encodeURIComponent(value));
                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                value={value}
                onChange={inputChange}
                placeholder="Search..."
            />
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: suggestion }} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
