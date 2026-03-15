import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { KeywordPage } from './pages/KeywordPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <KeywordPage /> },
    ],
  },
]);
