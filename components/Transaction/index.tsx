import { Wrapper, Row, AirdropHeading, Heading, Title, StyledText, ClaimButton } from "../dashboardStyles";
import { TransactionHeading, OvalShape, OvalContainer } from './style';
import {Flex,Box} from "@contco/core-ui";
const HEADING_TEXT = `Transaction History`
const arr = [1,2,3]

export interface TransactionProps {
  
};

const Transaction: React.FC<TransactionProps> = () => {
    
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
        </Wrapper>
    );
}

export default Transaction;