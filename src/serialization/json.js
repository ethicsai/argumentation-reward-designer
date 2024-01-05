/**
 * Export an argumentation graph (nodes and edges) to JSON.
 * @param nodes The graph nodes, obtained via `reactFlowInstance.getNodes()`.
 * @param edges The graph edges, obtained via `reactFlowInstance.getEdges()`.
 * @param spacing (Optional) Boolean indicating whether to put spacing in
 *  the resulting JSON. Use `false` to create a compact representation,
 *  and `true` to create a human-readable representation.
 * @return {string} The JSON representation of the argumentation graph,
 *  as an object with only two child: `nodes` and `edges`.
 */
function exportToJson(nodes, edges, spacing = false) {
  const space = (spacing) ? 2 : null;
  return JSON.stringify({ nodes, edges }, null, space);
}


/**
 * Import an argumentation graph from a JSON file.
 * @param file The path to the file to read.
 * @return {Promise<any>} A promise that resolves to an object with two child
 *  (`nodes` and `edges`), parsed from the JSON representation.
 */
async function importFromJson(file) {
  const jsonSerialized = await file.text();
  return JSON.parse(jsonSerialized);
}


export {
  exportToJson,
  importFromJson,
};
