import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box, Text } from '@contco/core-ui';
import { CategoryDropDown } from './CategoryDropDown';
import { ADD_CIRCLE } from '../../Icons';

const AGORA_TITLE = 'Tefi DAgora';
const AGORA_DESCRIPTION = 'A Decentralized Forum On Terra Classic!';

const AgoraTitle = styled(Text)`
  ${css({
    textAlign: 'center',
    width: '100%',
    color: 'secondary',
    fontSize: 2,
    fontWeight: 'bold',
    py: 3,
    borderTop: '1px solid',
    borderBottom: '1px solid',
    borderColor: 'divider',
    display: ['inherit', null, null, null, null, null, null, 'none'],
  })}
`;

const SubSection = styled(Flex)`
  ${css({
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid',
    borderColor: 'divider',
    p: 3,
    mr: 2,
  })}
`;

const AgoraDescription = styled(Text)`
  ${css({
    textAlign: 'center',
    color: 'secondary',
    fontSize: 3,
    fontWeight: 'bold',
    py: 3,
    display: ['none', null, null, null, null, null, null, 'initial'],
  })}
`;

const AddPostIcon = styled(ADD_CIRCLE)`
  ${css({
    color: 'secondary',
    cursor: 'pointer',
    transform: ['scale(1.1)', null, null, null, null, null, null, 'scale(1.5)'],
    '&:hover': {
      opacity: 0.7,
    },
    transition: '0.3s',
  })}
`;
export const SubHeader = ({ selectedCategory, setCategory }) => {
  return (
    <Box>
      <AgoraTitle>{AGORA_TITLE}</AgoraTitle>
      <SubSection>
        <AgoraDescription>{AGORA_DESCRIPTION}</AgoraDescription>
        <CategoryDropDown selectedCategory={selectedCategory} setCategory={setCategory} />
        <AddPostIcon />
      </SubSection>
    </Box>
  );
};
