import React from "react";
import styled, { keyframes } from "styled-components";
import css from '@styled-system/css';
import { Flex, Text } from "@contco/core-ui";
import { REFRESH_ICON } from '../Icons';


const Container = styled(Flex)`
height: calc(100vh - 300px);
width: 100%;
justify-content: center;
align-items: center;
flex-direction: column;
`;

const EmptyText = styled(Text)`
  font-size: 22px;
  letter-spacing: 2px;
  ${css({
      textAlign:"center",
      lineHeight: '32px',
      color: 'secondary',
  })}
`;

export const RefreshIcon = styled(REFRESH_ICON)`
${css({
  transform: 'scale(1.6)',
  mt: 4,
  color: 'secondary',
  transition: 'opacity 0.3s',
  cursor: 'pointer',
})}
  &:hover {
    opacity: 0.7;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg) scale(1.6);
    
  }

  to {
    transform: rotate(360deg) scale(1.6);
  }
`;

export const AnimatedRefresh = styled(RefreshIcon)`
  animation: ${rotate} 2s infinite;
`;

const DEFAULT_MESSAGE = "Sorry! No Data Available";


const EmptyComponent = ({children, msg = DEFAULT_MESSAGE, refetch, error, refreshing}: any) => {

    const showRefetchIcon = () => {
        if(refreshing) {
            return <AnimatedRefresh />
        }
        if(error) {
          return <RefreshIcon onClick={refetch} />
        }
    };

    return (
        <>
        {children}
        <Container>
            <EmptyText>{msg}</EmptyText>
            {refetch ? showRefetchIcon() : null}
        </Container>
        </>
    )
}

export default EmptyComponent;