import styled from 'styled-components';
import css from '@styled-system/css';
import { Text } from '@contco/core-ui';
import List from './List';
import { NFT_CONTRACTS } from './contracts';

const MainContainer = styled.div`
  ${css({
      mt: 2,
      pl: 3,
      pr: 3,
    })}
`;


const NoText = styled(Text)`
  ${(props) =>
    css({
      color: props.theme.colors.Heading,
      fontSize: '16px',
      fontWeight: 600,
      mb: 2,
    })}
`;

interface Props {
  data: any;
  currentTheme: any;
  address: string;
}

const Collection: React.FC<Props> = ({ data, currentTheme, address }) => {

  const showNftList = () => {

    if (!data || data?.length === 0) {
      return <NoText> No Items Found </NoText>
    }
    else {
      const userNftData = NFT_CONTRACTS.map((contract) => {
        const contractData = data.filter((nftAsset: any) => (nftAsset?.nftContract === contract?.contractAddr) || nftAsset?.collection === contract?.name );
        return {...contract, items: contractData};
      })
      return userNftData.map((nftData: any) => {
        return(
          <>
          <List data={nftData} currentTheme={currentTheme} address={address} />
          </>
        )
      })
    }
  }
  return (
    <MainContainer>
      {showNftList()}
    </MainContainer>
  );
};

export default Collection;
