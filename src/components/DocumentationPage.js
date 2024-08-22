import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CONTENT_URL, ENV, ROOT_ID } from '../constants';
import Menu from './Menu';
import { useFetch } from '../hooks/useFetch';

function DocumentationPage() {
    const { docId } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [content, setContent] = useState(null);

    // Initialize index and menu
    const initializeIndex = (data) => {
        if (Array.isArray(data) && data.length > 0) {
            const newMenu = data.map(node => ({
                _id: node._id,
                href: node.href || `/docs/${node._id}`,
                title: node.title,
                name: node.name,
                type: node.type
            }));
            setMenu(newMenu);
            if (!docId) navigate(newMenu[0].href);
        } else {
            console.error("No data returned from the API or unexpected data structure");
        }
    };

    // Fetch the index data
    useFetch(`${CONTENT_URL}/${ENV}/by-top-id/${ROOT_ID}`, initializeIndex);

    // Fetch the content data based on docId
    useEffect(() => {
        if (docId) {
            const loadContent = async () => {
                const response = await fetch(`${CONTENT_URL}/${ENV}/${docId}`);
                const data = await response.json();
                setContent(data);
            };
            loadContent();
        }
    }, [docId]);

    if (!menu.length) return <p>Loading...</p>;  // Handles initial loading state
    if (!content) return <p>Select a document to view.</p>;  // When no document is selected

    return (
        <div>
            <div className="container">
            <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-12">
                    <Menu menu={menu} />
                </div>
                <div className="col-lg-9">
                    <div>
                        <h1>{content.title}</h1>
                        <div dangerouslySetInnerHTML={{ __html: content.html }} />
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default DocumentationPage;
