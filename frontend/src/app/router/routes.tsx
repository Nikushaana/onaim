import { createBrowserRouter } from 'react-router-dom';
import LeaderboardListPage from '@/features/leaderboard/pages/LeaderboardListPage';
import RaffleDirectory from '@/features/raffle/pages/RaffleDirectory';
import WheelListPage from '@/features/wheel/pages/WheelListPage';
import MainLayout from '../layout/MainLayout';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <LeaderboardListPage /> },
      { path: '/raffles', element: <RaffleDirectory /> },
      { path: '/wheels', element: <WheelListPage /> },
    ],
  },
]);