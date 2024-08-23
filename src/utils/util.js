// utils.js

export function getIndexObj(node, depth) {
    const { _id, href, name, parent_id, title, type } = node;
    return (type === 'group')
        ? { _id, depth, name, parent_id, type }
        : { _id, depth, href, parent_id, title, type };
}

export function getMenuObj(index, item) {
    const menu = JSON.parse(JSON.stringify(index)); // Deep clone
    const groupMap = {};
    const groups = menu.filter(o => o.type === 'group');

    groups.forEach(group => {
        group._ids = [];
        groupMap[group._id] = group;
        if (group.depth === 0) group.show = true; // Always show top-level groups
    });

    item.show = true; // Show this item
    setParentGroupState(groupMap, item);

    menu.forEach(o => {
        const { _id, parent_id, type } = o;
        const parentGroup = groupMap[parent_id];

        if (parentGroup) {
            o.show = parentGroup.open;
            parentGroup._ids.push(_id);
        }
        if (type === 'item' && o._id === item._id) o.selected = true; // Select this item
    });

    return { groupMap, menu };
}

export function setParentGroupState(groupMap, o) {
    if (o.show) {
        const parent = groupMap[o.parent_id];
        if (parent) {
            parent.open = true;
            parent.show = true;
            setParentGroupState(groupMap, parent);
        }
    }
}

export function getMenuPath(item, groupNameMap) {
    if (!item || !item._ids || !Array.isArray(item._ids)) {
        console.error("getMenuPath: Item or _ids is undefined or not an array", item);
        return '';
    }

    const menuPaths = item._ids.map(_id => groupNameMap[_id] || '');
    return menuPaths.filter(Boolean).join(' > ');
}

export function rootToIndex(root, depth, index, group_idMap, groupNameMap, hrefMap, item_idMap, parentIds = []) {
    if (root.id !== 'rcsb-documentation') {
        root.numNodes = root.nodes ? root.nodes.length : 0;
        const obj = getIndexObj(root, depth);
        obj._ids = [...parentIds];  // Assign parentIds to the _ids property
        index.push(obj);
    }

    if (root.nodes) {
        root.nodes.forEach(node => {
            node.href = root.path + node.id;
            console.log(`Setting href for node ${node._id}: ${node.href}`);
            if (node.type === 'group') {
                node.path = node.href + '/';
                group_idMap[node.href] = node._id;
                groupNameMap[node._id] = node.name;
                rootToIndex(node, depth + 1, index, group_idMap, groupNameMap, hrefMap, item_idMap, [...parentIds, node._id]);
            } else { // item
                hrefMap[node._id] = node.href;
                item_idMap[node.href] = node._id;
                const obj = getIndexObj(node, depth);
                obj._ids = [...parentIds];  // Assign parentIds to the _ids property
                index.push(obj);
            }
        });
    } else {
        console.log(`Node ${root._id} has no children.`);
    }
}

export function setIndex(data) {
    const index = [];
    const group_idMap = {};
    const groupNameMap = {};
    const hrefMap = {};
    const item_idMap = {};
    let root;

    const groups = data.filter(node => node.type === 'group');
    const groupMap = {};

    groups.forEach(group => {
        groupMap[group._id] = group;
    });

    data.forEach(node => {
        const { id, parent_id, type } = node;
        const group = groupMap[parent_id];

        if (type === 'group' && id === 'rcsb-documentation') {
            root = node;
            console.log("Root node found:", root);
        }

        if (group) {
            if (!group.nodes) group.nodes = [];
            group.nodes.push(node);
        }
    });

    if (root) {
        root.path = '/docs/';
        console.log("Root path set:", root.path);
        rootToIndex(root, -1, index, group_idMap, groupNameMap, hrefMap, item_idMap);
    } else {
        console.error("Root node not found!");
    }

    console.log("Final index:", index);
    console.log("hrefMap:", hrefMap);

    return { index, group_idMap, groupNameMap, hrefMap, item_idMap };
}


