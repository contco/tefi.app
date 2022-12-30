/* eslint-disable no-underscore-dangle */

const getParagraphText = (textNode: any) => {
  if ('type' in textNode && textNode.type === 'link') {
    return textNode.children[0].text;
  }
  return textNode.text;
};

const getParagraphProperties = (textNode: any) => {
  const properties = [];
  if ('type' in textNode && textNode.type === 'link') {
    properties.push('a', textNode.url);
  } else if (textNode.code) {
    properties.push('code');
  } else {
    if (textNode.bold) properties.push('b');
    if (textNode.italic) properties.push('i');
    if (textNode.underlined) properties.push('u');
  }
  return properties;
};

const getHeadingProperties = (textNode: any) => {
  const properties = [];
  if (textNode.italic) properties.push('i');
  if (textNode.underlined) properties.push('u');
  return properties;
};

const checkIdAndReturnBlock = (type: string, document: any, node: any) => {
  if (node.id) {
    return { id: node.id, type, document };
  }
  return { type, document };
};

const serializeParagraph = (paragraphNode: any, textType: string) => {
  const document = paragraphNode.children.map((childNodes: any) => {
    const text = getParagraphText(childNodes);
    const properties = getParagraphProperties(childNodes);
    return { text, properties };
  });
  const paragraphBlock = checkIdAndReturnBlock(textType, document, paragraphNode);
  return paragraphBlock;
};
const serializeListing = (lisitNode: any, listType: string) => {
  const children = [];
  const { id } = lisitNode;
  for (let i = 0; i < lisitNode.children.length; i += 1) {
    children.push(serializeParagraph(lisitNode.children[i], 'list-item'));
  }
  const listBlock = { id: '', children, type: listType };
  if (id) {
    listBlock.id = id;
  }
  return listBlock;
};
const serializeHeading = (headingNode: any, headingType: string) => {
  const document = headingNode.children.map((childNode: any) => {
    const properties = getHeadingProperties(childNode);
    return { text: childNode.text, properties };
  });
  const headingBlock = checkIdAndReturnBlock(headingType, document, headingNode);
  return headingBlock;
};

const serialize = (slateNodesList: any) => {
  const serializedBlocks = slateNodesList.map((node: any) => {
    switch (node.type) {
      case 'paragraph':
        return serializeParagraph(node, 'text');
      case 'block-quote':
        return serializeParagraph(node, 'block-quote');
      case 'numbered-list':
        return serializeListing(node, 'numbered-list');
      case 'bulleted-list':
        return serializeListing(node, 'bulleted-list');
      case 'heading-one':
      case 'heading-two':
        return serializeHeading(node, node.type);
      default:
        return serializeParagraph(node, 'text');
    }
  });
  return serializedBlocks;
};
export default serialize;
