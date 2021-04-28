
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Text } from '@contco/core-ui';
import LIGHT_SWITCH_ICON from '../../public/light-switch.svg';
import DARK_SWITCH_ICON from '../../public/dark-switch.svg';

export const Container = styled(Flex)`
${props => css({
    height: '64px',
    backgroundColor: props.theme.colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: '100'
})}
`;

export const LeftSection = styled(Flex)`
  ${css({
    flexDirection: 'row',
    alignItems: 'center',
    ml: [1, null, null, 3],
})}
`;

export const HeaderTitle = styled(Text)`
  ${props => css({
    ml: [1, null, null, 3],
    fontSize: [2, null, 3],
    color: props.theme.colors.secondary,
    fontWeight: 500
})}
`;

export const StyledLogoIcon = styled.div`
  color: ${(props) => props.theme.colors.secondary};
`;

export const RightSection = styled(Flex)`
  ${css({
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    mr: [1, null, null, 3],
    width: [150, null, 280],
})}
`;

export const SwitchContainer = styled(Flex)`
  ${props => css({
    color: props.theme.colors.secondary,
    minWidth: [30, null, 40],
    justifyContent: 'center',
    alignItems: 'center',

})}
`;
export const LightSwitchIcon = styled(LIGHT_SWITCH_ICON)`
${css({
    transition: 'opacity 0.3s',
    cursor: 'pointer',
    marginBottom: '4px'
})}
  &:hover {
    opacity: 0.7;
  }
`;
export const DarkSwitchIcon = styled(DARK_SWITCH_ICON)`
${css({
    transition: 'opacity 0.3s',
    cursor: 'pointer',
    marginBottom: '5px'
})}
  &:hover {
    opacity: 0.7;
  }
`;
