import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex } from '@contco/core-ui';
import List from './List';

const MainContainer = styled(Flex)``;

interface Props {
  data: any;
}

const Collection: React.FC<Props> = ({ data }) => {
  return (
    <MainContainer>
      <List data={data} />
    </MainContainer>
  );
};

export default Collection;
