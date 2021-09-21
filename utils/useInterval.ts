/* eslint-disable @typescript-eslint/no-empty-function */
import { useEffect, useRef } from 'react';

const noop = () => {};

export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(noop);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);


  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
