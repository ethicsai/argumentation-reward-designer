/*
  This component is used to show the "Import/Export" side panel, used to
  export the graph (nodes and edges) to JSON / Python / PNG, and import
  graphs from the same formats.
 */

import { useState } from "react";
import { useReactFlow } from "reactflow";
import {
  exportToPython,
  exportToJson,
  exportToPng,
  importFromJson,
  importFromPython,
  importFromPng,
} from "../serialization";
import {
  Button, Checkbox, FormControlLabel, Typography
} from "@mui/material";
import {
  FileDownload, FileUpload
} from "@mui/icons-material";
import {
  CustomizedAccordion, CustomizedAccordionDetails, CustomizedAccordionSummary
} from "./Accordion";
import DropdownButton from "./DropdownButton";


/*
  Download a file to the user's device.
  `content` is the content of the file to download (a text).
  `contentType` is the MIME type, e.g., `application/python`.
  `fileName` is the desired name of the file.

  This is inspired from:
  https://stackoverflow.com/questions/66078335/how-do-i-save-a-file-on-my-desktop-using-reactjs
 */
function downloadFile(content, contentType, fileName) {
  const blob = new Blob([content], {type: contentType});
  const a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.addEventListener('click', (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30*1000);
  });
  a.click();
}


function ImportExportPanel() {

  const reactFlowInstance = useReactFlow();

  const [shouldExportJson, setShouldExportJson] = useState(true);

  const onClickExportToJSON = () => {
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();

    const serialized = exportToJson(nodes, edges);
    downloadFile(serialized, 'application/json', 'judge.json');
  };

  const onClickExportToPython = () => {
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();

    const code = exportToPython(nodes, edges, shouldExportJson);
    downloadFile(code, 'application/python', 'judge.py');
  };

  const onClickExportToPng = () => {
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();

    exportToPng(nodes, edges).then( png => {
      downloadFile(png, 'image/png', 'judge.png');
    });
  }

  const onClickImport = (event) => {
    if (event.target.files.length === 0) {
      // No file was selected, do nothing
      return;
    }
    const file = event.target.files[0];

    const fileTypesToImportFunction = {
      'application/json': importFromJson,
      'application/python': importFromPython,
      'text/x-python-script': importFromPython,
      'image/png': importFromPng,
    }
    const importFunction = fileTypesToImportFunction[file.type];
    if (importFunction === undefined) {
      // Unrecognized file type
      return;
    }

    importFunction(file).then( ({ nodes, edges }) => {
      reactFlowInstance.setNodes(nodes);
      reactFlowInstance.setEdges(edges);
    });
  }

  return (
    <div className="import-export-panel">
      <CustomizedAccordion expanded={false}>
        <CustomizedAccordionSummary
          aria-controls="import-panel-content"
          id="import-panel-header"
        >
          <Typography variant="h6">
            Import / export graph
          </Typography>
        </CustomizedAccordionSummary>
        <CustomizedAccordionDetails>
          <FormControlLabel
            control={
              <Checkbox
                checked={shouldExportJson}
                onChange={(event) => setShouldExportJson(!shouldExportJson)}
              />
            }
            label="Include JSON in exports"
          />
          <DropdownButton
            startIcon={<FileDownload />}
            buttonTitle="Export to Python"
            menuItems={[
              {
                label: 'Export to PNG',
                disabled: false,
                onClick: (event, index, item) => onClickExportToPng()
              },
              {
                label: 'Export to JSON',
                disabled: false,
                onClick: (event, index, item) => onClickExportToJSON()
              },
            ]}
            handleClick={(event, index, item) => onClickExportToPython()}
          />
          <br />
          <br />
          <Button
            variant="outlined"
            component="label"
            startIcon={<FileUpload />}
          >
            Import from file
            <input
              type="file"
              style={{
                clip: 'rect(0 0 0 0)',
                clipPath: 'inset(50%)',
                height: 1,
                overflow: 'hidden',
                position: 'absolute',
                bottom: 0,
                left: 0,
                whiteSpace: 'nowrap',
                width: 1,
              }}
              onChange={onClickImport}
              accept=".json,.py,.png,application/json,application/python,imge/png"
            />
          </Button>
        </CustomizedAccordionDetails>
      </CustomizedAccordion>
    </div>
  );

}

export default ImportExportPanel;
