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

import { Agent } from "../model";
import { createNewRuns, deleteAgent } from "../actions";
import { Link, useNavigate } from "react-router-dom";

export function AgentRow({
  agent,
  onDelete,
}: {
  agent: Agent;
  onDelete: (id: string) => void;
}) {
  const navigate = useNavigate();
  return (
    <TableRow key={agent.id}>
      <TableCell className="hidden sm:table-cell">{agent.protocol}</TableCell>
      <TableCell className="font-medium">{agent.name}</TableCell>
      <TableCell>
        <Badge variant="outline">{agent.status}</Badge>
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
          <DropdownMenuContent align="end">
            <Link to={`/agents/${agent.id}/runs`}>
              <DropdownMenuItem>View runs</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={async () => {
                const run = await createNewRuns(agent.id, [
                  {
                    targetUrl:
                      "https://careers.thalesgroup.com/global/en/apply?jobSeqNo=TGPTGWGLOBALR0235440EXTERNALENGLOBAL&source=WORKDAY&utm_source=linkedin&utm_medium=phenom-feeds&step=1",
                  },
                  {
                    targetUrl:
                      "https://www.google.com/search?q=thales+group+careers",
                  },
                ]);

                navigate(`/agents/${agent.id}/runs/${run.id}/messages`);
              }}
            >
              Invoke
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await deleteAgent(agent.id);
                onDelete(agent.id);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
