import React, { FC, SVGProps } from 'react';
import { useSlate } from 'slate-react';
import { Transforms, Editor, Range } from 'slate';
import { Button, Icon } from './Helper';

const isUrl = require('is-url');

// isLink Active
const isLinkActive = (editor: any) => {
  const [link]: any = Editor.nodes(editor, { match: (n) => n.type === 'link' });
  return !!link;
};

interface LinkButtonProps {
  icon: FC<SVGProps<SVGSVGElement>>;
  showInput: () => void;
  iconColor?: string;
}

export const LinkButton: (props: LinkButtonProps) => JSX.Element = ({ icon, showInput, iconColor = '#ffffff' }) => {
  const editor = useSlate();
  const active = isLinkActive(editor) !== undefined;
  return (
    <Button
      active={!active}
      onMouseDown={(event) => {
        event.preventDefault();
        showInput();
      }}
      reversed={false}
    >
      <Icon reversed active={!active} svg={icon} color={iconColor} />
    </Button>
  );
};

const unwrapLink = (editor: any) => {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === 'link' });
};
// link wrapper
const wrapLink = (editor: any, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

// with links
export const withLinks = (editor: any) => {
  const edit = editor;
  const { insertData, insertText, isInline } = editor;

  edit.isInline = (element: any) => {
    return element.type === 'link' ? true : isInline(element);
  };

  edit.insertText = (text: string) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };
  edit.insertData = (data: any) => {
    const text = data.getData('text/plain');
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };
  return edit;
};

// insert the link
export const insertLink = (editor: any, url: string) => {
  if (editor.selection) {
    if (isUrl(url)) wrapLink(editor, url);
    else wrapLink(editor, `https://${url}`);
  }
};
