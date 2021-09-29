import { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { LIGHT_THEME } from '../../constants';

interface LogoProps {
  width: string;
  currentTheme: string;
}

export const Logo = ({ width, currentTheme }: LogoProps) => {
  const centerX = 69.560811;
  const centerY = 69.604167;
  const rMax = 48;

  const [{ x, y, cursor }, api] = useSpring(() => ({
    x: centerX,
    y: centerY - rMax / 1.5,
    cursor: 'grab',
    config: { tension: 166, friction: 0.5, precision: 0.1 },
  }));

  const bind = useDrag(({ movement: [dX, dY], down }) => {
    const r = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    if (r > rMax) {
      const t = rMax / r;
      dX *= t;
      dY *= t;
    }

    api.start({
      x: centerX + (down ? dX : 0),
      y: centerY + (down ? dY : 0),
      cursor: down ? 'grabbing' : 'grab',
      immediate: down,
    });
  });

  useEffect(() => {
    api.start({
      x: centerX,
      y: centerY,
    });
  }, [api]);

  return (
    <animated.svg height={width} viewBox="0 0 139 139" width={width} {...bind()} style={{ cursor: cursor }}>
      <radialGradient
        id="a"
        cx="133.434395%"
        cy="132.389247%"
        gradientTransform="matrix(.57850251 .81411613 -.8156806 .57739294 .405118 -.135316)"
        r="64.015025%"
      >
        <stop offset="1" stopColor={currentTheme === LIGHT_THEME ? '#ffffff' : '#202235'} />
      </radialGradient>
      <animated.ellipse cx={x} cy={y} fill="url(#a)" rx="19.560811" ry="19.604167" />
    </animated.svg>
  );
};
