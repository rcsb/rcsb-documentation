import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import SearchBar from './SearchBar'; 
import HelpMenu from './HelpMenu';
import './SearchResults.css';

const SEARCH_URL = '/docs-search/search';
const RESULTS_PER_PAGE = 25;

const SearchResults = ( {basename} ) => {
    const { query } = useParams();
    const [results, setResults] = useState([]);
    const [num, setNum] = useState({ rcsbPdb: 0, newsAnnouncements: 0, pdb101: 0, all: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('rcsbPdb');
    const [currentPage, setCurrentPage] = useState(1);

    // Memoized transformData function to avoid re-creating it on every render
    const transformData = useCallback((results) => {
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
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true); 
            try {
                const requestBody = {
                    query: encodeURIComponent(query),
                    page: {
                        size: 100, // Fetch 100 results
                        current: 1
                    }
                };

                const response = await fetch(SEARCH_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Explicitly set content type otherwise gives 404
                    },
                    body: JSON.stringify(requestBody)
                });
                const data = await response.json();
                const transformedData = transformData(data.results);
                setResults(transformedData.results);
                setNum(transformedData.num);
                setLoading(false);

                if (transformedData.num.rcsbPdb === 0) {
                    if (transformedData.num.newsAnnouncements > 0) {
                        setActiveTab('newsAnnouncements');
                    } else if (transformedData.num.pdb101 > 0) {
                        setActiveTab('pdb101');
                    } else if (transformedData.num.all > 0) {
                        setActiveTab('all');
                    }
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, transformData]); // Add transformData to the dependency array

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
        setCurrentPage(1); // Reset to the first page when changing tabs
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedResults = results.filter((o) => activeTab === 'all' || o.tab === activeTab)
                                     .slice((currentPage - 1) * RESULTS_PER_PAGE, currentPage * RESULTS_PER_PAGE);

    const renderPagination = (totalResults) => {
        const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                    <a className="page-link" onClick={() => handlePageChange(i)}>{i}</a>
                </li>
            );
        }
        return (
            <div className="d-flex justify-content-between align-items-center">
                <div className="pagination-info">
                    Showing {((currentPage - 1) * RESULTS_PER_PAGE) + 1} to {Math.min(currentPage * RESULTS_PER_PAGE, totalResults)} of {totalResults} entries
                </div>
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <a className="page-link" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        {pages}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <a className="page-link" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    };

    if (loading) {
        return <div className="text-center"><i className="fa fa-spinner fa-spin"></i> Loading...</div>;
    }

    return (
        <div className="container search-results">
            <div className="row">
                <div className="col-md-9">
                    <h1>Search Results for "{query}"</h1>
                </div>    
                <div className="col-md-3">
                    <HelpMenu basename={basename}/>
                </div> 
            </div>
            
            <div className="row">
                <div className="col-lg-12">
                    <div className="doc-search-bar-background">
                        <SearchBar />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-3">
                    <ul className="nav nav-pills nav-stacked">
                        <li className={activeTab === 'rcsbPdb' ? 'active' : ''}>
                            <a onClick={() => handleTabClick('rcsbPdb')}>
                                RCSB PDB ({num.rcsbPdb})
                            </a>
                        </li>
                        <li className={activeTab === 'newsAnnouncements' ? 'active' : ''}>
                            <a onClick={() => handleTabClick('newsAnnouncements')}>
                                News / Announcements ({num.newsAnnouncements})
                            </a>
                        </li>
                        <li className={activeTab === 'pdb101' ? 'active' : ''}>
                            <a onClick={() => handleTabClick('pdb101')}>
                                PDB-101 Articles ({num.pdb101})
                            </a>
                        </li>
                        <li className={activeTab === 'all' ? 'active' : ''}>
                            <a onClick={() => handleTabClick('all')}>
                                All ({num.all})
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="col-md-9">
                    <div className="tab-content">
                        {results.length === 0 ? (
                            <div className="alert alert-warning">No results found</div>
                        ) : (
                            <>
                                <div className={`tab-pane ${activeTab === 'rcsbPdb' ? 'active' : ''}`}>
                                    {num.rcsbPdb === 0 ? (
                                        <div className="alert alert-info">No documents found</div>
                                    ) : (
                                        <ul className="list-group">
                                            {paginatedResults.map((o) => o.tab === 'rcsbPdb' && (
                                                <li key={o.id} className="list-group-item">
                                                    <div className="url-tokens">
                                                        <a href={o.url}>{o.url_tokens}</a>
                                                    </div>
                                                    <h3><a href={o.url}>{o.title}</a></h3>
                                                    <p dangerouslySetInnerHTML={{ __html: o.snippet }} />
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
                                            {paginatedResults.map((o) => o.tab === 'newsAnnouncements' && (
                                                <li key={o.id} className="list-group-item">
                                                    <div className="url-tokens">
                                                        <a href={o.url}>{o.url_tokens}</a>
                                                    </div>
                                                    <h3><a href={o.url}>{o.title}</a></h3>
                                                    {o.release_date && <p>{o.release_date}</p>}
                                                    <p dangerouslySetInnerHTML={{ __html: o.snippet }} />
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
                                            {paginatedResults.map((o) => o.tab === 'pdb101' && (
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
                                                    <p dangerouslySetInnerHTML={{ __html: o.snippet }} />
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
                                            {paginatedResults.map((o) => (
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
                                                    <p dangerouslySetInnerHTML={{ __html: o.snippet }} />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    {results.filter((o) => activeTab === 'all' || o.tab === activeTab).length > 0 && renderPagination(num[activeTab])}
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
