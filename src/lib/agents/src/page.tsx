import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Agent,
  AgentProtocol,
  agentProtocol,
  AgentStatus,
  agentStatus,
  agentStoredAt,
  AgentStoredAt,
} from "../model";
import { addAgent, createNewRun, fetchAgents } from "../actions";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export function AgentsPage() {
  const {
    data: fetchedAgents,
    isLoading,
    error,
  } = useQuery<Agent[], Error>({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });
  const [addedAgents, setAddedAgents] = useState<Agent[]>([]);
  const navigate = useNavigate();

  const agents = fetchedAgents
    ? [...fetchedAgents, ...addedAgents]
    : addedAgents;

  return (
    <Tabs className="px-4 flex flex-col h-full py-8" defaultValue="all">
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
                setAddedAgents((prev) => [...prev, agent]);
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
          <TabsContent value="all">
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
                  // Existing agent rows
                  agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="hidden sm:table-cell">
                        {agent.protocol}
                      </TableCell>
                      <TableCell className="font-medium">
                        {agent.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{agent.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {agent.storedAt}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {agent.createdAt.toISOString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
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
                                const run = await createNewRun(agent.id, {
                                  targetUrl:
                                    "https://careers.thalesgroup.com/global/en/apply?jobSeqNo=TGPTGWGLOBALR0235440EXTERNALENGLOBAL&source=WORKDAY&utm_source=linkedin&utm_medium=phenom-feeds&step=1",
                                });

                                navigate(
                                  `/agents/${agent.id}/runs/${run.id}/messages`
                                );
                              }}
                            >
                              Invoke
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
            Showing <strong>1-10</strong> of <strong>32</strong> products
          </div>
        </CardFooter>
      </Card>
    </Tabs>
  );
}

function AddAgentSheet(params: { onAdd: (agent: Agent) => void }) {
  const { onAdd } = params;
  const [protocol, setProtocol] = useState<AgentProtocol>();
  const [url, setUrl] = useState<string>();
  const [name, setName] = useState<string>();
  const [storedAt, setStoredAt] = useState<AgentStoredAt>();
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Add a new agent</SheetTitle>
        <SheetDescription>
          Configure a new agent to connect to it and read its data.
        </SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col gap-2">
          <Label>Name</Label>
          <Input
            id="name"
            value={name}
            className="col-span-3"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Protocol</Label>

          <Select
            value={protocol}
            onValueChange={(value) => setProtocol(value as AgentProtocol)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a protocol" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(agentProtocol)?.map((protocol) => (
                  <SelectItem key={protocol} value={protocol}>
                    {protocol}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Url</Label>
          <Input
            id="url"
            value={url}
            className="col-span-3"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Store at</Label>

          <Select
            value={storedAt}
            onValueChange={(value) => setStoredAt(value as AgentStoredAt)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a place to store the agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(agentStoredAt)?.map((storedAt) => (
                  <SelectItem key={storedAt} value={storedAt}>
                    {storedAt}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button
            onClick={async () => {
              if (!name || !protocol || !url || !storedAt) {
                return;
              }
              let status: AgentStatus = agentStatus.offline;
              if (
                protocol === agentProtocol.http ||
                protocol === agentProtocol.https
              ) {
                const response = await fetch(url);
                status = response.ok ? agentStatus.online : agentStatus.offline;
              }

              onAdd({
                id: crypto.randomUUID(),
                name,
                status,
                protocol: protocol as AgentProtocol,
                storedAt,
                url,
                createdAt: new Date(),
              });
            }}
          >
            Add agent
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
