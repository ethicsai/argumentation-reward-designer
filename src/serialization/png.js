import {
  getRectOfNodes,
  getTransformForBounds
} from "reactflow";
import { toBlob } from "html-to-image";
import { exportToJson } from "./json";
const Buffer = require('buffer/').Buffer;
const pngExtract = require('png-chunks-extract');
const pngEncode = require('png-chunks-encode');
const pngText = require('png-chunk-text');


/**
 * Constant to use as a key for the JSON representation of the argumentation
 * graph within the PNG chunks. Because the PNG format stores chunks in a map,
 * we must ensure we use the key when exporting and importing to/from a PNG.
 */
const PNG_CHUNK_KEYWORD = 'judge-argumentation-graph';


/**
 * Export an argumentation graph to a PNG picture.
 *
 * The PNG shows the argumentation graph, as shown in the UI when designing it,
 * and also contains an embedded JSON representation that can be used to import
 * it back to the editor.
 * @param nodes The graph nodes, obtained via `reactFlowInstance.getNodes()`.
 * @param edges The graph edges, obtained via `reactFlowInstance.getEdges()`.
 * @param imageWidth (Optional) The image width, in pixels (default 1024).
 * @param imageHeight (Optional) The image height, in pixels (default 768).
 * @return {Promise<Uint8Array>} A promise that will resolve to the encoded
 *  PNG bytes, to be written to a file.
 */
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


/**
 * Import an argumentation graph from a PNG file.
 *
 * @param file The path to the desired file.
 * @return {Promise<any>} A promise that will resolve to an object with two
 *  child (`nodes` and `edges`), parsed from the JSON representation embedded
 *  within the PNG.
 */
async function importFromPng(file) {
  let pngBuffer = await file.arrayBuffer();
  pngBuffer = Buffer.from(pngBuffer);
  const chunks = pngExtract(pngBuffer);
  // We are interested in a single chunk, a textual one with a specific keyword
  const graphChunk = chunks
    .filter( (chunk) => chunk.name === 'tEXt')
    .map( (chunk) => pngText.decode(chunk.data) )
    .filter( (chunk) => chunk.keyword === PNG_CHUNK_KEYWORD);
  if (graphChunk.length === 0) {
    // We have not found the corresponding chunk, there is a problem!
    throw new Error('Could not find the argumentation graph in the PNG file!');
  }
  const graphJson = graphChunk[0].text;
  return JSON.parse(graphJson);
}


export {
  exportToPng,
  importFromPng,
};
