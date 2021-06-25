import { Box, Flex, Text } from '@contco/core-ui';
import css from '@styled-system/css';
import Styled from 'styled-components';
import { borderLeft } from 'styled-system';

export const Wrapper = Styled(Box)`
${css({
  mb: 60,
})}
`;
export const Row = Styled(Flex)`
${css({
  justifyContent: 'space-between',
  py: 3,
})}
`;
export const HeadingWrapper = Styled(Box)`
${css({
  mb: 20,
})}
`;
export const Heading = Styled(Text)`
${(props) =>
  css({
    color: props.theme.colors.Heading,
    letterSpacing: 2,
    fontSize: 28,
    fontWeight: 900,
    mb: 2,
  })}
`;

export const Title = Styled(Text)`
${(props) =>
  css({
    color: props.theme.colors.subHeading,
    fontWeight: 500,
    letterSpacing: 1,
    fontSize: 18,
    width: 200,
    textAlign: 'justify',
  })}
`;

export const TextContainer = Styled(Flex)`
  width: 200;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: blue;
`;

export const SubText = Styled(Text)`
${(props) =>
  css({
    color: props.theme.colors.detailsText,
    fontWeight: 'bold',
    fontSize: 0,
    pt: 1,
  })}
`;
export const StyledText = Styled(Text)`
${(props) =>
  css({
    color: props.theme.colors.detailsText,
    letterSpacing: 1,
    fontSize: 16,
    width: 200,
    textAlign: 'justify',
    cursor: props.isChildren ? 'pointer' : '',
  })}
    &:hover > * {
        display:flex;
        opacity:1
    }
`;
export const HoverText = Styled(Text)`
${(props) =>
  css({
    color: props.theme.colors.detailsText,
    fontSize: '10px',
    width: 200,
    opacity: '0',
    pt: 1,
  })}
`;

export const Gap = Styled.div`
    ${() =>
      css({
        height: 60,
      })}
`;
