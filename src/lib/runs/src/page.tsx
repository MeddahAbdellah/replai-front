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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Run } from "../model";
import { fetchRuns } from "../actions";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, File, ListFilter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RunsPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const {
    data: runs,
    isLoading,
    error,
  } = useQuery<Run[], Error>({
    queryKey: ["runs", agentId],
    queryFn: () => fetchRuns(agentId!),
    enabled: !!agentId,
  });

  return (
    <Tabs className="px-4 flex flex-col h-full" defaultValue="all">
      <div className="flex items-center mb-2">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
        </div>
      </div>
      <Card x-chunk="dashboard-06-chunk-0" className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Runs</CardTitle>
          <CardDescription>
            Manage your runs and view their messages.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full">
          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Status</TableHead>
                  <TableHead className="text-left">Task result</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
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
                  runs?.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell>
                        <Badge variant="outline">{run.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {run.taskStatus}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(run.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link
                            to={`/agents/${agentId}/runs/${run.id}/messages`}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View messages
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>32</strong> runs
          </div>
        </CardFooter>
      </Card>
    </Tabs>
  );
}
