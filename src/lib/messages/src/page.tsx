import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { fetchMessages } from "../actions";
import { Message } from "../model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { X } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { fetchRun, runStatus, Run } from "@/lib/runs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CreateRunSheet } from "./createRunSheet";
import { Content } from "./content";

export function MessagesList() {
  const { agentId, runId } = useParams<{ agentId: string; runId: string }>();

  const { data: run } = useQuery<Run, Error>({
    queryKey: ["run", runId],
    queryFn: () => fetchRun(agentId!, runId!),
    refetchInterval: 5000,
  });

  const { data: messages } = useQuery<Message[], Error>({
    queryKey: ["messages", runId],
    queryFn: () => fetchMessages(agentId!, runId!),
    refetchInterval: 1000,
    enabled: run?.status !== runStatus.done && run?.status !== runStatus.failed,
  });
  const [messagesToReplay, setMessagesToReplay] = useState<Message[]>([]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-h-screen h-full md:min-w-[450px] overflow-y-hidden"
    >
      <ResizablePanel defaultSize={70}>
        <ResizablePanelGroup className="flex flex-col" direction="vertical">
          <ResizablePanel defaultSize={15}>
            <div className="flex flex-col gap-2 p-6">
              <p className="font-semibold text-sm">
                Run Id: {<span className="font-light text-sm">{run?.id}</span>}
              </p>
              <p className="font-semibold text-sm">
                Run status: {<Badge>{run?.status}</Badge>}
              </p>
              <p className="font-semibold text-sm">
                Task status: {<Badge>{run?.taskStatus}</Badge>}
              </p>
              <p className="font-semibold text-sm">
                Run created on:{" "}
                {
                  <span className="font-light text-sm">
                    {run?.timestamp
                      ? new Date(run?.timestamp).toISOString()
                      : "Unknown"}
                  </span>
                }
              </p>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={85}>
            <div className="h-full flex flex-col overflow-auto p-2">
              {messages?.map((message) => (
                <Card key={message.id} className="mb-4">
                  <CardHeader className="grid grid-cols-[1fr_auto_auto_auto] space-y-0 gap-2">
                    <Badge variant="outline" className="mr-auto">
                      {message.type}
                    </Badge>
                    <Button
                      variant="secondary"
                      size={"sm"}
                      onClick={() => {
                        setMessagesToReplay([...messagesToReplay, message]);
                      }}
                    >
                      Add only this message
                    </Button>
                    <Button
                      variant="secondary"
                      size={"sm"}
                      onClick={() => {
                        setMessagesToReplay(
                          messagesToReplay?.slice(0, messages.indexOf(message))
                        );
                      }}
                    >
                      Remove from this message
                    </Button>
                    <Button
                      variant="secondary"
                      size={"sm"}
                      onClick={() => {
                        // add all tool calls from this message to the end of the messages to toolCallsToReplay
                        const messagesAfterThisMessage = messages?.slice(
                          messages.indexOf(message)
                        );

                        if (!messagesAfterThisMessage) {
                          return;
                        }

                        setMessagesToReplay([
                          ...messagesToReplay,
                          ...messagesAfterThisMessage,
                        ]);
                      }}
                    >
                      Add from this message
                    </Button>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <Content message={message} editable={false} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="p-2" defaultSize={30}>
        <div className="flex flex-col h-full">
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {messagesToReplay.map((message, index) => (
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <Badge variant="outline" className="mr-auto">
                    {message.type}
                  </Badge>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <X
                      className="h-4 w-4"
                      onClick={() => {
                        setMessagesToReplay(
                          messagesToReplay.filter((_, i) => i !== index)
                        );
                      }}
                    />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <Content message={message} editable={false} />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-between items-center p-6">
            <p className="font-semibold text-sm">
              Actions {`(${messagesToReplay.length})`}
            </p>
            <div className="flex">
              <Button
                className="w-full"
                variant={"secondary"}
                onClick={() => {
                  setMessagesToReplay([]);
                }}
              >
                Clear all
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    className="ml-4 w-full"
                    disabled={messagesToReplay.length === 0}
                  >
                    Launch a run
                  </Button>
                </SheetTrigger>
                <CreateRunSheet messages={messagesToReplay} />
              </Sheet>
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
