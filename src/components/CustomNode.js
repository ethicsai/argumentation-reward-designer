import { memo, useState } from 'react';
import {Position, NodeToolbar, Handle} from 'reactflow';


/*
  This function truncates the description to a maximum number of characters;
  if the description is longer, only the first `maxChars` characters are
  retained, and the others are replaced by `...` to indicate that there was
  an ellipsis. Otherwise, the description is kept as-is.
 */
function truncateDescription(description, maxChars = 30) {
  if (description.length > maxChars) {
    return description.slice(0, maxChars) + '...';
  } else {
    return description
  }
}


const CustomNode = ({ data }) => {

  const [isVisible, setVisible] = useState(false);

  const toolbarPosition = data.toolbarPosition || Position.Bottom;

  return (
    <div
      className='node'
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <NodeToolbar isVisible={isVisible} position={toolbarPosition}>
        <div className='node-tooltip'>
          <span className='node-tooltip-desc'>{data.desc}</span>
          <br />
        </div>
      </NodeToolbar>
      <div className='node'>
        <span className='node-name'>{data.label}</span>
        <br />
        <span className='node-desc'>{truncateDescription(data.desc)}</span>
        <br /><br />
        <span className='node-code'><code>{data.code}</code></span>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(CustomNode);
