// Check if fetch is available; otherwise, use node-fetch
if (typeof fetch === 'undefined') {
    global.fetch = require('node-fetch');
}

// Use native fetch in the browser environment
const CONTENT_URL = process.env.RCSB_DOCS_CONTENT_URL;
const GROUP = 'group';
const ITEM = 'item';
const ROOT_ID = 'rcsb-documentation';

// Cached objects
let dbLastUpdated = null;
let initialized = false;

let index = [],
    group_idMap = {},
    groupNameMap = {},
    item_idMap = {},
    hrefMap = {},
    itemMap = {};

function setContentUrl(url) {
  if (!url) return;
  CONTENT_URL = url.replace(/\/$/, ''); // remove trailing slash
}

function getContentUrl() {
  return CONTENT_URL;
}

// Fetch the latest 'lastUpdated' value for the top-level id
async function fetchLastUpdated(env) {
    const url = `${CONTENT_URL}/${env}/by-top-id/${ROOT_ID}/last-updated`;
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();
    return data.lastUpdated;
}

// Fetch all items for the top-level id
async function fetchIndex(env) {
    const url = `${CONTENT_URL}/${env}/by-top-id/${ROOT_ID}`;
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();
    if (data && data.length) {
        setIndex(data);
    }
    return data;
}

// Fetch a specific item by its id
async function fetchItem(env, id) {
    const url = `${CONTENT_URL}/${env}/${id}`;
    const response = await fetch(url, { method: 'GET' });
    const item = await response.json();
    return item;
}

// Initialize the index or check if it needs to be updated
async function initializeIndex(req) {
    const env = getEnv(req);
    let loadIndex = false;

    const lastUpdated = await fetchLastUpdated(env);

    if (!initialized || dbLastUpdated === null || lastUpdated > dbLastUpdated) {
        dbLastUpdated = lastUpdated;
        loadIndex = true;
    }

    if (loadIndex) {
        await fetchIndex(env);
    }
}

// Process and return the requested item
async function processItem(req, res) {
    const env = getEnv(req);
    await initializeIndex(req);
    getItem(req, res, env);
}

// Get environment from the request
function getEnv(req) {
    return req.app.locals.instance === 'production' ? 'production' : 'staging';
}

// Fetch and return the requested item
async function getItem(req, res, env) {
    const instance = req.app.locals.instance;
    let loadItem = false;
    let reqUrl = req.originalUrl;

    if (reqUrl.substring(reqUrl.length - 1) === '/') {
        reqUrl = reqUrl.substring(0, reqUrl.length - 1);
    }

    if (reqUrl === '/docs') {
        const href = getFirstItemHref();
        res.redirect(href);
    } else if (group_idMap[reqUrl]) {
        const href = getFirstItemHref(group_idMap[reqUrl]);
        if (href) res.redirect(href);
        else res.status(404).render('error', { statusCode: 404 });
    } else {
        const _id = item_idMap[reqUrl];
        if (_id) {
            if (!itemMap[_id]) {
                loadItem = true;
            } else {
                const url = `${CONTENT_URL}/${env}/last-updated/${_id}`;
                const response = await fetch(url, { method: 'GET' });
                const data = await response.json();

                if (data.lastUpdated > itemMap[_id].lastUpdated) loadItem = true;
            }

            if (loadItem) {
                const item = await fetchItem(env, _id);

                // Special case: Set attribute details if the URL matches
                if (reqUrl === '/docs/search-and-browse/advanced-search/attribute-details') {
                    setAttributeDetails(req, item);
                } else {
                    const imgPath = getImagePath(env, item, _id);
                    item.html = item.html.replace(/<IMG_PATH>/g, imgPath).replace(/https:\/\/www.rcsb.org/g, '');
                    item.lastUpdatedStr = new Date(item.lastUpdated).toLocaleDateString('en-US');    
                }

                item.href = hrefMap[_id];
                itemMap[_id] = item;

                const menuPath = getMenuPath(item);
                returnData(_id, instance, item, menuPath, res);
            } else {
                const item = itemMap[_id];
                const menuPath = getMenuPath(item);
                returnData(_id, instance, item, menuPath, res);
            }
        } else {
            res.status(404).render('error', { statusCode: 404 });
        }
    }
}

