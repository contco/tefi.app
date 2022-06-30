import Assets from '../../components/Asset';
import MarketValue from '../../components/MarketValue';
import { Box } from '@contco/core-ui';

interface Props {
  assets: any;
}

const DashboardComponents: React.FC<Props> = ({ assets }) => {
  return (
    <Box>
      <MarketValue allData={[assets]} />
      <Assets assets={assets} />
    </Box>
  );
};

export default DashboardComponents;
