import { useState } from "react";
import { useReactFlow } from "reactflow";
import {
  addManualSave, deleteManualSave, getAllManualSaves,
} from "../serialization/local_storage";
import {
  CustomizedAccordion, CustomizedAccordionDetails, CustomizedAccordionSummary
} from "./Accordion";
import {
  Autocomplete, Button, createFilterOptions, TextField, Tooltip, Typography
} from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import { DeleteOutline, Refresh, Save } from "@mui/icons-material";
import {useSnackbar} from "notistack";


/**
 * Load the saves from the browser's local storage, and return an array.
 * @return Array of objects `{ label, type, save }`.
 */
function refreshSaves() {
  const newSaves = [];
  const savesInMemory = getAllManualSaves();
  for (const [name, save] of Object.entries(savesInMemory)) {
    newSaves.push({
      label: name,
      type: 'manual',
      save: save,
    });
  }
  return newSaves;
}


export default function SaveLoadPanel() {

  const reactFlowInstance = useReactFlow();
  const { enqueueSnackbar } = useSnackbar();

  const [saves, setSaves] = useState(refreshSaves());
  const [saveName, setSaveName] = useState(null);

  const filter = createFilterOptions({
    stringify: (option) => option.label,
  });

  const onChangeSaveName = (event, newValue) => {
    if (typeof newValue === 'string') {
      setSaveName({
        label: newValue,
        type: 'new',
      });
    } else if (newValue && newValue.inputValue) {
      setSaveName({
        label: newValue.inputValue,
        type: 'new',
      });
    } else {
      setSaveName(newValue);
    }
  }

  const filterOptions = (options, params) => {
    const filtered = filter(options, params);
    const { inputValue } = params;
    const isExisting = options.some(
      (option) => inputValue === option.label
    );
    // If it does not exist, add a custom option that suggests adding a new save
    if (inputValue !== "" && !isExisting) {
      filtered.push({
        label: `Create new ${inputValue}`,
        inputValue: inputValue,
        type: 'new',
      })
    }
    return filtered;
  }

  const onClickCreateSave = () => {
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();
    addManualSave(saveName.label, { nodes, edges });
    const message = saveName.type === "new" ? "Save successfully created" : "Save successfully updated";
    enqueueSnackbar(message, { variant: "success" });
    setSaves(refreshSaves());
  }
  const onClickLoadSave = () => {
    const { nodes, edges } = saveName.save;
    reactFlowInstance.setNodes(nodes);
    reactFlowInstance.setEdges(edges);
    enqueueSnackbar('Save successfully loaded', { variant: "success" });
  }
  const onClickDeleteSave = () => {
    deleteManualSave(saveName.label);
    enqueueSnackbar("Save successfully deleted", { variant: "success" });
    setSaves(refreshSaves());
  }

  return (
    <div className="save-load-panel">
      <CustomizedAccordion>
        <CustomizedAccordionSummary
          aria-controls="save-panel-content"
          id="save-panel-header"
        >
          <Tooltip title="Use this panel to save and load argumentation graphs
          in your browser memory, for example to keep working on it later.">
            <Typography variant="h6">
              Save / load
            </Typography>
          </Tooltip>
        </CustomizedAccordionSummary>
        <CustomizedAccordionDetails>
          <Autocomplete
            value={saveName}
            onChange={onChangeSaveName}
            options={saves}
            groupBy={(option) => option.type}
            filterOptions={filterOptions}
            getOptionLabel={(option) => {
              if (typeof option === 'string') {
                // An input entered by the user
                return option
              } else {
                // A "normal" option from the options list
                return option.label
              }
            }}
            freeSolo
            selectOnFocus
            // clearOnBlur
            handleHomeEndKeys
            renderInput={(params) =>
              <TextField
                {...params}
                label="Saves"
                placeholder="Type a new name to create a save"
              />
            }
          />
          <br />
          <ButtonGroup
            orientation="vertical"
          >
            <Button
              variant="outlined"
              startIcon={<Save />}
              disabled={!saveName || saveName.type === 'auto'}
              onClick={onClickCreateSave}
              style={{
                justifyContent: 'start',
              }}
            >
              {saveName && saveName.type !== 'new' ? "Overwrite save" : "Create new save"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              disabled={!saveName || saveName.type === 'new'}
              onClick={onClickLoadSave}
              style={{
                justifyContent: 'start',
              }}
            >
              Load save
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteOutline />}
              disabled={!saveName || saveName.type === 'new'}
              onClick={onClickDeleteSave}
              style={{
                justifyContent: 'start',
              }}
            >
              Delete save
            </Button>
          </ButtonGroup>
        </CustomizedAccordionDetails>
      </CustomizedAccordion>
    </div>
  );

}
