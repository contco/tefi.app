import { customAlphabet } from 'nanoid';

const withBlockID = (editor: any) => {
  const localEditor = editor;
  const { apply } = localEditor;
  localEditor.removedIDs = new Set();
  localEditor.apply = (operation: any) => {
    const nanoid = customAlphabet('1234567890', 18);
    const nanoID = nanoid();
    if (operation.type === 'insert_node' && operation.path.length === 1) {
      let idToUse = nanoID;
      if (localEditor.removedIDs.has(operation.id)) {
        idToUse = operation.properties.id;
        localEditor.removedIDs.delete(idToUse);
      }
      return apply({
        ...operation,
        node: { ...operation.node, id: idToUse },
      });
    }
    if (operation.type === 'split_node' && operation.path.length === 1) {
      let idToUse = nanoID;
      if (localEditor.removedIDs.has(operation.id)) {
        idToUse = operation.id;
        localEditor.removedIDs.delete(idToUse);
      }
      return apply({
        ...operation,
        properties: { ...operation.properties, id: idToUse },
      });
    }
    if (operation.type === 'split_node') {
      const idToUse = nanoID;
      return apply({
        ...operation,
        properties: { ...operation.properties, id: idToUse },
      });
    }
    if (operation.type === 'merge_node' && operation.path.length === 1) {
      localEditor.removedIDs.add(operation.properties.id);
      return apply(operation);
    }
    return apply(operation);
  };
  return localEditor;
};
export default withBlockID;
