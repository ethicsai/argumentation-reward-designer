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

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'First node' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Second node' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' }
];

function App() {

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

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
          <NodeSidePanel />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
