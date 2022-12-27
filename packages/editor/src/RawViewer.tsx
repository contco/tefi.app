/* eslint no-underscore-dangle: "off" */
import * as React from 'react';
import { Node } from 'slate';
import { Code } from './plugins/LeafStyle';
import {
  Paragraph,
  BlockQuote,
  Link,
  LinkContainer,
  Triangle,
  Rectangle,
  Heading1,
  Heading2,
  NumberList,
  BulletList,
} from './plugins/ElementStyle';
import {
  HEADING1,
  HEADING2,
  PARAGRAPH,
  BLOCK_QUOTE,
  NUMBERED_LIST,
  BULLETED_LIST,
  CLEAR_FORMAT,
  LIST_ITEM,
} from './constant/blockType';
import getShortLink from './utils/getShortLink';

interface ViewerProps {
  data: Node[];
  className?: string;
}

const RawViewer: (props: ViewerProps) => any = ({ data, className }) => {
  const renderProperty = (leaf: any) => {
    let textWithProperty = leaf.text;
    if (leaf.type === 'link') {
      textWithProperty = leaf.children.map((subLeaf: any) => renderProperty(subLeaf));
      const link = (
        <span>
          <Link href={leaf.url} target="_blank">
            {' '}
            {textWithProperty}
            <LinkContainer>
              <Triangle />
              <Rectangle>{getShortLink(leaf.url)}</Rectangle>
            </LinkContainer>
          </Link>
        </span>
      );
      return link;
    }
    Object.keys(leaf).forEach((key) => {
      switch (key) {
        case 'bold':
          textWithProperty = <b> {textWithProperty} </b>;
          break;
        case 'italic':
          textWithProperty = <i> {textWithProperty} </i>;
          break;
        case 'underlined':
          textWithProperty = <u> {textWithProperty} </u>;
          break;
        case 'code':
          textWithProperty = <Code> {textWithProperty} </Code>;
          break;
        default:
          textWithProperty = <span> {textWithProperty}</span>;
          break;
      }
    });
    return <span> {textWithProperty} </span>;
  };

  const renderBlock = () => {
    const render = data.map((node: any) => {
      if (node.type === HEADING1) {
        return (
          <Heading1 key={node.id as string}>
            {node.children && node.children.map((leaf: any) => <span key={leaf.text}>{renderProperty(leaf)}</span>)}
          </Heading1>
        );
      }
      if (node.type === HEADING2) {
        return (
          <Heading2 key={node.id}>
            {node.children && node.children.map((leaf: any) => <span key={leaf.text}>{renderProperty(leaf)}</span>)}
          </Heading2>
        );
      }
      if (node.type === PARAGRAPH || node.type === CLEAR_FORMAT) {
        return (
          <Paragraph key={node.id}>
            {node.children && node.children.map((leaf: any) => <span key={leaf.text}>{renderProperty(leaf)}</span>)}
          </Paragraph>
        );
      }
      if (node.type === BLOCK_QUOTE) {
        return (
          <BlockQuote key={node.id}>
            {node.children && node.children.map((leaf: any) => <span key={leaf.text}>{renderProperty(leaf)}</span>)}
          </BlockQuote>
        );
      }
      if (node.type === NUMBERED_LIST) {
        return (
          <NumberList key={node.id}>
            {node.children.map((listItem: any) => {
              return <li key={listItem.id}>{listItem.children.map((leaf: any) => renderProperty(leaf))}</li>;
            })}
          </NumberList>
        );
      }
      if (node.type === BULLETED_LIST) {
        return (
          <ul key={node.id}>
            {node.children.map((listItem: any) => {
              return (
                <BulletList key={listItem.id}>{listItem.children.map((leaf: any) => renderProperty(leaf))}</BulletList>
              );
            })}
          </ul>
        );
      }
      if (node.type === LIST_ITEM) {
        return (
          <ul key={node?.id}>
            <li>{node.children.map((leaf: any) => renderProperty(leaf))}</li>
          </ul>
        );
      }
      return null;
    });
    return render;
  };
  return <div className={className}>{renderBlock()}</div>;
};
export default RawViewer;
