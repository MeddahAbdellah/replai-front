import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
  agentSource,
  AgentSource,
} from "../model";

export function AddAgentSheet(params: { onAdd: (agent: Agent) => void }) {
  const { onAdd } = params;
  const [protocol, setProtocol] = useState<AgentProtocol>();
  const [url, setUrl] = useState<string>();
  const [name, setName] = useState<string>();
  const [source, setSource] = useState<AgentSource>();
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
            value={source}
            onValueChange={(value) => setSource(value as AgentSource)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a place to store the agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(agentSource)?.map((storedAt) => (
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
              if (!name || !protocol || !url || !source) {
                return;
              }

              onAdd({
                id: crypto.randomUUID(),
                name,
                protocol: protocol as AgentProtocol,
                source,
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
