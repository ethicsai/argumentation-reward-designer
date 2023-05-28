/*
 This component is used to show the "side panel" (lateral bar) to modify
 and create Nodes.
 */

import './NodeSidePanel.css';
import {
  useOnSelectionChange,
  useReactFlow
} from "reactflow";
import { useState } from "react";
import {
  createNewNode,
  duplicateNode
} from "../nodes";

function NodeSidePanel({ onClickUpdate }) {

  const reactFlowInstance = useReactFlow();

  const [selectedNode, setSelectedNode] = useState(null);
  const [name, setName] = useState(selectedNode?.data?.label ?? "");
  const [desc, setDesc] = useState(selectedNode?.data?.desc ?? "");
  const [code, setCode] = useState(selectedNode?.data?.code ?? "");
  const [decision, setDecision] = useState(selectedNode?.data?.decision ?? "");

  const formTitle = (selectedNode === null) ? 'Node creation' : 'Update node ' + selectedNode.id;

  // // FIXME: this triggers two re-renders of this component when selecting a node.
  useOnSelectionChange({
    onChange: ({ nodes }) => {
      let newSelectedNode = null;
      // We only want to use an existing node in the form if a single node
      // is selected.
      // Otherwise (`newSelectedNode` remains `null`), we reset the form to
      // the default value.
      if (nodes.length === 1) {
        newSelectedNode = nodes[0];
      }
      setSelectedNode(newSelectedNode);
      setName(newSelectedNode?.data?.label ?? "");
      setDesc(newSelectedNode?.data?.desc ?? "");
      setCode(newSelectedNode?.data?.code ?? "");
      setDecision(newSelectedNode?.data?.decision ?? "");
    }
  });

  const onClickNewNode = (params) => {
    // TODO: validate the form:
    //   - name must not be empty;
    //   - name must not already exist in the list of nodes;
    //   - at least one of the radio buttons must be checked.

    createNewNode(reactFlowInstance, name, desc, code, decision);
  }

  const onClickUpdateNode = (params) => {
    // Using the `reactFlowInstance.setNodes` does not seem to work...
    // Instead, we rely on a callback provided by the parent component,
    // which internally calls the `setNodes` directly from the `useInitialNodes`.
    onClickUpdate(selectedNode, name, desc, code, decision);
  }

  const onClickDuplicateNode = (params) => {
    duplicateNode(reactFlowInstance, selectedNode);
  }

  return (
    <div className="node-side-panel">
      <h3>{formTitle}</h3>

      <label>
        Name:
        <br />
        <input
          type="text"
          id='new-node-name'
          name="name"
          placeholder="Short and unique identifier"
          onChange={ (event) => setName(event.target.value) }
          value={name}
        />
      </label>
      <br />
      <br />

      <label>
        Description:
        <br />
        <input
          type="text"
          id='new-node-desc'
          name="desc"
          placeholder="Long human-readable description"
          onChange={ (event) => setDesc(event.target.value) }
          value={desc}
        />
      </label>
      <br />
      <br />

      <label>
        Activation function:
        <br />
        <input
          type="text"
          id='new-node-lambda'
          name="lambda"
          placeholder="Lambda expression for aliveness"
          onChange={ (event) => setCode(event.target.value) }
          value={code}
        />
      </label>
      <br />
      <br />

      Supporting / countering:
      <br />
      <input
        type="radio"
        id="support"
        name="decision"
        value="support"
        onChange={ (event) => setDecision(event.target.value) }
        checked={ decision === "support" }
      />
      <label htmlFor="support">Support (moral)</label>
      <br />
      <input
        type="radio"
        id="counter"
        name="decision"
        value="counter"
        onChange={ (event) => setDecision(event.target.value) }
        checked={ decision === "counter" }
      />
      <label htmlFor="counter">Counter (immoral)</label>
      <br />
      <input
        type="radio"
        id="neutral"
        name="decision"
        value=""
        onChange={ (event) => setDecision(event.target.value) }
        checked={ (decision ?? "") === "" }
      />
      <label htmlFor="neutral">Neutral</label>
      <br />
      <br />

      {!selectedNode && <button onClick={onClickNewNode} >Add new node</button>}
      {selectedNode && <button onClick={onClickUpdateNode}>Update node</button>}
      {selectedNode && <button onClick={onClickDuplicateNode}>Duplicate node</button>}
    </div>
  );

}

export default NodeSidePanel;
