import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box, Text } from '@contco/core-ui';
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

const CategorySelect = styled(Flex)`
  ${css({
    position: 'relative',
    '&:hover': {
      opacity: 0.7,
    },
    transition: 'all 0.3s',
  })}
`;

const SelectedCategory = styled(Text)`
  ${css({
    p: 2,
    fontWeight: 'bold',
    fontSize: 0,
    border: '1px solid',
    borderColor: 'inputBorder',
    borderRadius: '25px',
    maxWidth: 120,
    cursor: 'pointer',
    textAlign: 'center',
    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
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
        <CategorySelect>
          <SelectedCategory>General</SelectedCategory>
        </CategorySelect>
        <AddPostIcon />
      </SubSection>
    </Box>
  );
};
