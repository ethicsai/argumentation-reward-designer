/*
 This component is used to show the "side panel" (lateral bar) to modify
 and create Nodes.
 */

import './NodeSidePanel.css';
import { useReactFlow } from "reactflow";

function NodeSidePanel() {

  const reactFlowInstance = useReactFlow();

  const defaultX = 100;
  const defaultY = 100;

  const onClickNewNode = (params) => {
    // TODO: validate the form:
    //   - name must not be empty;
    //   - name must not already exist in the list of nodes;
    //   - at least one of the radio buttons must be checked.
    const name = document.getElementById('new-node-name').value;
    const desc = document.getElementById('new-node-desc').value;
    const code = document.getElementById('new-node-lambda').value;
    const decision = document.querySelector('input[name=decision]:checked').value;

    const newNode = {
      id: name,
      position: {
        x: defaultX,
        y: defaultY
      },
      data: {
        label: name,
        desc: desc,
        code: code,
        decision: decision
      }
    }

    reactFlowInstance.addNodes(newNode);
  }

  return (
    <div className="node-side-panel">
      <h3>Node creation</h3>

      <label for="name">Name:</label>
      <br />
      <input
        type="text"
        id='new-node-name'
        name="name"
        placeholder="Short and unique identifier"
      />
      <br />
      <br />

      <label for="desc">Description:</label>
      <br />
      <input
        type="text"
        id='new-node-desc'
        name="desc"
        placeholder="Long human-readable description"
      />
      <br />
      <br />

      <label for="lambda">Activation function:</label>
      <br />
      <input
        type="text"
        id='new-node-lambda'
        name="lambda"
        placeholder="Lambda expression for aliveness"
      />
      <br />
      <br />

      <label for="decision">Supporting / countering:</label>
      <br />
      <input
        type="radio"
        id="support"
        name="decision"
        value="support"
      />
      <label htmlFor="support">Support (moral)</label>
      <br />
      <input
        type="radio"
        id="counter"
        name="decision"
        value="counter"
      />
      <label htmlFor="counter">Counter (immoral)</label>
      <br />
      <input
        type="radio"
        id="neutral"
        name="decision"
        value=""
        checked
      />
      <label htmlFor="neutral">Neutral</label>
      <br />
      <br />

      <button id='new-node-submit' onClick={onClickNewNode} >Add new node</button>
    </div>
  );

}

export default NodeSidePanel;
