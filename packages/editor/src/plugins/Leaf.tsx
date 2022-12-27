import * as React from 'react';
import { Text } from 'slate';
import { Code, defaultPlaceholderStyles } from './LeafStyle';

interface PlaceholderLeaf extends Text {
  placeholder?: string;
}
interface CustomLeafProps {
  children: any;
  leaf: PlaceholderLeaf;
  text: Text;
  attributes: {
    'data-slate-leaf': true;
  };
  placeholderStyles?: any;
}

const Leaf: React.FC<CustomLeafProps> = ({ attributes, children, leaf, placeholderStyles }) => {
  let child = children;
  if (leaf.bold) {
    child = <strong>{child}</strong>;
  }
  if (leaf.code) {
    child = <Code>{child}</Code>;
  }
  if (leaf.italic) {
    child = <em>{child}</em>;
  }
  if (leaf.underlined) {
    child = <u>{child}</u>;
  }
  if (leaf.placeholder) {
    return (
      <span {...attributes}>
        <span contentEditable={false} style={{ ...placeholderStyles, ...defaultPlaceholderStyles }}>
          {leaf.placeholder}
        </span>
        <span data-slate-zero-width="n" data-slate-length="0">
          &#65279;
          <br />
        </span>
      </span>
    );
  }
  return <span {...attributes}>{child}</span>;
};

export default Leaf;
