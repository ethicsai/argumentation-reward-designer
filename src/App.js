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
import { SnackbarProvider } from "notistack";

import 'reactflow/dist/style.css';
import NodeSidePanel from "./components/NodeSidePanel";
import ImportExportPanel from "./components/ImportExportPanel";
import SaveLoadPanel from "./components/SaveLoadPanel";
import CustomNode from "./components/CustomNode";


const nodeTypes = {
  default: CustomNode,
};

const initialNodes = [
];

const initialEdges = [
];

function App() {

  // We want to keep `setNodes` even though we do not use it, because it is clearer.
  // eslint-disable-next-line
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
        <SnackbarProvider maxSnack={3}>
          <div id="main-column" style={{flex: 8}}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              nodeTypes={nodeTypes}
            >
              <Controls/>
              <Background variant="dots" gap={12} size={1}/>
            </ReactFlow>
          </div>
          <div id="sidebar-column" style={{flex: 2}}>
            <NodeSidePanel/>
            <ImportExportPanel/>
            <SaveLoadPanel/>
          </div>
        </SnackbarProvider>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
