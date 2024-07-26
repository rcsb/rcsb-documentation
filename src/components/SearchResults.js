import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import './SearchResults.css';

const SEARCH_URL = '/docs-search/search?query=';

const SearchResults = () => {
    const { query } = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(SEARCH_URL + encodeURIComponent(query));
                const data = await response.json();
                setResults(data.results);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="search-results">
            <h1>Search Results for "{query}"</h1>
            {results.length === 0 ? (
                <div>No results found</div>
            ) : (
                <ul>
                    {results.map((result) => (
                        <li key={result.id.raw}>
                            <a href={result.url.raw}>{result.title.raw}</a>
                            <p>{result.snippet ? result.snippet : result.body_content.snippet}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchResults;
