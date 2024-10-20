import { useMutation } from "@tanstack/react-query";
import { File, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Agent, agentStatus } from "../model";
import { addAgent, fetchAgents } from "../actions";
import { AddAgentSheet } from "./addAgentSheet";
import { AgentsTable } from "./agentsTable";
import { useEffect } from "react";

export function AgentsPage() {
  const {
    data: fetchedAgents,
    isPending: isLoading,
    error,
    mutate: refetch,
  } = useMutation<Agent[], Error>({
    mutationFn: fetchAgents,
  });
  useEffect(() => {
    refetch();
  }, [refetch]);
  const onDelete = () => {
    refetch();
  };

  const agents = fetchedAgents || [];

  return (
    <Tabs className="px-4 flex flex-col h-full py-8" defaultValue="all">
      <div className="flex items-center mb-2">
        <TabsList>
          <TabsTrigger value={"all"}>All</TabsTrigger>
          <TabsTrigger value={agentStatus.online}>Online</TabsTrigger>
          <TabsTrigger value={agentStatus.offline}>Offline</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Agent
                </span>
              </Button>
            </SheetTrigger>
            <AddAgentSheet
              onAdd={async (agent) => {
                await addAgent(agent);
                refetch();
              }}
            />
          </Sheet>
        </div>
      </div>
      <Card
        x-chunk="dashboard-06-chunk-0"
        className="h-full flex flex-col overflow-hidden"
      >
        <CardHeader>
          <CardTitle>Agents</CardTitle>
          <CardDescription>
            Manage your agents and view their runs.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full overflow-y-auto">
          <TabsContent value={"all"} asChild>
            <AgentsTable
              agents={agents}
              isLoading={isLoading}
              error={error}
              onDelete={onDelete}
            />
          </TabsContent>
          <TabsContent value={agentStatus.online} asChild>
            <AgentsTable
              agents={agents.filter(
                (agent) => agent.status === agentStatus.online
              )}
              isLoading={isLoading}
              error={error}
              onDelete={onDelete}
            />
          </TabsContent>
          <TabsContent value={agentStatus.offline} asChild>
            <AgentsTable
              agents={agents.filter(
                (agent) => agent.status === agentStatus.offline
              )}
              isLoading={isLoading}
              error={error}
              onDelete={onDelete}
            />
          </TabsContent>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing all agents
          </div>
        </CardFooter>
      </Card>
    </Tabs>
  );
}
