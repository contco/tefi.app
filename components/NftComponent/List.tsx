import styled from 'styled-components';
import css from '@styled-system/css';
import {Text} from '@contco/core-ui';
import Item from './Item';

const Container = styled.div`
  ${css({
    py: 3,
    gridTemplateColumns: [null, null, '1fr', '1fr 1fr', '1fr 1fr', '1fr 1fr 1fr'],
  })}
  display: grid;
  gap: 3.99rem 3.99rem;
  &.internalSection {
    svg {
      color: secondary;
      &:hover {
        opacity: 0.7;
      }
    }
  }
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
  currentTheme: any;
  address: string;
}

const List: React.FC<Props> = ({ data, currentTheme, address }) => {
  if (!data?.items || data?.items?.length === 0) {
    return <> </>;
  }

  return (
    <>
    <Title> {data?.name}</Title>
    <Container>
      {
        data?.items?.map((item) => <Item key={item.token_id} data={item} currentTheme={currentTheme} address={address} />)
      }
    </Container>
    </>
  );
};

export default List;
