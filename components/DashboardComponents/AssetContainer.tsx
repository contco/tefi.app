import { Box } from '@contco/core-ui';
import { StyledText, SubText } from '../dashboardStyles';

interface Props {
  token: string;
  tokenValue: string;
}

const AssetContainer: React.FC<Props> = ({ token, tokenValue }) => {
  return (
    <Box>
      <StyledText>{token}</StyledText>
      <SubText>{tokenValue}</SubText>
    </Box>
  );
};

export default AssetContainer;
