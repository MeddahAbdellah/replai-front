import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { AgentsPage } from "@/lib/agents";
import { RunsPage } from "@/lib/runs";
import { MessagesList } from "@/lib/messages";
import { HomePage } from "@/lib/home";
import { Shell } from "@/lib/shell";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Shell />,
    children: [
      {
        path: "/",
        element: <Navigate to="/home" />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/agents",
        element: <AgentsPage />,
      },
      {
        path: "/agents/:agentId/runs",
        element: <RunsPage />,
      },
      {
        path: "/agents/:agentId/runs/:runId/messages",
        element: <MessagesList />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
