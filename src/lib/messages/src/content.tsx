import ReactJson from "react-json-view";

import { Message, type ToolCall } from "../model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function SimpleText({
  text,
  editable,
  onEdit,
}: {
  text: string | undefined;
  editable: boolean;
  onEdit?: (updatedText: string) => void;
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
            editable
              ? (edit) =>
                  onEdit
                    ? onEdit((edit.updated_src as { text: string }).text)
                    : void 0
              : undefined
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
    <div className="w-full">
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

export function Content({
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
                onEdit={(updatedText) => {
                  if (!updatedText || !onEdit) {
                    return;
                  }
                  if (!Array.isArray(message.content)) {
                    return;
                  }
                  const updatedContent = message.content.map((c, i) =>
                    i === index ? updatedText : c
                  );
                  onEdit({ ...message, content: updatedContent });
                }}
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
