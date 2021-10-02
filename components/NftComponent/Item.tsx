import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Text } from '@contco/core-ui';

const Container = styled(Flex)`
  flex-direction: column;
  overflow: hidden;
  ${(props) =>
    css({
      boxShadow: props.theme.postShadow,
      bg: 'background',
    })}
`;

const ImageContainer = styled(Flex)``;

const Image = styled.img``;

const TextContainer = styled(Flex)`
  flex-direction: column;
  height: 99px;
  justify-content: center;
  ${(props) =>
    css({
      p: 3,
      pb: 0,
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

const BidContainer = styled(Flex)`
  flex: 1;
  justify-content: flex-end;
  ${css({
    mb: 3,
  })}
`;

const BidButton = styled.div`
  ${(props) =>
    css({
      bg: props.theme.colors.secondary,
    })}
  width: 25%;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const BidText = styled.p`
  color: white;
  ${(props) =>
    css({
      color: props.theme.colors.primary,
    })}
  font-size: 11px;
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
      <BidContainer>
        <BidButton>
          <BidText>Bid</BidText>
        </BidButton>
      </BidContainer>
    </Container>
  );
};

export default Item;
