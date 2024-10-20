import { useNavigate, useParams } from "react-router-dom";
import ReactJson from "react-json-view";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Message, type ToolCall } from "../model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { createRunWithMessages } from "@/lib/runs";

export function CreateRunSheet({ messages }: { messages: Message[] }) {
  const { agentId } = useParams<{ agentId: string; runId: string }>();
  const navigate = useNavigate();
  const messagesToReplay = useRef<Message[]>(messages);
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
        <div className="flex flex-col gap-4 py-4 overflow-y-auto w-[450px]">
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
      </div>

      <SheetFooter className="mt-auto">
        <SheetClose>
          <Button
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
                toolsOnly: true,
                includeConfigMessages: true,
              });

              navigate(`/agents/${agentId}/runs/${newRun.id}/messages`);

              console.log("Replaying tool calls", newRun);
            }}
          >
            Run
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}

function SimpleText({
  text,
  editable,
}: {
  text: string | undefined;
  editable: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between space-x-4">
          <Badge>Text</Badge>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <ReactJson
          src={{ text }}
          theme="rjv-default"
          displayDataTypes={false}
          name={false}
          collapsed={1}
          enableClipboard={true}
          collapseStringsAfterLength={30}
          indentWidth={2}
          onEdit={
            editable ? (edit) => console.log(edit.updated_src) : undefined
          }
        />
      </CollapsibleContent>
    </Collapsible>
  );
}

function ToolCallDisplay({
  toolCall,
  editable,
  onEdit,
}: {
  toolCall: ToolCall;
  editable: boolean;
  onEdit?: (updatedSrc: ToolCall["args"]) => void;
}) {
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
          onEdit={
            editable
              ? (edit) =>
                  onEdit ? onEdit(edit.updated_src as ToolCall["args"]) : void 0
              : undefined
          }
        />
      </div>
    </div>
  );
}

function ImageMessage({ src }: { src: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between space-x-4">
          <Badge>Image</Badge>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <img src={src} alt="" />
      </CollapsibleContent>
    </Collapsible>
  );
}

function Content({
  message,
  editable,
  onEdit,
}: {
  message: Message;
  editable: boolean;
  onEdit?: (updatedSrc: Message) => void;
}) {
  return (
    <>
      {!message.content ? null : !Array.isArray(message.content) ? (
        <SimpleText text={message.content} editable={editable}></SimpleText>
      ) : (
        message.content?.map((content, index) => {
          if (typeof content === "string") {
            return (
              <SimpleText
                key={index}
                text={content}
                editable={editable}
              ></SimpleText>
            );
          }

          switch (content.type) {
            case "image_url":
              return <ImageMessage key={index} src={content.image_url.url} />;
            case "text":
              return (
                <SimpleText
                  key={index}
                  text={content.text}
                  editable={editable}
                ></SimpleText>
              );
            default:
              return null;
          }
        })
      )}
      {message.toolCalls &&
        message.toolCalls.map((toolCall, index) => (
          <ToolCallDisplay
            key={`toolCall-${index}`}
            toolCall={toolCall}
            editable={editable}
            onEdit={(updatedTool) => {
              if (!updatedTool || !onEdit) {
                return;
              }
              const updatedToolCalls = message.toolCalls?.map((tc, i) =>
                i === index ? { ...tc, args: updatedTool } : tc
              );
              onEdit({ ...message, toolCalls: updatedToolCalls });
            }}
          />
        ))}
    </>
  );
}
