import React from "react";
import styled from "styled-components";
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
`

const EmptyComponent = ({children}: any) => {
    return (
        <>
        {children}
        <Container>
            <EmptyText>Sorry! No Data Available</EmptyText>
        </Container>
        </>
    )
}

export default EmptyComponent;