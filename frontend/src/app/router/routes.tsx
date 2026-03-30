import { createBrowserRouter } from "react-router-dom";
import LeaderboardListPage from "@/features/leaderboard/pages/LeaderboardListPage";
import RaffleDirectory from "@/features/raffle/pages/RaffleDirectory";
import WheelListPage from "@/features/wheel/pages/WheelListPage";
import MainLayout from "../layout/MainLayout";
import LeaderboardCreatePage from "@/features/leaderboard/pages/LeaderboardCreatePage";
import RaffleCreatePage from "@/features/raffle/pages/RaffleCreatePage";
import WheelCreatePage from "@/features/wheel/pages/WheelCreatePage";
import LeaderboardDetailsPage from "@/features/leaderboard/pages/LeaderboardDetailsPage";
import RaffleDetailsPage from "@/features/raffle/pages/RaffleDetailsPage";
import WheelDetailsPage from "@/features/wheel/pages/WheelDetailsPage";
import NotFound from "@/404";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <LeaderboardListPage /> },
      {
        path: "/create-leaderboard",
        element: <LeaderboardCreatePage />,
      },
      {
        path: "/:id",
        element: <LeaderboardDetailsPage />,
      },
      { path: "/raffles", element: <RaffleDirectory /> },
      { path: "/raffles/create-raffle", element: <RaffleCreatePage /> },
      {
        path: "/raffles/:id",
        element: <RaffleDetailsPage />,
      },
      { path: "/wheels", element: <WheelListPage /> },
      { path: "/wheels/create-wheel", element: <WheelCreatePage /> },
      {
        path: "/wheels/:id",
        element: <WheelDetailsPage />,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
