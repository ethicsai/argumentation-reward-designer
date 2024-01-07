/*
 This component is used to show the "side panel" (lateral bar) to modify
 and create Nodes.
 */

import {
  useOnSelectionChange,
  useReactFlow
} from "reactflow";
import { useState } from "react";
import {
  createNewNode,
  duplicateNode
} from "../nodes";
import {
  Button, FormControl, FormControlLabel, FormHelperText, FormLabel,
  InputAdornment, Radio, RadioGroup, TextField, Typography
} from "@mui/material";
import {
  AddCircle, LibraryAdd, Update
} from "@mui/icons-material";
import {
  CustomizedAccordion, CustomizedAccordionDetails, CustomizedAccordionSummary
} from "./Accordion";

function NodeSidePanel({ onClickUpdate }) {

  const reactFlowInstance = useReactFlow();

  const [selectedNode, setSelectedNode] = useState(null);
  const [name, setName] = useState(selectedNode?.data?.label ?? "");
  const [desc, setDesc] = useState(selectedNode?.data?.desc ?? "");
  const [code, setCode] = useState(selectedNode?.data?.code ?? "");
  const [decision, setDecision] = useState(selectedNode?.data?.decision ?? "");

  // For form validation: describe the errors in these variables
  const [nameError, setNameError] = useState(undefined);
  const [decisionError, setDecisionError] = useState(undefined);

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
      // Also reset the error helpers.
      resetErrors();
    }
  });

  const validateForm = (currentNode) => {
    // The name must not be empty.
    if (name.trim() === "") {
      setNameError("Name must not be empty!")
      return false;
    }

    // The name must be unique.
    // Exception: when the current node is the `sameNameNode`, it is normal.
    const nodes = reactFlowInstance.getNodes();
    const sameNameNode = nodes.find(node => node?.data?.name === name);
    if (sameNameNode && sameNameNode.id !== currentNode?.id) {
      setNameError(`Node ${sameNameNode.id} already exists with that name!`);
      return false;
    }

    // The argument should have a (correct) decision
    if (!["support", "counter", ""].includes(decision)) {
      setDecisionError("One of the radio buttons must be checked!");
      return false;
    }

    return true;
  }

  const resetErrors = () => {
    setNameError(undefined);
    setDecisionError(undefined);
  }

  const onClickNewNode = (params) => {
    // If everything is OK, reset the error helpers, and create the new node.
    if (validateForm(undefined)) {
      resetErrors();
      createNewNode(reactFlowInstance, name, desc, code, decision);
    }
  }

  const onClickUpdateNode = (params) => {
    if (validateForm(selectedNode)) {
      resetErrors();
      // Using the `reactFlowInstance.setNodes` does not seem to work...
      // Instead, we rely on a callback provided by the parent component,
      // which internally calls the `setNodes` directly from the `useInitialNodes`.
      onClickUpdate(selectedNode, name, desc, code, decision);
    }
  }

  const onClickDuplicateNode = (params) => {
    duplicateNode(reactFlowInstance, selectedNode);
  }

  return (
    <div className="node-side-panel">
      <CustomizedAccordion expanded={true}>
        <CustomizedAccordionSummary
          aria-controls="node-panel-content"
          id="node-panel-header"
        >
          <Typography variant="h6">
            {formTitle}
          </Typography>
        </CustomizedAccordionSummary>
        <CustomizedAccordionDetails>
          <TextField
            id="new-node-name"
            required
            label="Name"
            helperText={nameError ?? "Short and unique identifier"}
            error={nameError !== undefined}
            margin="dense"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={ (event) => setName(event.target.value) }
            value={name}
          ></TextField>

          <TextField
            id="new-node-desc"
            multiline
            label="Description"
            helperText="Long human-readable description"
            margin="dense"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={ (event) => setDesc(event.target.value) }
            value={desc}
          ></TextField>

          <TextField
            id="new-node-lambda"
            multiline
            label="Activation function"
            helperText="Lambda expression for aliveness"
            InputProps={{
              startAdornment: <InputAdornment position="start">lambda s:</InputAdornment>,
            }}
            margin="dense"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={ (event) => setCode(event.target.value) }
            value={code}
          ></TextField>

          <FormControl error={decisionError !== undefined}>
            <FormLabel id="radio-buttons-group-label">Supporting / countering:</FormLabel>
            <RadioGroup
              aria-labelledby="radio-buttons-group-label"
              defaultValue="Neutral"
              name="decision"
              value={decision}
              onChange={ (event) => setDecision(event.target.value) }
              style={{
                'padding-left': '9px',
              }}
            >
              <FormControlLabel
                value="support"
                control={<Radio size="small" style={{padding: '2px 6px'}} />}
                label="Support (moral)"
              />
              <FormControlLabel
                value="counter"
                control={<Radio size="small" style={{padding: '2px 6px'}} />}
                label="Counter (immoral)"
              />
              <FormControlLabel
                value=""
                control={<Radio size="small" style={{padding: '2px 6px'}} />}
                label="Neutral"
              />
            </RadioGroup>
            <FormHelperText>{decisionError}</FormHelperText>
          </FormControl>

          {!selectedNode &&
            <Button
              variant="outlined"
              startIcon={<AddCircle />}
              onClick={onClickNewNode}
            >Add new node</Button>
          }
          {selectedNode &&
            <Button
              variant="outlined"
              startIcon={<Update />}
              onClick={onClickUpdateNode}
            >Update node</Button>
          }
          {selectedNode &&
            <Button
              variant="outlined"
              startIcon={<LibraryAdd />}
              onClick={onClickDuplicateNode}
            >Duplicate node</Button>
          }
        </CustomizedAccordionDetails>
      </CustomizedAccordion>
    </div>
  );

}

export default NodeSidePanel;
