import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CONTENT_URL, ENV, ROOT_ID } from '../constants';
import Menu from './Menu';
import { useFetch } from '../hooks/useFetch';
import {
    setIndex,
    getMenuObj,
    getMenuPath
} from '../utils/util.js';
import './DocumentationPage.css';

function DocumentationPage() {
    const { '*': docId } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [content, setContent] = useState(null);
    const [groupMap, setGroupMap] = useState({});
    const [menuPath, setMenuPath] = useState('');
    const [currentDocId, setCurrentDocId] = useState(null);

    const onFetchSuccess = useCallback((data) => {
        console.log("Initializing index with data:", data);
        const { index, group_idMap, groupNameMap, hrefMap, item_idMap } = setIndex(data);
        console.log("Index initialized:", index);

        // Find the item using the full path
        const item = index.find(node => node.href === `/docs/${docId}`);

        if (item) {
            const { menu } = getMenuObj(index, item);
            setMenu(menu);
            setGroupMap(group_idMap);
            const path = getMenuPath(item, groupNameMap);
            setMenuPath(path);
            setContent(item);
            setCurrentDocId(docId);
            console.log("Content set with item:", item);
        } else if (!docId && index.length > 0) {
            console.log("Navigating to first item:", index[1].href);
            navigate(index[1].href);
        } else {
            console.error("Item not found for docId:", docId);
        }
    }, [docId, navigate]);

    const { loading, error } = useFetch(`${CONTENT_URL}/${ENV}/by-top-id/${ROOT_ID}`, onFetchSuccess);

    useEffect(() => {
        if (docId && menu.length > 0 && currentDocId !== docId) {
            const item = menu.find(node => node.href === `/docs/${docId}`);
            if (item) {
                const loadContent = async () => {
                    try {
                        const response = await fetch(`${CONTENT_URL}/${ENV}/${item._id}`);
                        const data = await response.json();
                        if (data) {
                            setContent({
                                ...item,
                                html: data.html,
                                lastUpdatedStr: new Date(data.lastUpdated).toLocaleDateString('en-US'),
                            });
                            console.log("Content loaded for docId:", docId, data);
                        } else {
                            console.error("No data returned for docId:", docId);
                        }
                    } catch (error) {
                        console.error("Error fetching content for docId:", docId, error);
                    }
                };

                loadContent();
                setMenuPath(getMenuPath(item, groupMap));
                setCurrentDocId(docId); // Ensure the current docId is updated to avoid re-fetching
            }
        }
    }, [docId, menu, groupMap, currentDocId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Oops, an error occurred while loading the documentation.</p>;
    if (!content) return <p>Oops, looks like this page does not exist. Try going back to the homepage.</p>;

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-12">
                    <Menu menu={menu} />
                </div>
                <div className="col-lg-9 col-md-8 col-sm-12 content-item">
                    <h5 className="menu-path">{menuPath}</h5>
                    <h1>{content.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: content.html }} />
                    <br />
                    <hr />
                    <div className="item-info">
                        <div>
                            Please report any encountered broken links to <a href="mailto:info@rcsb.org">info@rcsb.org</a>
                        </div>
                        <div>
                            {'Last updated: ' + content.lastUpdatedStr}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DocumentationPage;
