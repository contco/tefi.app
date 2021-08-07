import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Text, Flex, Box } from '@contco/core-ui';
import { ICON_LUNA_URL, ICON_MIR_URL } from '../../constants';


const Container = styled(Flex)`
  ${css({
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: 80,
  paddingBottom: 40,
  boxSizing: 'border-box',
  height: [400, 480, 520, 600, null, 860, '100vh'],
})}
`;

const Row = styled(Flex)`
  ${css({
  width: '98vw',
  justifyContent: 'space-between',
})}
`;

const OvalShap = styled.div`
  ${css({
  margin: '0 auto',
  borderRadius: '50%',
  width: [50 * 2, 60, 70, 84, 90, 110, 120, null, 130, 150 * 2],
  height: [50 * 2, 60, 70, 84, 90, 110, 120, null, 130, 150 * 2],
  background: '#95fa84'
})}
`;

const StyleImage = styled.img`
  ${css({
  borderRadius: '50%',
  width: [50 / 3 * 2, 60 / 3, 70 / 3, 84 / 3, 90 / 3, 110 / 3, 120 / 3, null, 130 / 3, (150 / 3) * 2],
  height: [50 / 3 * 2, 60 / 3, 70 / 3, 84 / 3, 90 / 3, 110 / 3, 120 / 3, null, 130 / 3, (150 / 3) * 2],
  position: 'relative',
  top: '50%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
  background: '#ffffff',
  padding: [0.5, null, 1],
})}
`;

const Bubble: React.FC = () => {
  return (
    <OvalShap>
      <StyleImage src={ICON_MIR_URL} />
    </OvalShap>
  );
};

export default Bubble;
