import React, { FC, SVGProps, MouseEvent } from 'react';
import { useSlate, ReactEditor } from 'slate-react';
import { Editor, Transforms } from 'slate';
import { Button, Icon } from './Helper';
import { isMarkActive } from './MarkHelper';

const markFormats = ['bold', 'italic', 'underlined', 'link', 'code'];
const LIST_TYPES = ['numbered-list', 'bulleted-list'];

// is Block Active
const isBlockActive = (editor: ReactEditor, format: string) => {
  const [match]: any = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });
  return !!match;
};

// Toggle Block
export const ToggleBlock = (editor: ReactEditor, format: string) => {
  const isBActive = isBlockActive(editor, format);
  const selectedFormats = markFormats.filter((a) => isMarkActive(editor, a));
  const isList = LIST_TYPES.includes(format);

  if (format === 'clear-format') {
    selectedFormats.map((a) => Editor.removeMark(editor, a));

    Transforms.setNodes(editor, {
      type: 'paragraph',
    });
  }
  if (isBActive) {
    Transforms.setNodes(editor, {
      type: 'paragraph',
    });
  } else if (isList) {
    Transforms.setNodes(editor, {
      type: 'list-item',
    });
  } else {
    Transforms.setNodes(editor, {
      type: format,
    });
  }
  // Transforms.setNodes(editor, {
  //    type: isBActive ? 'paragraph' : isList ? 'list-item' : format,
  // });
  // I have chaned this nested ternary expression due to typescirpt error

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type as string),
    split: true,
  });

  // Transforms.setNodes(editor, {
  //   type: isBActive ? 'paragraph' : isList ? 'list-item' : format,
  // });

  if (!isBActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

// Block Button
interface BLockButtonProps {
  format: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  iconColor?: string;
}

export const BlockButton: (props: BLockButtonProps) => JSX.Element = ({ format, icon, iconColor = '#ffffff' }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event: MouseEvent) => {
        event.preventDefault();
        ToggleBlock(editor, format);
      }}
    >
      <Icon active={isBlockActive(editor, format)} svg={icon} color={iconColor} />
    </Button>
  );
};
