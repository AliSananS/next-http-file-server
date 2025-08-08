import { useCallback, useState, useEffect } from 'react';

const isBrowser = typeof window !== 'undefined';

const getSize = () => {
  if (isBrowser) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  return {
    width: undefined,
    height: undefined,
  };
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(getSize);
  const handleResize = useCallback(() => setWindowSize(getSize()), [setWindowSize]);

  useEffect(() => {
    if (!isBrowser) {
      return false;
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return windowSize;
};

export default useWindowSize;
