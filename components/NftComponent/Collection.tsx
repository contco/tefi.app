import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Text } from '@contco/core-ui';
import List from './List';

const MainContainer = styled.div`
  ${(props) =>
    css({
      mt: 2,
      pl: 3,
      pr: 3,
    })}
`;

const Title = styled(Text)`
  ${(props) =>
    css({
      color: props.theme.colors.Heading,
      letterSpacing: 2,
      fontSize: [20, null, null, 28],
      fontWeight: 900,
      mb: 2,
    })}
`;

interface Props {
  data: any;
}

const Collection: React.FC<Props> = ({ data }) => {
  return (
    <MainContainer>
      <Title>Galactic Punks</Title>
      <List data={data} />
    </MainContainer>
  );
};

export default Collection;
