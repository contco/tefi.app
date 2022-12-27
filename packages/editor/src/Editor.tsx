/* eslint no-underscore-dangle:off */
import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { createEditor, Node } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import { withHistory } from 'slate-history';
import { pipe } from '@udecode/slate-plugins';
import { differenceBy, differenceWith, isEmpty, isEqual } from 'lodash';
import isHotkey from 'is-hotkey';
import { HoveringToolBar, ToolBar } from './ToolBar';
import { withLinks } from './Helpers/LinkHelper';
import Element from './plugins/Element';
import Leaf from './plugins/Leaf';
import withBlockID from './plugins/withBlockID';
import serialize from './serialize/index';
import deserialize from './deserialize/index';
import { ADD, UPDATE, DELETE } from './constant/operations';
import EMPTY_NODE from './constant/emptyNode';
import { ToggleMark } from './Helpers/MarkHelper';
import HOTKEYS from './constant/HotKeys';

interface Props {
  data?: any;
  rawData?: any;
  onContentUpdate: (content: any) => void;
  initialData?: any;
  readOnly?: boolean;
  attributes?: any;
  element?: any;
  placeholder?: string;
  placeholderStyles?: any;
  className?: string;
  isHoveringToolBar?: boolean;
}

const Editor: (props: Props) => any = ({
  data,
  rawData,
  onContentUpdate,
  readOnly = false,
  placeholder = '',
  placeholderStyles = {},
  className,
  isHoveringToolBar = false,
}) => {
  const [editorData, setData] = useState(EMPTY_NODE);
  const withPlugins = [withReact, withHistory, withLinks, withBlockID] as const;
  const editor: any = useMemo(() => pipe(createEditor(), ...withPlugins), []);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} placeholderStyles={placeholderStyles} />, []);

  useEffect(() => {
    if (data && data?.length) {
      const initialData = deserialize(data);
      setData(initialData);
    } else if (rawData) {
      setData(rawData);
    }
  }, [data, rawData]);

  const sendContentToApp = (nodeData: any, operation: string, newNodes: any) => {
    if (!isEmpty(nodeData)) {
      const type = nodeData.length === 1 ? 'single' : 'multi';
      const activeObject = {
        data: serialize(nodeData),
        type,
        operation,
        newChildren: serialize(newNodes),
        raw: newNodes,
      };
      onContentUpdate(activeObject);
    }
  };

  const onChangeContent = (newData: any) => {
    const createdBlocks = differenceBy(newData, editorData, (item: Node) => item.id);
    if (!isEmpty(createdBlocks)) {
      sendContentToApp(createdBlocks, ADD, newData);
    }
    const deletedBlocks = differenceBy(editorData, newData, (item: Node) => item.id);
    sendContentToApp(deletedBlocks, DELETE, newData);
    const allModifiedBlocks = differenceWith(newData, editorData, isEqual);
    const updatedBlocks = differenceBy(allModifiedBlocks, createdBlocks, (item: Node) => item.id);
    sendContentToApp(updatedBlocks, UPDATE, newData);
    setData(newData);
  };

  const Listener = (event: any) => {
    Object.keys(HOTKEYS).forEach((key) => {
      if (isHotkey(key, event as any)) {
        event.preventDefault();
        const mark = HOTKEYS[key];
        ToggleMark(editor, mark);
      }
    });
  };

  return (
    <Slate editor={editor} value={editorData} onChange={(newValue: any) => onChangeContent(newValue)}>
      <Editable
        className={className}
        placeholder={placeholder}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={Listener}
        readOnly={readOnly}
      />
      {isHoveringToolBar ? <HoveringToolBar /> : <ToolBar />}
    </Slate>
  );
};

export default React.memo(Editor);
