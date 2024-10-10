import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { AgentsPage } from "@/lib/agents";
import { RunsList } from "@/lib/runs";
import { MessagesList } from "@/lib/messages";
import { HomePage } from "@/lib/home";
import { Shell } from "@/lib/shell";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Shell />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/agents",
        element: <AgentsPage />,
      },
      {
        path: "/agents/:agentId/runs",
        element: <RunsList />,
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
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
