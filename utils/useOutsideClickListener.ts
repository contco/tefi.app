import React from 'react';

function useOutsideClickListener(ref: React.RefObject<HTMLElement>, callback: () => void) {
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref && ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
        callback();
      }
    }

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [callback, ref]);
}

export default useOutsideClickListener;
