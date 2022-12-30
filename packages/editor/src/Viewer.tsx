/* eslint no-underscore-dangle: "off" */
import * as React from 'react';
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
  PROPERTY_BOLD,
  PROPERTY_ITALIC,
  PROPERTY_CODE,
  PROPERTY_UNDERLINED,
  PROPERTY_LINK,
} from './constant/propertyType';
import { HEADING1, HEADING2, TEXT, BLOCK_QUOTE, NUMBERED_LIST, BULLETED_LIST } from './constant/blockType';
import getShortLink from './utils/getShortLink';

interface ViewerProps {
  data: Array<Block>;
  className?: string;
}

const Viewer: (props: ViewerProps) => any = ({ data, className }) => {
  const renderProperty = (properties: string[], text: any) => {
    let textWithProperty = text;
    properties.forEach((p, index) => {
      switch (p) {
        case PROPERTY_BOLD:
          textWithProperty = <b> {textWithProperty} </b>;
          break;
        case PROPERTY_ITALIC:
          textWithProperty = <i> {textWithProperty} </i>;
          break;
        case PROPERTY_UNDERLINED:
          textWithProperty = <u> {textWithProperty} </u>;
          break;
        case PROPERTY_CODE:
          textWithProperty = <Code> {textWithProperty} </Code>;
          break;
        case PROPERTY_LINK:
          textWithProperty = (
            <Link href={properties[index + 1]} target="_blank">
              {' '}
              {textWithProperty}
              <LinkContainer>
                <Triangle />
                <Rectangle>{getShortLink(properties[index + 1])}</Rectangle>
              </LinkContainer>
            </Link>
          );
          break;
        default:
          textWithProperty = <span> {textWithProperty}</span>;
          break;
      }
    });
    return <span> {textWithProperty} </span>;
  };

  const renderBlock = () => {
    const render = data.map((block: Block) => {
      if (block.type === HEADING1) {
        return (
          <Heading1 key={block.id}>
            {block.document &&
              block.document.map((document: DocumentProperties) => (
                <span key={document.text}>
                  {document.properties !== undefined
                    ? renderProperty(document.properties, document.text)
                    : document.text}
                </span>
              ))}
          </Heading1>
        );
      }
      if (block.type === HEADING2) {
        return (
          <Heading2 key={block.id}>
            {block.document &&
              block.document.map((document: DocumentProperties) => (
                <span key={document.text}>
                  {document.properties !== undefined
                    ? renderProperty(document.properties, document.text)
                    : document.text}
                </span>
              ))}
          </Heading2>
        );
      }
      if (block.type === TEXT) {
        return (
          <Paragraph key={block.id}>
            {block.document &&
              block.document.map((document: DocumentProperties) => (
                <span key={document.text}>
                  {document.properties !== undefined
                    ? renderProperty(document.properties, document.text)
                    : document.text}
                </span>
              ))}
          </Paragraph>
        );
      }
      if (block.type === BLOCK_QUOTE) {
        return (
          <BlockQuote key={block.id}>
            {block.document &&
              block.document.map((document: DocumentProperties) => (
                <span key={document.text}>
                  {document.properties !== undefined
                    ? renderProperty(document.properties, document.text)
                    : document.text}
                </span>
              ))}
          </BlockQuote>
        );
      }
      if (block.type === NUMBERED_LIST) {
        return (
          <NumberList key={block.id}>
            {block &&
              block.children &&
              block.children.map(
                (b: any) =>
                  b.document &&
                  b.document.map((document: DocumentProperties) => (
                    <li key={document.text}>
                      {document.properties !== undefined
                        ? renderProperty(document.properties, document.text)
                        : document.text}
                    </li>
                  )),
              )}
          </NumberList>
        );
      }
      if (block.type === BULLETED_LIST) {
        return (
          <ul key={block.id}>
            {block &&
              block.children &&
              block.children.map(
                (b: any) =>
                  b.document &&
                  b.document.map((document: DocumentProperties) => (
                    <BulletList key={document.text}>
                      {document.properties !== undefined
                        ? renderProperty(document.properties, document.text)
                        : document.text}
                    </BulletList>
                  )),
              )}
          </ul>
        );
      }
      return null;
    });
    return render;
  };
  return <div className={className}>{renderBlock()}</div>;
};
export default Viewer;