// Get image path based on environment and item properties
function getImagePath(env, item, _id) {
    if (env === 'production') {
        return item.useEast
            ? `https://cdn.rcsb.org/rcsb-pdb/content-east/${_id}/`
            : `https://cdn.rcsb.org/rcsb-pdb/content/${_id}/`;
    } else {
        return `https://cms.rcsb.org/file-uploads/content/${_id}/`;
    }
}

// Get the first item href under a given group or the first item in the index if group_id is undefined
function getFirstItemHref(group_id) {
    if (!group_id) {
        for (let i = 0; i < index.length; i++) {
            if (index[i].type === ITEM) return index[i].href;
        }
        return null;
    } else {
        let found = false;
        for (let i = 0; i < index.length; i++) {
            const node = index[i];
            if (node.type === GROUP && node._id === group_id) found = true;
            if (found && node.type === ITEM) return node.href;
        }
        return null;
    }
}

// Set the index for fetched data
function setIndex(nodes) {
    index.length = 0;
    const groups = nodes.filter(node => node.type === GROUP);
    const groupMap = {};
    const depth = -1; 

    let root;

    groups.forEach(group => {
        groupMap[group._id] = group;
    });

    nodes.forEach(node => {
        const { id, parent_id, type } = node;
        const group = groupMap[parent_id];

        if (type === GROUP && id === ROOT_ID) root = node;

        if (group) {
            if (!group.nodes) group.nodes = [];
            group.nodes.push(node);
        }
    });

    root.path = '/docs/';
    rootToIndex(root, depth);
    initialized = true;
}

// Recursively convert root object to index array
function rootToIndex(group, depth) {
    const { id, nodes, path } = group;

    if (id !== ROOT_ID) {
        group.numNodes = nodes ? nodes.length : 0;
        const obj = getIndexObj(group, depth);
        index.push(obj);
    }

    if (nodes) {
        nodes.forEach(node => {
            node.href = path + node.id;
            if (node.type === GROUP) {
                const { _id, href, name } = node;
                node.path = href + '/';
                group_idMap[href] = _id;
                groupNameMap[_id] = name;
                rootToIndex(node, depth + 1);
            } else {
                hrefMap[node._id] = node.href;
                item_idMap[node.href] = node._id;
                index.push(getIndexObj(node, depth));
            }
        });
    }
}

// Convert node to index node
function getIndexObj(node, depth) {
    const { _id, href, name, parent_id, title, type } = node;
    return type === GROUP ? { _id, depth, name, parent_id, type } : { _id, depth, href, parent_id, title, type };
}

// Get menu path for the item
function getMenuPath(item) {
    const { _ids } = item;
    let menuPaths = [];
    _ids.forEach(_id => {
        if (groupNameMap[_id]) menuPaths.push(groupNameMap[_id]);
    });
    return menuPaths.join(' > ');
}

// Return data to be rendered in the template
function returnData(_id, instance, item, menuPath, res) {
    const { description, title } = item;
    const menuObj = getMenuObj(item);
    const { groupMap, menu } = menuObj;
    res.render('docs', { description, groupMap, instance, item, menu, menuPath, title });
}

// Get the menu object for rendering
function getMenuObj(item) {
    const menu = JSON.parse(JSON.stringify(index));
    const groupMap = {};
    const groups = menu.filter(o => o.type === GROUP);

    groups.forEach(group => {
        group._ids = [];
        groupMap[group._id] = group;
        if (group.depth === 0) group.show = true;
    });

    item.show = true;
    setParentGroupState(groupMap, item);

    menu.forEach(o => {
        const { _id, parent_id, type } = o;
        const parentGroup = groupMap[parent_id];

        if (parentGroup) {
            o.show = parentGroup.open;
            parentGroup._ids.push(_id);
        }
        if (type === ITEM && o._id === item._id) o.selected = true;
    });

    return { groupMap, menu };
}

