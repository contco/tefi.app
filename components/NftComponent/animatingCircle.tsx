import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import css from '@styled-system/css';

export const SmallCircle = () => {
  const styles2 = useSpring({
    loop: { reverse: false },
    config: { duration: 1000 },
    from: { y: 0 },
    to: { y: 140 },
  });

  const styles = useSpring({
    loop: { reverse: true },
    from: { x: 0 },
    to: { x: 30 },
    delay: 1000,
  });

  const StyledSmallCircle = styled(animated.div)`
    border-radius: 50%;
    ${css({
      height: ['30px', null, '40px'],
      width: ['30px', null, '40px'],
      bg: 'primary',
    })}
  `;

  return <StyledSmallCircle style={{ ...styles, ...styles2 }} />;
};
