import React from 'react';
import styled from 'styled-components';
import { Box } from '@contco/core-ui';
import css from '@styled-system/css'

type PercentageProps = {
    width: number;
};

const Indicator = styled.div.attrs<PercentageProps>((props) => ({
    style: {
        width: `${props.width}%`,
    },
})) <PercentageProps>`
  ${props => css({
    borderRadius: 20,
    height: [10, 15, null, 20, null],
    backgroundColor: props.theme.colors.percentageIndicator,
})}
`;

const Bar = styled(Box)`
 ${props => css({
    borderRadius: 20,
    backgroundColor: props.theme.colors.percentageBar,
    height: [10, 15, null, 20, null],
    width: [100, 200, 400, 600, null]
})}
`;
interface PercentageBarProps {
    percentageValue: number;
}

const PercentageBar: React.FC<PercentageBarProps> = ({ percentageValue }) => {
    return (
        <Bar >
            <Indicator width={percentageValue} />
        </Bar>
    );
};

export default PercentageBar;
