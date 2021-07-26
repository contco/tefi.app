import { Box, Flex, Text } from '@contco/core-ui';
import css from '@styled-system/css';
import Styled from 'styled-components';

export const Wrapper = Styled(Box)`
${css({
  mb: 60,
  width: ['600px', null, null, '850px', null, '100%'],
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
    fontSize: ['14px', null, null, 18],
    width: [100, null, 150, null, null, 200],
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
    fontSize: ['10px', null, null, '12px'],
    pt: 1,
  })}
`;
export const StyledText = Styled(Text)`
${(props) =>
  css({
    color: props.theme.colors.detailsText,
    letterSpacing: 1,
    fontSize: ['11px', null, null, null, '14px', null, null, 16],
    width: [100, null, 150, null, null, 200],
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
    fontSize: ['8px', null, null, '10px'],
    width: [100, null, 150, null, null, 200],
    opacity: '0',
    pt: 1,
  })}
`;

export const CheckBox = Styled.input`
  margin-right: 12px;
  margin-top: 0;
  margin-bottom: 0;
  ${() =>
    css({
      height: [14, null, null, null, 18],
      width: [14, null, null, null, 18],
    })}
`;


export const ColumnFlex  = Styled(Flex)`
 flex-direction: column;
`

export const CSS_APR = (props) =>
  css({
    fontWeight: 500,
    color: props.theme.colors.secondary,
    fontSize: ['11px', null, null, '14px', null, null, 16],
  });
