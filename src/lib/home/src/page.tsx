import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Langwork</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>About This App</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Agent History Viewer allows you to explore the history of executed
            agents and replay their actions. Gain insights into agent behavior,
            analyze performance, and improve your AI systems.
          </CardDescription>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>View Agent History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Browse through the list of agents that have been executed in the
              past.
            </p>
            <Button asChild>
              <Link to="/agents">View Agents</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Replay Agent Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Select an agent and replay its actions to understand its
              decision-making process.
            </p>
            <Button asChild>
              <Link to="/agents">Start Exploring</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
