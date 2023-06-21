/*
  This component is used to show the "Import/Export" side panel, used to
  export the graph (nodes and edges) to JSON / Python / PNG, and import
  graphs from the same formats.
 */

import { useReactFlow } from "reactflow";
import {
  exportToPython,
  exportToJson,
  exportToPng,
  importFromJson,
  importFromPython,
  importFromPng,
} from "../serialization";


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

  const onClickExportToJSON = (params) => {
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();

    const serialized = exportToJson(nodes, edges);
    downloadFile(serialized, 'application/json', 'judge.json');
  };

  const onClickExportToPython = (params) => {
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();
    const addJson = true; // TODO: create a checkbox

    const code = exportToPython(nodes, edges, addJson);
    downloadFile(code, 'application/python', 'judge.py');
  };

  const onClickExportToPng = (params) => {
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
      <h3>Import / Export graph</h3>

      <button onClick={onClickExportToJSON}>Export graph to JSON...</button>
      <br />

      <button onClick={onClickExportToPython}>Export graph to Python...</button>
      <br />

      <button onClick={onClickExportToPng}>Export graph to PNG...</button>
      <br />
      <br />

      <label>
        Import from file (JSON, Python, PNG):
        <br />
        <input
          type="file"
          name="import_file"
          onChange={onClickImport}
          accept=".json,.py,.png,application/json,application/python,imge/png"
        />
      </label>
      <br />
    </div>
  );

}

export default ImportExportPanel;