function setAttributeDetails(req, item) {
    const metadata = req.app.locals.metadata
        , UNITS = { // see definition in lib/js/search/src/constants.js
        angstroms: 'Å'
        , angstroms_cubed_per_dalton: 'Å³/Da'
        , angstroms_squared: 'Å²'
        , kelvins: 'K'
        , kilodaltons: 'kDa'
        , kilojoule_per_mole: 'kJ/mol'
        , megahertz: 'MHz'
        , daltons: 'Da'
        , degrees: '°'
        , nanomole: 'nM'
        , per_mole: 'M\u207B\u00B9' // unicode <sup>-1</sup> - TODO replace other unicode chars with unicode equivalent
    }
        , attributeDetails = {
        schemas: [
            { schema_name: 'structure', headers: [] }
            , { schema_name: 'chemical', headers: [] }
        ]
    };

    //u.logJson(metadata.structure, 'setAttributeDetails: metadata.structure')

    attributeDetails.schemas.forEach(schema => {
        const { headers, schema_name } = schema;

        schema.display_name = schema_name.substring(0, 1).toUpperCase() + schema_name.substring(1) + ' Attributes';
        const selectorItems = metadata[schema_name].selectorItems;

        selectorItems.forEach(si => {
            if (si.type === 'header') {
                headers.push({ name: si.name, attributes: [] });
            } else {
                const attrObj = metadata[schema_name].uiAttrMap[si.attribute]; // attrObj from metadata, where 'name' is schema name

                if (attrObj) {
                    const { attribute, description, type } = attrObj
                        , obj = { attribute, description, type };

                    obj.name = si.name;

                    if (si.type === 'item-nested') {

                        let { nested_attribute, nested_attribute_value, units, range } = si;

                        // assign values from selectorItem
                        obj.nested_attribute = nested_attribute;

                        if (units) obj.units = UNITS[units];
                        if (range) {
                            obj.min = range.min;
                            obj.max = range.max;
                        }

                        const { nestedAttribute } = attrObj
                            , context = nestedAttribute.contexts[nested_attribute_value]
                            , { detail, examples } = context;

                        // these values are not available in selectorItem, so assign from attrObj
                        if (detail) obj.detail = detail;
                        if (examples) obj.examples = examples;

                    } else {
                        const { units, examples, enumeration, is_iterable } = attrObj;
                        let { min, max } = attrObj;

                        if (units) obj.units = UNITS[units];
                        if (examples) obj.examples = examples;
                        if (enumeration) obj.enumeration = enumeration;
                        if (is_iterable) obj.is_iterable = is_iterable;

                        // check min, max for 0 otherwise they will not display in ui
                        if (typeof min !== 'undefined' && typeof max !== 'undefined') {
                            obj.min = '' + min;
                            obj.max = '' + max;
                        }
                    }

                    headers[headers.length - 1].attributes.push(obj);
                }
            }
        });
    });

    item.attributeDetails = attributeDetails;
    item.lastUpdatedStr = metadata['structure'].lastReleaseDate.long;
}

// Set parent group state for rendering
function setParentGroupState(groupMap, o) {
    if (o.show) {
        const parent = groupMap[o.parent_id];
        if (parent) {
            parent.open = true;
            parent.show = true;
            setParentGroupState(groupMap, parent);
        }
    }
}

// Export all functions using CommonJS
module.exports = {
    setContentUrl,
    getContentUrl,
    fetchLastUpdated,
    fetchIndex,
    fetchItem,
    processItem,
    getEnv,
    initializeIndex,
    getItem,
    getFirstItemHref,
    setIndex,
    rootToIndex,
    getIndexObj,
    getMenuPath,
    returnData,
    getMenuObj,
    setAttributeDetails,
    setParentGroupState,
};
