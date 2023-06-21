import './App.css';

import React, { useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from 'reactflow';

import 'reactflow/dist/style.css';
import NodeSidePanel from "./components/NodeSidePanel";
import ImportExportPanel from "./components/ImportExportPanel";

const initialNodes = [
];

const initialEdges = [
];

function App() {

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((newEdge) => {
    // We want a marker at the end of an edge to indicate the attack direction.
    newEdge.markerEnd = {
      type: 'arrowclosed',
    };
    setEdges((eds) => addEdge(newEdge, eds))
  }, [setEdges]);

  const onClickUpdate = (currentNode, newName, newDesc, newCode, newDecision) => {
    setNodes((existingNodes) =>
      existingNodes.map((node) => {
        if (node.id === currentNode.id) {
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
  };

  return (
    <div id="container" style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <ReactFlowProvider>
        <div id="main-column" style={{ flex: 8 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
        <div id="sidebar-column" style={{ flex: 2 }}>
          <ImportExportPanel />
          <NodeSidePanel onClickUpdate={onClickUpdate} />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
