import './App.css';

import React, { useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';

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

  let reactFlowInstance = null;

  const onClickNewNode = useCallback( (params) => {
    let name = document.getElementById('new-node-name').value;
    let desc = document.getElementById('new-node-desc').value;
    let code = document.getElementById('new-node-lambda').value;
    let decision = document.getElementById('new-node-decision').value;
    let node = { id: name, position: { x: 100, y: 100 }, data: { label: name, desc: desc, code: code, decision: decision }};
    reactFlowInstance.addNodes(node);
  }, [reactFlowInstance]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'inline-block' }}>
      <div style={{ width: '80%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={ (instance) => reactFlowInstance = instance }
        >
          <Controls />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
      <div style={{ width: '15%', height: '100%' }}>
        <input id='new-node-name' />
        <input id='new-node-desc' />
        <input id='new-node-lambda' />
        <input id='new-node-decision' />
        <button id='new-node-submit' onClick={onClickNewNode} >Add new node</button>
      </div>
    </div>
  );
}

export default App;
