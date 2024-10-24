import { TableCell, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Agent, agentProtocol, AgentStatus, agentStatus } from "../model";
import { createNewRuns, deleteAgent, fetchAgent } from "../actions";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { InvokeAgentSheet } from "./invokeAgentSheet";
import { useQuery } from "@tanstack/react-query";

export function AgentRow({
  agent,
  onDelete,
}: {
  agent: Agent;
  onDelete: (id: string) => void;
}) {
  const navigate = useNavigate();
  const { data: status } = useQuery<AgentStatus, Error>({
    queryKey: ["agent-status", agent.id],
    queryFn: async () => {
      const dbAgent = await fetchAgent(agent.id);
      if (!dbAgent) {
        return agentStatus.offline;
      }
      if (dbAgent.protocol === agentProtocol.http) {
        const response = await fetch(`${dbAgent.url}/health-check`).catch(
          () => ({
            ok: false,
          })
        );
        return response.ok ? agentStatus.online : agentStatus.offline;
      }
      return agentStatus.offline;
    },
  });
  return (
    <TableRow key={agent.id}>
      <TableCell className="hidden sm:table-cell">{agent.protocol}</TableCell>
      <TableCell className="font-medium">{agent.name}</TableCell>
      <TableCell>
        <Badge variant="outline">{status}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{agent.source}</TableCell>
      <TableCell className="hidden md:table-cell">
        {agent.createdAt.toISOString()}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <Sheet>
            <DropdownMenuContent align="end">
              {status === agentStatus.online && (
                <>
                  <Link to={`/agents/${agent.id}/runs`}>
                    <DropdownMenuItem>View runs</DropdownMenuItem>
                  </Link>
                  <SheetTrigger asChild>
                    <DropdownMenuItem>Invoke</DropdownMenuItem>
                  </SheetTrigger>
                </>
              )}

              <DropdownMenuItem
                onClick={async () => {
                  await deleteAgent(agent.id);
                  onDelete(agent.id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
            <InvokeAgentSheet
              onInvoke={async (parameters) => {
                await createNewRuns(agent.id, parameters);
                navigate(`/agents/${agent.id}/runs`);
              }}
            ></InvokeAgentSheet>
          </Sheet>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
