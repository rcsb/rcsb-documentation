import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SearchResults.css'; // Custom styles

const SEARCH_URL = '/docs-search/search?query=';

const SearchResults = () => {
    const { query } = useParams();
    const [results, setResults] = useState([]);
    const [num, setNum] = useState({ rcsbPdb: 0, newsAnnouncements: 0, pdb101: 0, all: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('rcsbPdb');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(SEARCH_URL + encodeURIComponent(query));
                const data = await response.json();
                const transformedData = transformData(data.results);
                setResults(transformedData.results);
                setNum(transformedData.num);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const transformData = (results) => {
        const num = { rcsbPdb: 0, newsAnnouncements: 0, pdb101: 0, all: 0 };

        const transformedResults = results.map((o) => {
            const {
                body_content,
                title,
                headings,
                url,
                url_host,
                id,
                meta_description,
                meta_keywords,
                release_date
            } = o;

            let snippet = '';
            if (body_content && body_content.snippet && body_content.snippet.indexOf('<em>') !== -1) {
                snippet = body_content.snippet;
            } else if (headings && headings.snippet && headings.snippet.indexOf('<em>') !== -1) {
                snippet = headings.snippet;
            } else if (meta_keywords && meta_keywords.snippet && meta_keywords.snippet.indexOf('<em>') !== -1) {
                snippet = meta_keywords.snippet;
                o.source = 'Keywords';
            } else if (meta_description && meta_description.snippet && meta_description.snippet.indexOf('<em>') !== -1) {
                snippet = meta_description.snippet;
                o.source = 'Description';
            } else if (body_content && body_content.snippet) {
                snippet = body_content.snippet;
            }

            o.snippet = snippet;
            o.release_date = release_date ? release_date.raw : '';
            o.title = title ? title.raw : '';
            o.url_host = url_host.raw;
            o.url_tokens = getUrlTokens(url.raw);
            o.url = o.url_host === 'www.rcsb.org' ? url.raw.replace('https://www.rcsb.org', '') : url.raw;
            o.id = id.raw;
            o.score = o._meta.score;

            if (o.url_host === 'www.rcsb.org') {
                if (o.url.indexOf('/news') === -1) {
                    o.tab = 'rcsbPdb';
                    num.rcsbPdb++;
                } else {
                    o.tab = 'newsAnnouncements';
                    num.newsAnnouncements++;
                }
            } else {
                o.tab = 'pdb101';
                num.pdb101++;
            }

            return o;
        });

        num.all = num.rcsbPdb + num.newsAnnouncements + num.pdb101;

        return { results: transformedResults, num };
    };

    const getUrlTokens = (url) => {
        let a = url.split('/'),
            url_host = a[2],
            tokens = a[0] + '//' + url_host + '>';

        a = a.splice(3);
        tokens += a.join('>');
        return tokens;
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    if (loading) {
        return <div className="text-center"><i className="fa fa-spinner fa-spin"></i> Loading...</div>;
    }

    return (
        <div className="container search-results">
            <h1>Search Results for "{query}"</h1>
            {results.length === 0 ? (
                <div className="alert alert-warning">No results found</div>
            ) : (
                <>
                    <ul className="nav nav-tabs" role="tablist">
                        <li className={activeTab === 'rcsbPdb' ? 'active' : ''}>
                            <a onClick={() => handleTabClick('rcsbPdb')} role="tab">
                                RCSB PDB ({num.rcsbPdb})
                            </a>
                        </li>
                        <li className={activeTab === 'newsAnnouncements' ? 'active' : ''}>
                            <a onClick={() => handleTabClick('newsAnnouncements')} role="tab">
                                News / Announcements ({num.newsAnnouncements})
                            </a>
                        </li>
                        <li className={activeTab === 'pdb101' ? 'active' : ''}>
                            <a onClick={() => handleTabClick('pdb101')} role="tab">
                                PDB-101 Articles ({num.pdb101})
                            </a>
                        </li>
                        <li>
                            <a onClick={() => handleTabClick('all')} role="tab">
                                All ({num.all})
                            </a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className={`tab-pane ${activeTab === 'rcsbPdb' ? 'active' : ''}`}>
                            {num.rcsbPdb === 0 ? (
                                <div className="alert alert-info">No documents found</div>
                            ) : (
                                <ul className="list-group">
                                    {results.map((o) => o.tab === 'rcsbPdb' && (
                                        <li key={o.id} className="list-group-item">
                                            <div className="url-tokens">
                                                <a href={o.url}>{o.url_tokens}</a>
                                            </div>
                                            <h3><a href={o.url}>{o.title}</a></h3>
                                            <p>{o.snippet}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className={`tab-pane ${activeTab === 'newsAnnouncements' ? 'active' : ''}`}>
                            {num.newsAnnouncements === 0 ? (
                                <div className="alert alert-info">No documents found</div>
                            ) : (
                                <ul className="list-group">
                                    {results.map((o) => o.tab === 'newsAnnouncements' && (
                                        <li key={o.id} className="list-group-item">
                                            <div className="url-tokens">
                                                <a href={o.url}>{o.url_tokens}</a>
                                            </div>
                                            <h3><a href={o.url}>{o.title}</a></h3>
                                            {o.release_date && <p>{o.release_date}</p>}
                                            <p>{o.snippet}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className={`tab-pane ${activeTab === 'pdb101' ? 'active' : ''}`}>
                            {num.pdb101 === 0 ? (
                                <div className="alert alert-info">No documents found</div>
                            ) : (
                                <ul className="list-group">
                                    {results.map((o) => o.tab === 'pdb101' && (
                                        <li key={o.id} className="list-group-item">
                                            <div className="url-tokens">
                                                <a href={o.url} target="_blank" rel="noopener noreferrer">
                                                    {o.url_tokens}
                                                </a>
                                            </div>
                                            <h3>
                                                <a href={o.url} target="_blank" rel="noopener noreferrer">
                                                    {o.title.replace('PDB-101: ', '')}
                                                </a>
                                            </h3>
                                            <p>{o.snippet}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className={`tab-pane ${activeTab === 'all' ? 'active' : ''}`}>
                            {num.all === 0 ? (
                                <div className="alert alert-info">No documents found</div>
                            ) : (
                                <ul className="list-group">
                                    {results.map((o) => (
                                        <li key={o.id} className="list-group-item">
                                            <div className="url-tokens">
                                                <a href={o.url} target={o.url_host === 'www.rcsb.org' ? '_self' : '_blank'} rel="noopener noreferrer">
                                                    {o.url_tokens}
                                                </a>
                                            </div>
                                            <h3>
                                                <a href={o.url} target={o.url_host === 'www.rcsb.org' ? '_self' : '_blank'} rel="noopener noreferrer">
                                                    {o.title}
                                                </a>
                                            </h3>
                                            <p>{o.snippet}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchResults;
