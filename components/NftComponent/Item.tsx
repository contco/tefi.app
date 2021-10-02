import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Text, Avatar } from '@contco/core-ui';
import { LIGHT_THEME } from '../../constants';

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

const BottomContainer = styled(Flex)`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  ${css({
    mb: 3,
    pl: 3,
  })}
`;

const AvatarContainer = styled(Flex)`
  ${(props) =>
    css({
      p: props.selected ? 1 : 0,
      border: `1px solid`,
      borderColor: props.selected ? 'secondary' : 'primary',
      borderRadius: '50%',
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
  return (
    <Container>
      <ImageContainer>
        <Image src={data.src} alt="Picture of the author" width="100%" height="auto" />
      </ImageContainer>
      <TextContainer>
        <CollectionName>{data.collection.name}</CollectionName>
        <ItemName>{data.name}</ItemName>
      </TextContainer>
      <BottomContainer>
        {true && (
          <AvatarContainer selected={data.name === 'Galactic Punk #9253'}>
            <Avatar
              image={LIGHT_THEME === LIGHT_THEME ? '/images/dp_light.png' : '/images/dp_dark.png'}
              name="Hello"
              height={18}
              width={18}
            />
          </AvatarContainer>
        )}
      </BottomContainer>
    </Container>
  );
};

export default Item;
