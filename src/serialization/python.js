import { exportToJson } from './json';


/**
 * Escape text to use in Python literal strings.
 *
 * It escapes single quotes and backslashes, so that it does not break literal
 * strings enclosed with single quotes.
 * @param text The text to escape.
 * @return {string} The same text, with single quotes and backslashes escaped.
 */
function escapePythonLiteralString(text) {
  return text.replaceAll("'", "\\'").replaceAll("\\", "\\\\");
}


/**
 * Export an argument as Python code.
 * @param node The node representing the argument that we want to export.
 * @return {string} The Python code that will create this argument when executed.
 */
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


/**
 * Export an attack between two arguments as Python code.
 * @param edge The edge (attack) we want to export.
 * @param nodesIdToName The map between nodes id and their names, because the
 *  edges use only nodes' IDs, but we want to export the nodes' names in Python.
 * @return {string} The Python code that will create this attack when executed.
 */
function exportAttackToPython(edge, nodesIdToName) {
  const attacker = nodesIdToName[edge.source];
  const attacked = nodesIdToName[edge.target];
  return `afdm.add_attack(attacker='${attacker}', attacked='${attacked}')`;
}


/**
 * Export an argumentation graph to Python code.
 * @param nodes The graph nodes, obtained via `reactFlowInstance.getNodes()`.
 * @param edges The graph edges, obtained via `reactFlowInstance.getEdges()`.
 * @param addJson (Optional) Boolean indicating whether to include the
 *  JSON export to the Python code. It is used to allow importing back from
 *  the Python code, because it is easier to parse JSON than Python code.
 *  The JSON will be embedded in a multiline string that has no impact on
 *  the rest of the Python code.
 * @return {string} The textual representation of the Python code that will
 *  create the same argumentation graph when executed. This Python code relies
 *  on the AFDM library, and assumes it will be used.
 */
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


/**
 * Import an argumentation graph from a file containing Python code.
 *
 * This only works if the Python code was exported with the JSON representation
 * included (see parameter `addJson` in `exportToPython`.
 * @param file The path to the desired file.
 * @return {Promise<any>} A promise that will resolve to an object with two
 *  child (`nodes` and `edges`), parsed from the JSON embedded within the Python
 *  code.
 */
async function importFromPython(file) {
  const pythonCode = await file.text();
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
  importFromPython,
};
