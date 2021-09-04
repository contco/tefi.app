import { StyledText, HoverText } from '../dashboardStyles';

interface Props {
  lp: string;
  token1: string;
  token2: string;
}

const LpContainer: React.FC<Props> = ({ lp, token1, token2 }) => {
  return (
    <StyledText isChildren={true}>
      {lp}
      <HoverText>
        {token1} <br />
        {token2}
      </HoverText>
    </StyledText>
  );
};

export default LpContainer;
