import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export function App() {
  useEffect(() => {
    const onLoad = () => {
      const script = document.createElement('script');
      script.src = '//wcs.naver.net/wcslog.js';
      script.onload = () => {
        if (!window.wcs_add) window.wcs_add = {};
        window.wcs_add['wa'] = '184951323109560';
        if (window.wcs) window.wcs.do();
      };
      document.body.appendChild(script);
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return <RouterProvider router={router} />;
}
