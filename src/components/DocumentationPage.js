// This file is not currently used. It is kept for reference in case the documentation landing page needs to be served from this external library in the future.
// Note: If enabled, CONTENT_URL should be provided by the host app (Sierra) rather than hard-coded. see reference CONTENT_URL in server/docsApi.js
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

function DocumentationPage( {basename} ) {
    console.log("_________Using basename__________:", basename);
    const { '*': docId } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [content, setContent] = useState(null);
    const [groupMap, setGroupMap] = useState({});
    const [menuPath, setMenuPath] = useState('');
    const [currentDocId, setCurrentDocId] = useState(null);

    const onFetchSuccess = useCallback((data) => {
        console.log("Initializing index with data:", data);
        const { index, group_idMap, groupNameMap, hrefMap, item_idMap } = setIndex(data, basename);
        console.log("Index initialized:", index);

        // Find the item using the full path
        const item = index.find(node => node.href === `${basename}/docs/${docId}`);

        if (item) {
            const { menu } = getMenuObj(index, item);
            setMenu(menu);
            setGroupMap(group_idMap);
            const path = getMenuPath(item, groupNameMap);
            setMenuPath(path);
            setCurrentDocId(docId);
            loadContent(item); // Trigger content load immediately after setting the item
        } else if (!docId && index.length > 0) {
            console.log("Navigating to first item:", index[1].href);
            navigate(index[1].href);
        } else {
            console.error("Item not found for docId:", docId);
        }
    }, [docId, navigate, basename]);

    const loadContent = async (item) => {
        try {
            const response = await fetch(`${CONTENT_URL}/${ENV}/${item._id}`);
            const data = await response.json();
            if (data) {
                setContent({
                    ...item,
                    html: data.html,
                    lastUpdatedStr: new Date(data.lastUpdated).toLocaleDateString('en-US'),
                });
                console.log("Content loaded for docId:", item.href, data);
            } else {
                console.error("No data returned for item:", item._id);
            }
        } catch (error) {
            console.error("Error fetching content for item:", item._id, error);
        }
    };

    const { loading, error } = useFetch(`${CONTENT_URL}/${ENV}/by-top-id/${ROOT_ID}`, onFetchSuccess);

    useEffect(() => {
        if (docId && menu.length > 0 && currentDocId !== docId) {
            const item = menu.find(node => node.href === `${basename}/docs/${docId}`);
            if (item) {
                loadContent(item);
                setMenuPath(getMenuPath(item, groupMap));
                setCurrentDocId(docId); // Ensure the current docId is updated to avoid re-fetching
            }
        }
    }, [docId, menu, groupMap, currentDocId, basename]);

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
