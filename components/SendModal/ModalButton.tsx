import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex } from '@contco/core-ui';
import { ButtonRound } from '../UIComponents';

const BottomContainer = styled(Flex)`
  ${(props) =>
    css({
      height: props.isSmallSize ? [60, null, null, 140] : [80, null, null, 160],
      justifyContent: 'center',
      alignItems: 'center',
    })}
`;
interface Props {
  onClick: () => void;
  className?: string;
  isSmallSize?: boolean;
  title: string;
}

export const ModalButton: React.FC<Props> = ({ onClick, className, isSmallSize, title }) => {
  return (
    <BottomContainer isSmallSize={isSmallSize}>
      <ButtonRound className={className} onClick={onClick}>
        {title}
      </ButtonRound>
    </BottomContainer>
  );
};
