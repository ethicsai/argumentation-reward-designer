/*
  This file defines some manipulations on nodes:
  - Adding new nodes.
  - Duplicating nodes.
  - Updating an existing node.
 */

import { randomJitter } from "./utils/random";

const defaultX = 100;
const defaultY = 100;


function createNewNode(reactFlowInstance, name, desc, code, decision) {

  // TODO: maybe use directly the node name as the id?
  // => ensures unicity of names
  // => easier to serialize the edges (`source` and `target` will refer to names
  //    directly, instead of having to find the node with correct id...)
  // => but need to make sure we update the edges if the name is updated
  //    (i.e., if we call `updateNode`)
  let newId = 0;
  for (const node of reactFlowInstance.getNodes()) {
    newId = Math.max(newId, Number(node.id));
  }
  newId += 1;

  const newNode = {
    id: String(newId),
    // type: 'default',
    position: {
      // We add some jitter around the default X/Y to avoid creating nodes at
      // the exact same position (thus hiding each other).
      x: defaultX + randomJitter(),
      y: defaultY + randomJitter(),
    },
    data: {
      label: name,
      name: name,
      desc: desc,
      code: code,
      decision: decision
    }
  }

  reactFlowInstance.addNodes(newNode);
}


function duplicateNode(reactFlowInstance, node) {
  // We must first create a new name to avoid having duplicates (names should
  // be unique). We simply append `-X` to the end of the name, where `X` is
  // incremented until no other name exists with the same name.
  // This means that we can duplicate a node `a` to get `a-1`, then re-duplicate
  // `a` again to get `a-2`, and so on.
  let newName = node?.data?.name ?? 'argument';
  const existingNames = new Set(reactFlowInstance.getNodes()
    .map(
      node => node?.data?.name ?? ""
    ).filter(
    name => name.startsWith(newName)
  ));
  let i;
  for (i = 1; existingNames.has(newName + '-' + i); ++i) {}
  // Create the new node with the exact same data, except for the name.
  createNewNode(reactFlowInstance,
    newName + '-' + i,
    node?.data?.desc,
    node?.data?.code,
    node?.data?.decision);
}


function updateNode(reactFlowInstance, nodeToUpdate, newName, newDesc, newCode, newDecision) {
  reactFlowInstance.setNodes((existingNodes) =>
    existingNodes.map((node) => {
      if (node.id === nodeToUpdate.id) {
        // We need to create a new object to notify ReactFlow about the change.
        node.data = {
          ...node.data,
          label: newName,
          name: newName,
          desc: newDesc,
          code: newCode,
          decision: newDecision
        };
      }
      return node;
    })
  );
}


export {
  createNewNode,
  duplicateNode,
  updateNode,
};
