import styled from 'styled-components';
import css from '@styled-system/css';
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

interface Props {
  data: [any];
  currentTheme: any;
}

const List: React.FC<Props> = ({ data, currentTheme }) => {
  return (
    <Container>
      {data && data.map((item) => <Item key={item.token_id} data={item} currentTheme={currentTheme} />)}
    </Container>
  );
};

export default List;
