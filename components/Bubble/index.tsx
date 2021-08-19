import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';

const OvalShap = styled.div<BubbleProps>`
  ${({ size, isPostive, theme }) =>
    css({
      borderRadius: '50%',
      width: [
        50 + 150 * size,
        null,
        null,
        50 + 150 * size,
        50 + 150 * size,
        50 + 200 * size,
        50 + 220 * size,
        null,
        50 + 250 * size,
        100 + 250 * size,
      ],
      height: [
        50 + 150 * size,
        null,
        null,
        50 + 150 * size,
        50 + 150 * size,
        50 + 200 * size,
        50 + 220 * size,
        null,
        50 + 250 * size,
        100 + 250 * size,
      ],
      background: `${isPostive ? theme.colors.bubblePositive : theme.colors.bubbleNegative}`,
    })}
  will-change: transform;
  transition: transform 250ms;

  &:hover {
    transition: transform 250ms;
    transform: translateY(-20px);
  }

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyleImage = styled.img`
  width: 50%;
  height: 50%;
`;

const StyleText = styled.p`
  text-align: center;
  font-weight: bold;
  ${({ isPostive, theme }: any) =>
    css({
      color: `${isPostive ? theme.colors.bubblePositive : theme.colors.bubbleNegative}`,
      fontSize: ['12px', null, '14px', null, '18px'],
    })}
`;

const Container = styled.div``;

export type BubbleProps = {
  price: string;
  imageUrl: string;
  size: number;
  isPostive: boolean;
};

const Bubble: React.FC<BubbleProps> = ({ ...BubbleProps }) => {
  return (
    <Container>
      <OvalShap {...BubbleProps}>
        <StyleImage src={BubbleProps.imageUrl} alt="Picture of the author" />
      </OvalShap>
      <StyleText {...BubbleProps}>{BubbleProps.price}</StyleText>
    </Container>
  );
};

export default Bubble;
