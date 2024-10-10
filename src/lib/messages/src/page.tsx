import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ReactJson from "react-json-view";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { fetchMessages } from "../actions";
import { DbMessage, Message, type ToolCall } from "../model";
import { Badge } from "@/components/ui/badge";
import { toMessage } from "./toMessage";
import { Button } from "@/components/ui/button";

export function MessagesList() {
  const { agentId, runId } = useParams<{ agentId: string; runId: string }>();

  const { data: messages } = useQuery<DbMessage[], Error>({
    queryKey: ["messages", runId],
    queryFn: () => fetchMessages(agentId!, runId!),
    enabled: !!runId,
  });

  return (
    <div className="min-h-screen flex flex-col px-4">
      {messages?.map(toMessage).map((message) => (
        // a card that displays the message text and has a play button on the top right corner
        // also has labels on the bottom left corner
        <Card key={message.id} className="mb-4">
          <CardHeader className="grid grid-cols-[1fr_auto_auto] space-y-0 gap-2">
            <Badge variant="outline" className="mr-auto">
              {message.type}
            </Badge>
            <Button variant="secondary" size={"sm"}>
              Replay only this action
            </Button>
            <Button variant="secondary" size={"sm"}>
              Replay from this action
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Content message={message} />
          </CardContent>
        </Card>
      ))}
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
      <ReactJson
        src={toolCall.args}
        theme="rjv-default"
        displayDataTypes={false}
        name={false}
        collapsed={1}
        enableClipboard={true}
      />
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
