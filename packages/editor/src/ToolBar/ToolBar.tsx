import * as React from 'react';
import { useRef, useState, useEffect, createRef } from 'react';
import { Editor, Range } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { StyledMenu } from '../Helpers/HelperStyle';
import { BlockButton } from '../Helpers/BlockHelper';
import { MarkButton } from '../Helpers/MarkHelper';
import { LinkButton, insertLink } from '../Helpers/LinkHelper';
import { Menu, Portal, LinkInput } from '../Helpers/Helper';

// icons
import { ReactComponent as Bold } from '../assets/bold.svg';
import { ReactComponent as Coding } from '../assets/coding.svg';
import { ReactComponent as Italic } from '../assets/italic.svg';
import { ReactComponent as Link } from '../assets/link.svg';
import { ReactComponent as Quote } from '../assets/quote.svg';
import { ReactComponent as Underline } from '../assets/underline.svg';
import { ReactComponent as H1 } from '../assets/h1.svg';
import { ReactComponent as H2 } from '../assets/h2.svg';
// import { ReactComponent as CLEAR_FORMAT } from '../assets/clear_format.svg';

import { ReactComponent as numberList } from '../assets/numberList.svg';
import { ReactComponent as bulletlist } from '../assets/bulletList.svg';

const ICON_COLOR = '#b5b9c6';
export const FixedMenu: any = React.forwardRef(({ ...props }, ref: React.Ref<HTMLDivElement>) => (
  <StyledMenu ref={ref} {...props} />
));

export interface ToolBarProps {}

export const ToolBar: React.FC<ToolBarProps> = () => {
  const [isInput, setIsInput] = useState<boolean>(false);
  const [inputToolbarPosition, setInputToolbarPosition] = useState<any>({});
  const [selectedArea, setSelectedArea] = useState<any>({});
  const editor = useSlate();
  const { selection } = editor;
  let el: any;
  let rect: any;
  const ref = useRef();
  const refSelection = useRef();
  const inputMenuRef = useRef();
  const inputContainerRef = createRef<any>();

  useEffect(() => {
    if (isInput) {
      el = inputMenuRef.current;
      if (!el) {
        return;
      }
      el.style.opacity = 1;
      el.style.top = inputToolbarPosition.top;
      el.style.left = inputToolbarPosition.left;
    }
  });

  // tooltip reference
  useEffect(() => {
    el = refSelection.current;
    if (!el) {
      return;
    }
    if (
      !isInput &&
      (!selection ||
        !ReactEditor.isFocused(editor) ||
        Range.isCollapsed(selection) ||
        Editor.string(editor, selection) === '')
    ) {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection?.getRangeAt(0);
    rect = domRange?.getBoundingClientRect();
    el.style.opacity = 1;
    el.style.top = `${rect?.top + window.pageYOffset - el.offsetHeight + 70}px`;
    el.style.left = `${rect?.left + window.pageXOffset - el.offsetWidth / 2 + rect?.width / 2}px`;
    if (!isInput) {
      el.style.visibility = `hidden`;
      el.postion = `absolute`;
    }
  });

  const LinkButtonClick = () => {
    if (selection) {
      setSelectedArea(selection);
    }
    const domSelection = window.getSelection();
    const domRange = domSelection?.getRangeAt(0);
    rect = domRange?.getBoundingClientRect();
    const position = {
      top: `${rect?.top + window.pageYOffset - el.offsetHeight + 70}px`,
      left: `${rect?.left + window.pageXOffset - el.offsetWidth / 2 + rect?.width / 2 - 90}px`,
    };
    setInputToolbarPosition(position);
    setIsInput(true);
  };
  const handleInput = (e: any) => {
    if (e.key === 'Enter') {
      const val = e.target.value;
      editor.selection = selectedArea;
      insertLink(editor, val);
      setIsInput(false);
    }
    if (e.key === 'Escape') {
      setIsInput(false);
    }
  };

  return (
    <div>
      <FixedMenu ref={ref} style={{ padding: '7px 15px 6px' }}>
        <MarkButton format="bold" icon={Bold} iconColor={ICON_COLOR} />
        <MarkButton format="italic" icon={Italic} iconColor={ICON_COLOR} />
        <MarkButton format="underlined" icon={Underline} iconColor={ICON_COLOR} />
        <LinkButton showInput={LinkButtonClick} icon={Link} iconColor={ICON_COLOR} />
        <BlockButton format="heading-one" icon={H1} iconColor={ICON_COLOR} />
        <BlockButton format="heading-two" icon={H2} iconColor={ICON_COLOR} />
        <BlockButton format="block-quote" icon={Quote} iconColor={ICON_COLOR} />
        <MarkButton format="code" icon={Coding} iconColor={ICON_COLOR} />
        {/* <BlockButton format="clear-format" icon={CLEAR_FORMAT} iconColor={ICON_COLOR} /> */}
        <BlockButton format="numbered-list" icon={numberList} iconColor={ICON_COLOR} />
        <BlockButton format="bulleted-list" icon={bulletlist} iconColor={ICON_COLOR} />
      </FixedMenu>
      <Menu ref={refSelection} />
      {isInput ? (
        <Portal>
          <Menu ref={inputMenuRef}>
            <LinkInput
              onBlur={() => setIsInput(false)}
              autoFocus
              ref={inputContainerRef}
              type="text"
              onKeyDown={(e) => handleInput(e)}
            />
          </Menu>
        </Portal>
      ) : (
        ''
      )}
    </div>
  );
};
