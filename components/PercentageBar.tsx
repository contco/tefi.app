import React from 'react';
import styled from 'styled-components';
import { Box } from '@contco/core-ui';
import css from '@styled-system/css';

type PercentageProps = {
  width: number;
};
const Container = styled(Box)``;
const Indicator = styled.div.attrs<PercentageProps>((props) => ({
  style: {
    width: `${props.width}%`,
  },
}))<PercentageProps>`
  ${(props) =>
    css({
      borderRadius: 20,
      height: [10, 15, null, 20, null],
      backgroundColor: props.theme.colors.percentageIndicator,
    })}
`;

const PercentageDisplay = styled.div.attrs<PercentageProps>((props) => ({
  style: {
    marginLeft: `${props.width - 5}%`,
  },
}))<PercentageProps>`
  ${(props) =>
    css({
      color: props.theme.colors.percentageIndicator,
      fontWeight: 500,
      pb: 2,
      fontSize: ['12px', null, 16],
    })}
`;

const Bar = styled(Box)`
  ${(props) =>
    css({
      borderRadius: 20,
      backgroundColor: props.theme.colors.percentageBar,
      height: [10, 15, null, 20, null],
      width: [200, null, 300, 400, null, 600],
    })}
`;
interface PercentageBarProps {
  percentageValue: number;
}

const PercentageBar: React.FC<PercentageBarProps> = ({ percentageValue }) => {
  return (
    <Container>
      <PercentageDisplay width={percentageValue}>{percentageValue + '%'}</PercentageDisplay>
      <Bar>
        <Indicator width={percentageValue * 1.667} />
      </Bar>
    </Container>
  );
};

export default PercentageBar;
