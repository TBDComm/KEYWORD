import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Spinner } from '../ui/Spinner';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <Spinner size={32} />
          </div>
        }
      >
        <Outlet />
      </Suspense>
      <Footer />
    </div>
  );
}
