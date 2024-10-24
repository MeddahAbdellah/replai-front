import { useNavigate, useParams } from "react-router-dom";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Message } from "../model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { createRunWithMessages } from "@/lib/runs";
import { Content } from "./content";
import { Checkbox } from "@/components/ui/checkbox";

export function CreateRunSheet({ messages }: { messages: Message[] }) {
  const { agentId } = useParams<{ agentId: string; runId: string }>();
  const navigate = useNavigate();
  const messagesToReplay = useRef<Message[]>(messages);
  const [toolsOnly, setToolsOnly] = useState<boolean>(false);
  const [includeConfigMessages, setIncludeConfigMessages] =
    useState<boolean>(true);
  useEffect(() => {
    messagesToReplay.current = messages;
  }, [messages]);
  return (
    <SheetContent className="flex flex-col max-w-screen sm:max-w-screen w-auto">
      <SheetHeader>
        <SheetTitle>Create a new run</SheetTitle>
        <SheetDescription>Here you create a new run</SheetDescription>
      </SheetHeader>
      <div className="grid grid-cols-[2fr_1fr] gap-4 overflow-hidden h-full">
        <div className="py-4 overflow-y-auto bg-black border border-zinc-700 rounded-md"></div>
        <div className="flex flex-col overflow-hidden">
          <div className="flex flex-col gap-4 py-4 overflow-y-auto w-[450px] h-full">
            {messages.map((message) => (
              <Card key={message.id} className="mb-4">
                <CardHeader className="grid grid-cols-[1fr_auto_auto] space-y-0 gap-2">
                  <Badge variant="outline" className="mr-auto">
                    {message.type}
                  </Badge>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Content
                    message={message}
                    editable={true}
                    onEdit={(updatedMessage) => {
                      if (!updatedMessage) {
                        return;
                      }
                      const updatedMessages = messages.map((m) =>
                        m.id === message.id ? updatedMessage : m
                      );
                      messagesToReplay.current = updatedMessages;
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
          <SheetFooter className="flex flex-col sm:flex-col sm:space-x-0 gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="toolsOnly"
                checked={toolsOnly}
                onCheckedChange={(checked) =>
                  setToolsOnly(checked === true || false)
                }
              />
              <label htmlFor="toolsOnly" className="text-sm font-medium">
                Execute Tools Only
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="includeConfigMessages"
                checked={includeConfigMessages}
                onCheckedChange={(checked) =>
                  setIncludeConfigMessages(checked === true || false)
                }
              />
              <label
                htmlFor="includeConfigMessages"
                className="text-sm font-medium"
              >
                Include Configuration Messages
              </label>
            </div>
            <SheetClose>
              <Button
                className="w-full"
                onClick={async () => {
                  if (!agentId) {
                    return;
                  }
                  const newRun = await createRunWithMessages({
                    agentId,
                    parameters: {
                      targetUrl: "https://example.com",
                    },
                    replayMessages: messagesToReplay.current,
                    toolsOnly,
                    includeConfigMessages,
                  });

                  navigate(`/agents/${agentId}/runs/${newRun.id}/messages`);

                  console.log("Replaying tool calls", newRun);
                }}
              >
                Run
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </div>
    </SheetContent>
  );
}
