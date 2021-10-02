import styled from 'styled-components';
import css from '@styled-system/css';
import Item from './Item';
import { Text } from '@contco/core-ui';

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
  data: [any];
  currentTheme: any;
}

const List: React.FC<Props> = ({ data, currentTheme }) => {
  return (
    <Container>
      {data && data.length ? (
        data.map((item) => <Item key={item.token_id} data={item} currentTheme={currentTheme} />)
      ) : (
        <NoText>No Items Found</NoText>
      )}
    </Container>
  );
};

export default List;
