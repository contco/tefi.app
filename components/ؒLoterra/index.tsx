import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from '../dashboardStyles';
import {Box} from "@contco/core-ui";
import {useTimer} from "react-timer-hook";
import { LoterraAccount } from '../../types';
import { convertToFloatValue } from '../../utils/convertFloat';
const HEADING_TEXT = `LoTerra`;

export interface Props {
  loterra: LoterraAccount;
}

const Loterra: React.FC<Props> = ({ loterra }) => {

  const {seconds, minutes, days, hours} = useTimer({expiryTimestamp: parseFloat(loterra?.loterraDraw?.drawTime)})

  const getLotteryDraws = () => {
      return(
        <Row>
          <StyledText fontWeight="500"> {loterra?.loterraDraw?.combinations}</StyledText>
          <Box>
          <StyledText> 
            {loterra?.loterraDraw?.ticketCounts}
          </StyledText>
          </Box>
          <StyledText>
           {`${days}D ${hours}H ${minutes}M ${seconds}S`}
          </StyledText>
          <StyledText>${convertToFloatValue(loterra?.loterraDraw?.jackpot)}</StyledText>
        </Row>
      ); 
  }

  if(!loterra?.loterraDraw) {
      return <> </>;
  }

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
      </HeadingWrapper>
      <Row>
          <Title>User Combinations</Title>
          <Title>Tickets Sold</Title>
          <Title>Draw End Time</Title>
          <Title>Latest Jackpot</Title>
      </Row>
      {getLotteryDraws()}
    </Wrapper>
  );
};

export default Loterra;
