import React, { useState, useEffect } from 'react';
import { Editor, Viewer, RawViewer } from 'editor';
import styled from 'styled-components';

const StyledEditor = styled(Editor)`
  height: 60vh;
  background-color: #fef9e7;
  overflow-y: auto;
`;

const StyledRawViewer = styled(RawViewer)`
  background-color: #f1f1f1;
`;

const App = () => {
  const [document, setDocument] = useState<any>(blockInitalValue1);
  const [rawContent, setRawContent] = useState<any>(null);

  useEffect(() => {
    setDocument(blockInitalValue2);
  }, []);

  const onContentUpdate = (content: any) => {
    setRawContent(content.raw);
  };
  console.log('document--->', document);
  return (
    <>
      <div style={{ minHeight: 200 }}>
        <StyledEditor
          placeholder="Click anywhere to start typing"
          placeholderStyles={{ color: 'blue', fontWeight: 'bold' }}
          data={document}
          onContentUpdate={onContentUpdate}
        />
      </div>
      <Viewer data={document} />
      {rawContent ? <StyledRawViewer data={rawContent} /> : null}
    </>
  );
};
const blockInitalValue1 = [
  {
    id: '0',
    type: 'text',
    document: [
      {
        text: 'naa',
        properties: [],
      },
    ],
    createdBy: '',
  },
];
const blockInitalValue2 = [
  {
    id: '1',
    type: 'heading-one',
    document: [
      {
        text: '  Heading One',
        properties: ['i', 'u'],
      },
    ],
  },
  {
    id: '2',
    type: 'heading-two',
    document: [
      {
        text: '   Heading Two',
        properties: [],
      },
    ],
  },
  {
    id: '3',
    type: 'block-quote',
    document: [
      {
        text: 'What Goes Around Comes Around',
      },
    ],
  },
  {
    id: '4',
    type: 'text',
    document: [
      { text: '        This is editable, ', properties: [] },
      { text: 'rich ', properties: ['b'] },
      { text: 'text', properties: ['b', 'u'] },
      { text: ', much ', properties: ['b', 'i'] },
      { text: 'better than a' },
      { text: 'Hello World', properties: ['code'] },
      { text: 'link check', properties: ['a', 'https://google.com'] },
      { text: ' better than a' },
    ],
  },
  {
    id: '5',
    type: 'numbered-list',
    children: [
      {
        id: '6',
        type: 'list-item',
        document: [{ text: 'number list point 1', properties: [] }],
      },
      {
        id: '7',
        type: 'list-item',
        document: [{ text: 'number list point 2 ', properties: ['b'] }],
      },
    ],
  },
  {
    id: '8',
    type: 'bulleted-list',
    children: [
      {
        id: '9',
        type: 'list-item',
        document: [{ text: 'Bulleted list point 1', properties: [] }],
      },
      {
        id: '10',
        type: 'list-item',
        document: [{ text: 'Bulleted list point 2 ', properties: ['b'] }],
      },
    ],
  },
];

export default App;
