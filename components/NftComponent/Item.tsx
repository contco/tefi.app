import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex } from '@contco/core-ui';
import Image from 'next/image';

const Container = styled(Flex)`
  flex-direction: column;
  background-color: red;
  border: 1px solid grey;
`;

interface Props {
  data: any;
}

const Item: React.FC<Props> = ({ data }) => {
  console.log(data, data);

  return (
    <Container>
      <p>{data.name}</p>
      <img src={data.src} alt="Picture of the author" width={260} height={260} />
    </Container>
  );
};

export default Item;
