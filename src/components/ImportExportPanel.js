/*
  This component is used to show the "Import/Export" side panel, used to
  export the graph (nodes and edges) to JSON / Python / PNG, and import
  graphs from the same formats.
 */

import {
  getRectOfNodes,
  getTransformForBounds,
  useReactFlow
} from "reactflow";
import exportToPython from "../python_export";
import {toBlob} from "html-to-image";

const Buffer = require('buffer/').Buffer;
const pngExtract = require('png-chunks-extract');
const pngEncode = require('png-chunks-encode');
const pngText = require('png-chunk-text');


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

    const serialized = JSON.stringify({ nodes, edges });
    downloadFile(serialized, 'application/json', 'judge.json');
  };

  const onClickExportToPython = (params) => {
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();

    const code = exportToPython(nodes, edges);
    downloadFile(code, 'application/python', 'judge.py');
  };

  const onClickExportToPng = (params) => {
    // Variables for the PNG itself
    const imageWidth = 1024;
    const imageHeight = 768;
    const nodes = reactFlowInstance.getNodes();
    const nodesBounds = getRectOfNodes(nodes);
    const nodesTransforms = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 1.0, 1.0);

    // Variables for the argumentation graph embedded within the PNG
    const edges = reactFlowInstance.getEdges();
    const graphSerialized = JSON.stringify({ nodes, edges });

    toBlob(document.querySelector('.react-flow__viewport'), {
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${nodesTransforms[0]}px, ${nodesTransforms[1]}px) scale(${nodesTransforms[2]})`,
      },
      type: 'image/png',
    }).then( (pngBlob) => {
      return pngBlob.arrayBuffer();
    }).then( (pngBuffer) => {
      pngBuffer = Buffer.from(pngBuffer);
      let chunks = pngExtract(pngBuffer);
      const newChunk = pngText.encode('argumentation-graph', graphSerialized);
      // Add the new chunk just before the end of the PNG file
      chunks.splice(-1, 0, newChunk);
      pngBuffer = pngEncode(chunks);
      downloadFile(pngBuffer, 'image/png', 'judge.png');
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
    </div>
  );

}

export default ImportExportPanel;
