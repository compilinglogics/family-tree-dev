import FamilyTree from '@balkangraph/familytree.js';
import React, { useEffect } from 'react'
// import { Tree } from '@balkangraph/tree'; // Import the tree component
const BalkanTree = ({ members }) => {
    const transformDataToTree = (members) => {
        const nodes = {};
        const tree = [];
    
        members.forEach(member => {
            nodes[member.uid] = {
                id: member.uid,
                name: member.fullName,
                relation: member.relation,
                children: []
            };
        });
    
        members.forEach(member => {
            if (member.relation !== "self") {
                const parentId = member.addedBy; // Assuming addedBy links to the parent
                if (nodes[parentId]) {
                    nodes[parentId].children.push(nodes[member.uid]);
                }
            } else {
                tree.push(nodes[member.uid]);
            }
        });
    
        return tree;
    };
    useEffect(() => {
        const treeData = transformDataToTree(members);
        const tree = new FamilyTree({
            nodes: treeData,
            container: document.getElementById('tree-container')
        });

        // tree.render();
    }, [members]);

    return <div id="tree-container" style={{ width: '100%', height: '500px' }} />;
}

export default BalkanTree
