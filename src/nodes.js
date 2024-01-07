/*
  This file defines some manipulations on nodes:
  - Adding new nodes;
  - Duplicating nodes.
 */

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
      x: defaultX,
      y: defaultY
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
  createNewNode(reactFlowInstance,
    node?.data?.name,
    node?.data?.desc,
    node?.data?.code,
    node?.data?.decision);
}

export {
  createNewNode,
  duplicateNode,
};
