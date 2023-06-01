/*
  Escape text to use in Python literal strings, enclosed with single quotes
  (`'`). This means that we must escape single quotes, and backslashes.
 */
function escapeLiteralString(text) {
  return text.replaceAll("'", "\\'").replaceAll("\\", "\\\\");
}


function exportArgument(node) {
  // The name must exist, we must escape it, and enclose it within quotes.
  const name = `'${escapeLiteralString(node.data.name)}'`;

  // The desc may not exist; in this case we want to use `None`; otherwise, we
  // need to escape it, and to enclose it within single quotes (it is a string
  // literal).
  let desc;
  if (node?.data?.desc) {
    desc = `'${escapeLiteralString(node.data.desc)}'`;
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


function exportAttack(edge, nodesIdToName) {
  const attacker = nodesIdToName[edge.source];
  const attacked = nodesIdToName[edge.target];
  return `afdm.add_attack(attacker='${attacker}', attacked='${attacked}')`;
}


function exportToPython(nodes, edges) {

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
    nodesIdToName[node.id] = escapeLiteralString(node.data.name);
    code = code + exportArgument(node) + '\n';
  }

  code = code + '\n# Attacks\n\n';

  // 2. Transform all edges into attacks
  for (const edge of edges) {
    code = code + exportAttack(edge, nodesIdToName) + '\n';
  }

  // TODO: maybe we can print the JSON-serialized graph inside the Python file
  //  (as a comment, or a multi-line literal string perhaps?) so that we can
  //  reload this graph from the Python file easily?

  return code;
}

export default exportToPython;
