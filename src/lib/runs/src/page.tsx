import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye } from "lucide-react";
import { DbRun } from "../model";
import { fetchRuns } from "../actions";

export function RunsList() {
  const { agentId } = useParams<{ agentId: string }>();
  const {
    data: runs,
    isLoading,
    error,
  } = useQuery<DbRun[], Error>({
    queryKey: ["runs", agentId],
    queryFn: () => fetchRuns(agentId!),
    enabled: !!agentId,
  });

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <Card className="flex-grow">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">Runs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-6 text-destructive">
              An error occurred: {error.message}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Agent ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs?.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="text-left font-medium">
                      {run.id}
                    </TableCell>
                    <TableCell className="text-left">{agentId}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/agents/${agentId}/runs/${run.id}/messages`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View messages
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
