import { Wrapper, Row, AirdropHeading, Heading, Title, StyledText, ClaimButton } from "../dashboardStyles";
import { TransactionHeading, OvalShape, OvalContainer, TransactionContainer } from './style';
import {Flex,Box} from "@contco/core-ui";
const HEADING_TEXT = `Transaction History`
import transactions from './dummy.json';
import css from '@styled-system/css';
const arr = [1,2,3]

export interface TransactionProps { };

const Transaction: React.FC<TransactionProps> = () => {
    console.log(transactions)
    return (
        <Wrapper>
            <TransactionHeading>
                <Box>
                    <Heading>
                        {HEADING_TEXT}
                    </Heading>
                </Box>
                <OvalContainer>
                {arr.map(a=>
                 <OvalShape key={a}/>
                )}
                </OvalContainer>
            </TransactionHeading>
            {transactions.map(a => 
                <TransactionContainer key={a.type}>
                    <Flex justifyContent='space-between'>
                        <StyledText>{a.type}</StyledText>
                        <StyledText textAlign='right'>{a.date}</StyledText>
                    </Flex>
                    <Box>
                        <StyledText css={`${css({
                                            width: [200, null, 350, null, null, 500],
                                            })}`} > {a.description} 
                        </StyledText>
                    </Box>
                </TransactionContainer>
            )}
            
        </Wrapper>
    );
}

export default Transaction;