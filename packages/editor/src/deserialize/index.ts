/* eslint-disable no-underscore-dangle */

const getNodeType = (blockType: string) => {
  switch (blockType) {
    case 'text':
      return 'paragraph';
    default:
      return blockType;
  }
};

const getChildNodes = (block: any) => {
  if (block && block.document) {
    const blockDocumentsList = block.document;
    const childNodes = blockDocumentsList.map((propertyBlock: any) => {
      const { properties, text } = propertyBlock;
      if ((properties !== undefined && properties.length === 0) || properties === undefined) {
        return { text };
      }
      let childObject: any = { text };
      properties.forEach((property: string) => {
        if (property === 'a') {
          childObject = {
            type: 'link',
            url: properties[1],
            children: [{ text }],
          };
        } else {
          switch (property) {
            case 'b':
              childObject.bold = true;
              break;
            case 'i':
              childObject.italic = true;
              break;
            case 'u':
              childObject.underlined = true;
              break;
            case 'code':
              childObject.code = true;
              break;
            default:
              break;
          }
        }
      });
      return childObject;
    });
    return childNodes;
  }
  return [];
};

const deserialization = (blockContentList: any) => {
  const deserializedContent = blockContentList.map((blockContent: any) => {
    const block = blockContent;
    if (block.type === 'numbered-list' || block.type === 'bulleted-list') {
      const listItem = block?.children.map((child: any) => {
        const children = getChildNodes(child);
        const type = getNodeType(child.type);
        return { id: child.id, type, children };
      });
      const type = getNodeType(block.type);
      return { id: block.id, type, children: listItem };
    }

    const children = getChildNodes(block);
    const type = getNodeType(block.type);
    return { id: block.id, type, children };
  });
  return deserializedContent;
};

export default deserialization;
