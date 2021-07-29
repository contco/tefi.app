import React from "react";
import styled from "styled-components";
import css from '@styled-system/css';
import {Flex, Text} from "@contco/core-ui";


const Container = styled(Flex)`
height: calc(100vh - 64px);
width: 100%;
justify-content: center;
align-items: center;
`;

const EmptyText = styled(Text)`
  font-size: 22px;
  letter-spacing: 2px;
  ${css({
      color: 'secondary',
  })}
`
const DEFAULT_MESSAGE = "Sorry! No Data Available";


const EmptyComponent = ({children, msg = DEFAULT_MESSAGE}: any) => {
    return (
        <>
        {children}
        <Container>
            <EmptyText>{msg}</EmptyText>
        </Container>
        </>
    )
}

export default EmptyComponent;