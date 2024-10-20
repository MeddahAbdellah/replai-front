import { useQuery } from "@tanstack/react-query";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
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
import { GetRunsResponse } from "../model";
import { fetchRuns } from "../actions";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createLinkToTab, runsTabs } from "./createLinkToTab";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function RunsPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const order = searchParams.get("order") || "desc";
  const status = searchParams.get("status");
  const taskStatus = searchParams.get("taskStatus");
  const { data, isLoading, error } = useQuery<GetRunsResponse, Error>({
    queryKey: ["runs", agentId, page, limit, order, status, taskStatus],
    queryFn: () => {
      const filters = {
        ...(status ? { status: status } : {}),
        ...(taskStatus ? { taskStatus: taskStatus } : {}),
      } as { status?: string; taskStatus?: string };
      if (filters.status || filters.taskStatus) {
        return fetchRuns(
          agentId!,
          { page: Number(page), limit: Number(limit) },
          order as "asc" | "desc",
          {
            ...(status ? { status: status } : {}),
            ...(taskStatus ? { taskStatus: taskStatus } : {}),
          } as { status: string; taskStatus: string }
        );
      }
      return fetchRuns(
        agentId!,
        { page: Number(page), limit: Number(limit) },
        order as "asc" | "desc"
      );
    },
    enabled: !!agentId,
  });

  return (
    <Tabs className="px-4 flex flex-col h-full  py-8" defaultValue="all">
      <div className="flex items-center mb-2">
        <TabsList>
          {Object.keys(runsTabs).map((key) => {
            const tabName = runsTabs[key as keyof typeof runsTabs];
            return (
              <Link
                key={key}
                to={createLinkToTab(location, key as keyof typeof runsTabs)}
              >
                <TabsTrigger value={key}>{tabName}</TabsTrigger>
              </Link>
            );
          })}
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
        </div>
      </div>
      <Card
        x-chunk="dashboard-06-chunk-0"
        className="h-full flex flex-col overflow-hidden"
      >
        <CardHeader>
          <CardTitle>Runs</CardTitle>
          <CardDescription>
            Manage your runs and view their messages.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full overflow-y-auto">
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
                data?.runs.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell>
                      <Badge variant="outline">{run.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{run.taskStatus}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(run.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/agents/${agentId}/runs/${run.id}/messages`}>
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {data?.pagination.currentPage || 1} -{" "}
              {Math.min(
                (data?.pagination.currentPage || 1) *
                  (data?.pagination.limit || 1),
                data?.pagination.totalCount || 1
              )}
            </strong>{" "}
            of <strong>{data?.pagination.totalCount}</strong> runs
          </div>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <Link
                to={`?page=${Math.max(
                  (data?.pagination.currentPage || 1) - 1,
                  1
                )}`}
              >
                <PaginationItem>
                  <PaginationPrevious />
                </PaginationItem>
              </Link>

              {Array.from({
                length: Math.min(data?.pagination.totalPages || 1, 3),
              }).map((_value, key) => (
                <Link to={`?page=${key + 1}`}>
                  <PaginationItem key={key}>
                    <PaginationLink>{key + 1}</PaginationLink>
                  </PaginationItem>
                </Link>
              ))}
              {data?.pagination.totalPages &&
                data?.pagination.totalPages > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

              <Link
                to={`?page=${Math.min(
                  (data?.pagination.currentPage || 1) + 1,
                  data?.pagination.totalPages || 1
                )}`}
              >
                <PaginationItem>
                  <PaginationNext />
                </PaginationItem>
              </Link>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </Tabs>
  );
}
