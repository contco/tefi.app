import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box, Text } from '@contco/core-ui';
import { CategoryDropDown } from './CategoryDropDown';
import { ADD_CIRCLE } from '../../Icons';

const AGORA_TITLE = 'Tefi DAgora';

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

const AddPostIcon = styled(ADD_CIRCLE)`
  ${css({
    color: 'secondary',
    cursor: 'pointer',
    transform: 'scale(1.1)',
    '&:hover': {
      opacity: 0.7,
    },
    transition: '0.3s',
  })}
`;
export const SubHeader = () => {
  return (
    <Box>
      <AgoraTitle>{AGORA_TITLE}</AgoraTitle>
      <SubSection>
        <CategoryDropDown />
        <AddPostIcon />
      </SubSection>
    </Box>
  );
};
