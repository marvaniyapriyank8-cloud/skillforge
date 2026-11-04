import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Reset scroll on route changes (in-page #anchors are left alone). */
export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
