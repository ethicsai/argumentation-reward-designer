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
import CustomNode from "./components/CustomNode";


const nodeTypes = {
  default: CustomNode,
};

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
            nodeTypes={nodeTypes}
          >
            <Controls />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
        <div id="sidebar-column" style={{ flex: 2 }}>
          <ImportExportPanel />
          <NodeSidePanel />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
