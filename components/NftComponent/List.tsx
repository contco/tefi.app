import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex } from '@contco/core-ui';
import Item from './Item';

// const MainContainer = styled(Flex)``;
const Container = styled.div`
  ${css({
    py: 3,
  })}
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem 0;
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
}

const List: React.FC<Props> = ({ data }) => {
  return <Container>{data && data.map((item) => <Item data={item} />)}</Container>;
};

export default List;
