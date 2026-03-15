import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';

const KeywordPage = lazy(() =>
  import('./pages/KeywordPage').then((m) => ({ default: m.KeywordPage }))
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'keyword', element: <KeywordPage /> },
    ],
  },
]);
