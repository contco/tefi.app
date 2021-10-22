import React from 'react';
import useMeasure from 'react-use-measure';
import { useTrail, animated } from '@react-spring/web';
import styled from 'styled-components';
import css from '@styled-system/css';

const fast = { tension: 1200, friction: 40 };
const slow = { mass: 10, tension: 200, friction: 50 };
const trans = (x: number, y: number) => `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`;

const MainHook = styled.div`
  > div {
    position: absolute;
    will-change: transform;
    border-radius: 50%;

    box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
    opacity: 0.6;
    ${(props) =>
      css({
        background: props.theme.colors.secondary,
      })}
  }
  > div:nth-child(1) {
    width: 66px;
    height: 66px;
  }
  > div:nth-child(2) {
    width: 133px;
    height: 133px;
  }
  > div:nth-child(3) {
    width: 93px;
    height: 93px;
  }
  > div:nth-child(4) {
    width: 33px;
    height: 33px;
  }
  > div:nth-child(5) {
    width: 99px;
    height: 99px;
  }
  > div:nth-child(6) {
    width: 33px;
    height: 33px;
  }
  > div:nth-child(7) {
    width: 66px;
    height: 66px;
  }
  > div:nth-child(8) {
    width: 166px;
    height: 166px;
  }
  > div:nth-child(9) {
    width: 39px;
    height: 39px;
  }
  > div::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  > div:nth-child(2)::after {
    top: 35px;
    left: 35px;
    width: 35px;
    height: 35px;
  }
  > div:nth-child(3)::after {
    top: 25px;
    left: 25px;
    width: 25px;
    height: 25px;
  }
  position: absolute;
  width: 100%;
  height: 90%;
  overflow: hidden;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: default;
`;

const AnimatedCircleTrail = () => {
  const [ref, { left, top }] = useMeasure();
  const [trail, api] = useTrail(9, (i) => ({
    xy: [window.innerWidth / 2, window.innerHeight * 0.7],
    config: i === 0 ? fast : slow,
  }));

  const handleMouseMove = (e) => {
    api.start({ xy: [e.clientX - left, e.clientY - top] });
  };

  return (
    <div>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="30" />
          <feColorMatrix in="blur" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -7" />
        </filter>
      </svg>
      <MainHook ref={ref} onMouseMove={handleMouseMove}>
        {trail.map((props, index) => (
          <animated.div key={index} style={{ transform: props.xy.to(trans) }} />
        ))}
      </MainHook>
    </div>
  );
};

export default AnimatedCircleTrail;
