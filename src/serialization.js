import {
  getRectOfNodes,
  getTransformForBounds
} from "reactflow";
import { toBlob } from "html-to-image";
const Buffer = require('buffer/').Buffer;
const pngExtract = require('png-chunks-extract');
const pngEncode = require('png-chunks-encode');
const pngText = require('png-chunk-text');


/*
  Escape text to use in Python literal strings, enclosed with single quotes
  (`'`). This means that we must escape single quotes, and backslashes.
 */
function escapePythonLiteralString(text) {
  return text.replaceAll("'", "\\'").replaceAll("\\", "\\\\");
}


function exportArgumentToPython(node) {
  // The name must exist, we must escape it, and enclose it within quotes.
  const name = `'${escapePythonLiteralString(node.data.name)}'`;

  // The desc may not exist; in this case we want to use `None`; otherwise, we
  // need to escape it, and to enclose it within single quotes (it is a string
  // literal).
  let desc;
  if (node?.data?.desc) {
    desc = `'${escapePythonLiteralString(node.data.desc)}'`;
  } else {
    // Note that None is a string here in JS, but is not enclosed within quotes,
    // thus, when printed as Python code it will be the literal `None` value!
    desc = 'None';
  }

  // The code may not exist; in this case we want to use `None`. Otherwise,
  // it represents a lambda-expression, so we must prepend it with `lambda s:`.
  // No need to escape it, since it is not used as part of a literal. It is not
  // enclosed within quotes.
  let code;
  if (node?.data?.code) {
    code = `lambda s: ${node.data.code}`;
  } else {
    // Same here as for `desc`, this is the literal `None` value.
    code = 'None';
  }

  let decision = '';
  if (node?.data?.decision === 'support') {
    decision = 'support=[dec]';
  } else if (node?.data?.decision === 'counter') {
    decision = 'counter=[dec]';
  }

  return `
afdm.add_argument(Argument(
    ${name},
    ${desc},
    ${code},
    ${decision}
))`;
}


function exportAttackToPython(edge, nodesIdToName) {
  const attacker = nodesIdToName[edge.source];
  const attacked = nodesIdToName[edge.target];
  return `afdm.add_attack(attacker='${attacker}', attacked='${attacked}')`;
}


function exportToPython(nodes, edges, addJson = false) {

  let code = `
from .lib import AFDM, Argument

dec = 'moral'

afdm = AFDM()

# Arguments
`;

  // 1. Transform all nodes into arguments
  // We will need to access the nodes' name based on their ID when
  // iterating over the edges. Let us build a map for easier (and faster!)
  // access when iterating over nodes.
  let nodesIdToName = {};
  for (const node of nodes) {
    nodesIdToName[node.id] = escapePythonLiteralString(node.data.name);
    code = code + exportArgumentToPython(node) + '\n';
  }

  code = code + '\n# Attacks\n\n';

  // 2. Transform all edges into attacks
  for (const edge of edges) {
    code = code + exportAttackToPython(edge, nodesIdToName) + '\n';
  }

  if (addJson) {
    // Maybe we should strip the nodes and edges from their style attributes
    // (we do not care about them in this serialized form)?
    const serializedBlock = `
### BEGIN ARGUMENTATION GRAPH ###
# These lines represent the (JSON-serialized) argumentation graph, so that
# it can be imported into argumentation-reward-designer.
# DO NOT MODIFY.
# We use a multiline string so that it has no effect on the Python source code.
"""
${exportToJson(nodes, edges, true)}
"""
### END ARGUMENTATION GRAPH ###
`;
    code = code + serializedBlock;
  }

  return code;
}


const PNG_CHUNK_KEYWORD = 'judge-argumentation-graph';


/*
 * Export a graph (nodes and edges) to JSON.
 * The parameter `spacing` controls whether to use whitespace (and breaking lines).
 */
function exportToJson(nodes, edges, spacing = false) {
  const space = (spacing) ? 2 : null;
  return JSON.stringify({ nodes, edges }, null, space);
}


async function exportToPng(nodes, edges, imageWidth = 1024, imageHeight = 768) {
  // Variables for the PNG itself
  const nodesBounds = getRectOfNodes(nodes);
  const nodesTransforms = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 1.0, 1.0);

  // Variable for the argumentation graph embedded within the PNG
  const graphSerialized = exportToJson(nodes, edges, false);

  // Transform the ReactFlow Viewport into an image (returns a Blob).
  const pngBlob = await toBlob(document.querySelector('.react-flow__viewport'), {
    width: imageWidth,
    height: imageHeight,
    style: {
      width: imageWidth,
      height: imageHeight,
      transform: `translate(${nodesTransforms[0]}px, ${nodesTransforms[1]}px) scale(${nodesTransforms[2]})`,
    },
    type: 'image/png',
  });

  // The png-chunks-extract library requires a buffer instead of a Blob.
  let pngBuffer = await pngBlob.arrayBuffer();
  pngBuffer = Buffer.from(pngBuffer);
  // Extract all chunks from the PNG: this represents the internal code of the PNG.
  let chunks = pngExtract(pngBuffer);
  // We create a new chunk that contains the JSON-serialized graph, encoded for PNG.
  const newChunk = pngText.encode(PNG_CHUNK_KEYWORD, graphSerialized);
  // Add the new chunk just before the end of the PNG file.
  chunks.splice(-1, 0, newChunk);
  // Re-encode the PNG with the new chunks, and return it.
  pngBuffer = pngEncode(chunks);
  return pngBuffer;
}


function importFromJson(jsonSerialized) {
  return JSON.parse(jsonSerialized);
}


function importFromPython(pythonCode) {
  // The Python code contains a few lines that enclose the JSON-serialized
  // graph. We cannot directly import from the Python code itself, we must
  // retrieve this JSON serialization instead.
  const lines = pythonCode.split('\n');
  const startIndex = lines.indexOf('### BEGIN ARGUMENTATION GRAPH ###');
  const endIndex = lines.indexOf('### END ARGUMENTATION GRAPH ###');

  const startJsonIndex = lines.indexOf('"""', startIndex) + 1;
  const endJsonIndex = endIndex - 1;
  const jsonLines = lines.slice(startJsonIndex, endJsonIndex);

  return JSON.parse(jsonLines.join('\n'));
}


export {
  exportToPython,
  exportToJson,
  exportToPng,
  importFromJson,
  importFromPython,
};
