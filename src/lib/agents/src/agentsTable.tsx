import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Agent } from "../model";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentRow } from "./agentRow";

export const AgentsTable = ({
  agents,
  isLoading,
  error,
  onDelete,
}: {
  agents: Agent[];
  isLoading: boolean;
  error: Error | null;
  onDelete: (id: string) => void;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Protocol</TableHead>
          <TableHead className="text-left">Name</TableHead>
          <TableHead className="text-left">Status</TableHead>
          <TableHead className="hidden md:table-cell text-left">
            Source
          </TableHead>
          <TableHead className="hidden md:table-cell text-left">
            Created at
          </TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8 rounded-full" />
              </TableCell>
            </TableRow>
          ))
        ) : error ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-red-500">
              Error: {error.message}
            </TableCell>
          </TableRow>
        ) : (
          agents.map((agent) => (
            <AgentRow key={agent.id} agent={agent} onDelete={onDelete} />
          ))
        )}
      </TableBody>
    </Table>
  );
};
