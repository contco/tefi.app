import { Box, Flex, Text } from '@contco/core-ui';
import css from '@styled-system/css';
import Styled from 'styled-components';

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
    fontSize: [20, null, null, 28],
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
    fontSize: ['13px', null, null, 18],
    width: [100, null, null, 150, null, null, 200],
    wordWrap: 'break-word'
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
    fontSize: ['9px', null, null, '12px'],
    pt: 1,
  })}
`;
export const StyledText = Styled(Text)`
${(props) =>
  css({
    color: props.theme.colors.detailsText,
    letterSpacing: 1,
    fontSize: ['11px', null, null, 14, null, 16],
    width: [100, null, 150, null, null, 200],
    cursor: props.isChildren ? 'pointer' : '',
    wordWrap: 'break-word'
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
    fontSize: ['7px', null, null, '8px', null, '10px'],
    width: [100, null, 150, null, null, 200],
    opacity: '0',
    pt: 1,
  })}
`;
