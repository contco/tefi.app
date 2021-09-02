import { Wrapper, Row, HeadingWrapper, Heading, StyledText } from '../dashboardStyles';
import {Box} from "@contco/core-ui";
import {useTimer} from "react-timer-hook";
import { convertToFloatValue } from '../../utils/convertFloat';
import TitleContainer from '../DashboardComponents/TitleContainer';
const HEADING_TEXT = `LoTerra`;

const LoTerraTitles = ['User Combinations', 'Tickets Sold', 'Draw End Time', 'Latest Jackpot'];

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
			<TitleContainer titles={LoTerraTitles}/>
      {getLotteryDraws()}
    </Wrapper>
  );
};

export default Loterra;
