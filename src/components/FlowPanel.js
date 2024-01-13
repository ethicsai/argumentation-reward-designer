/*
  This is the ReactFlow component: it shows the argumentation graph, and
  its toolbar.
 */


import React, { useCallback } from "react";
import ReactFlow, {
  addEdge, Background, Controls, useEdgesState, useNodesState
} from "reactflow";
import 'reactflow/dist/style.css';
import CustomNode from "./CustomNode";


export default function FlowPanel() {

  const nodeTypes = {
    default: CustomNode,
  };

  // eslint-disable-next-line
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((newEdge) => {
    // We want a marker at the end of an edge to indicate the attack direction.
    newEdge.markerEnd = {
      type: 'arrowclosed',
    };
    setEdges((eds) => addEdge(newEdge, eds))
  }, [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      nodeTypes={nodeTypes}
    >
      <Controls />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  )
};
