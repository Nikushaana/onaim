import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router/routes";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </QueryProvider>
  );
}
