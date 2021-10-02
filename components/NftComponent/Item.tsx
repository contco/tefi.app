import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Text } from '@contco/core-ui';

const Container = styled(Flex)`
  flex-direction: column;
  overflow: hidden;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  /* border-radius: 3%; */
  ${(props) =>
    css({
      // p: 3,
    })}
`;

const ImageContainer = styled(Flex)``;

const Image = styled.img`
  /* border-radius: 3%; */
`;

const TextContainer = styled(Flex)`
  flex-direction: column;
  height: 99px;
  justify-content: center;
  ${(props) =>
    css({
      p: 3,
    })}
`;

const CollectionName = styled(Text)`
  ${(props) =>
    css({
      color: props.theme.colors.subHeading,
      fontWeight: 500,
      fontSize: ['14px', null, null, '14px'],
    })}
`;

const ItemName = styled(Text)`
  ${(props) =>
    css({
      color: props.theme.colors.Heading,
      fontWeight: 500,
      mt: 2,
      fontSize: ['14px', null, null, '16px'],
    })}
`;

interface Props {
  data: any;
}

const Item: React.FC<Props> = ({ data }) => {
  console.log(data, data);

  return (
    <Container>
      <ImageContainer>
        <Image src={data.src} alt="Picture of the author" width="100%" height="auto" />
      </ImageContainer>
      <TextContainer>
        <CollectionName>{data.collection.name}</CollectionName>
        <ItemName>{data.name}</ItemName>
      </TextContainer>
    </Container>
  );
};

export default Item;
