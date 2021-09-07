import { Wrapper, Row, AirdropHeading, Heading, Title, StyledText, ClaimButton, SimpleText } from "../dashboardStyles";
import { TransactionHeading, OvalShape, OvalContainer, TransactionContainer, TypeText, DateText, DetailText } from './style';
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
            <Box mt={6}>
            {transactions.map(a => 
                <TransactionContainer key={a.type}>
                    <Flex justifyContent='space-between'>
                        <TypeText>{a.type}</TypeText>
                        <DateText>{a.date}</DateText>
                    </Flex>
                    <Box>
                        <DetailText > {a.description} 
                        </DetailText>
                    </Box>
                </TransactionContainer>
            )}
            </Box>
            
        </Wrapper>
    );
}

export default Transaction;