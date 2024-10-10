import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ReactJson from "react-json-view";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { fetchMessages } from "../actions";
import { DbMessage, Message, type ToolCall } from "../model";
import { Badge } from "@/components/ui/badge";
import { toMessage } from "./toMessage";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { X } from "lucide-react";

export function MessagesList() {
  const { agentId, runId } = useParams<{ agentId: string; runId: string }>();

  const { data: dbMessages } = useQuery<DbMessage[], Error>({
    queryKey: ["messages", runId],
    queryFn: () => fetchMessages(agentId!, runId!),
    enabled: !!runId,
  });
  const messages = dbMessages?.map(toMessage) || [];
  const [toolCallsToReplay, setToolCallsToReplay] = useState<ToolCall[]>([]);

  return (
    <div className="h-full px-4 gap-4 grid grid-cols-[2fr_1fr]">
      <div className="flex flex-col overflow-y-auto">
        {messages.map((message) => (
          <Card key={message.id} className="mb-4">
            <CardHeader className="grid grid-cols-[1fr_auto_auto] space-y-0 gap-2">
              <Badge variant="outline" className="mr-auto">
                {message.type}
              </Badge>
              {message.toolCalls && message.toolCalls.length > 0 ? (
                <Button
                  variant="secondary"
                  size={"sm"}
                  onClick={() => {
                    setToolCallsToReplay([
                      ...toolCallsToReplay,
                      ...(message.toolCalls || []),
                    ]);
                  }}
                >
                  Replay only this action
                </Button>
              ) : null}

              <Button
                variant="secondary"
                size={"sm"}
                onClick={() => {
                  // add all tool calls from this message to the end of the messages to toolCallsToReplay
                  const messagesAfterThisMessage = messages?.slice(
                    messages.indexOf(message) + 1
                  );

                  if (!messagesAfterThisMessage) {
                    return;
                  }

                  const toolCalls = messagesAfterThisMessage
                    .map((message) => message.toolCalls || [])
                    .flat();

                  setToolCallsToReplay([...toolCallsToReplay, ...toolCalls]);
                }}
              >
                Replay from this message
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Content message={message} />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="flex flex-col overflow-y-hidden">
        <CardHeader>
          <h2 className="text-xl font-bold">
            Actions {`(${toolCallsToReplay.length})`}
          </h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {toolCallsToReplay.map((toolCall, index) => (
            <Card>
              <CardHeader className="pb-0">
                <X
                  className="ml-auto cursor-pointer"
                  size={20}
                  onClick={() => {
                    setToolCallsToReplay(
                      toolCallsToReplay.filter((_, i) => i !== index)
                    );
                  }}
                />
              </CardHeader>
              <CardContent>
                <ToolCallDisplay key={index} toolCall={toolCall} />
              </CardContent>
            </Card>
          ))}
        </CardContent>
        <CardFooter>
          <Button
            variant={"secondary"}
            className="ml-auto"
            onClick={() => {
              setToolCallsToReplay([]);
            }}
          >
            Clear all
          </Button>
          <Button
            className="ml-4"
            onClick={() => {
              console.log("Replaying tool calls", toolCallsToReplay);
            }}
          >
            Play
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function SimpleText({ text }: { text: string | undefined }) {
  return (
    <div className="bg-secondary border rounded-md flex p-8">
      <small className="text-sm font-medium leading-none text-left line-height-1">
        {`"${text}"`}
      </small>
    </div>
  );
}

function ToolCallDisplay({ toolCall }: { toolCall: ToolCall }) {
  return (
    <div className="w-full p-2">
      <Badge className="mb-2">{toolCall.name}</Badge>
      <div className="overflow-auto">
        <ReactJson
          src={toolCall.args}
          theme="rjv-default"
          displayDataTypes={false}
          name={false}
          collapsed={1}
          enableClipboard={true}
          collapseStringsAfterLength={30}
          indentWidth={2}
        />
      </div>
    </div>
  );
}

function Content({ message }: { message: Message }) {
  return (
    <>
      {!message.content ? null : !Array.isArray(message.content) ? (
        <SimpleText text={message.content}></SimpleText>
      ) : (
        message.content?.map((content, index) => {
          if (typeof content === "string") {
            return <SimpleText text={content}></SimpleText>;
          }

          switch (content.type) {
            case "image_url":
              return <img key={index} src={content.image_url.url} alt="" />;
            case "text":
              return <SimpleText text={content.text}></SimpleText>;
            default:
              return null;
          }
        })
      )}
      {message.toolCalls &&
        message.toolCalls.map((toolCall, index) => (
          <ToolCallDisplay key={`toolCall-${index}`} toolCall={toolCall} />
        ))}
    </>
  );
}
