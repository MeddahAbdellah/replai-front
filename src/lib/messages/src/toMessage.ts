import { DbMessage, Message, Content, ToolCall } from "../model";

export function toMessage(dbMessage: DbMessage): Message {
  let content: Content;
  let toolCalls: ToolCall[] | undefined = undefined;

  try {
    content = JSON.parse(dbMessage.content);
  } catch {
    content = dbMessage.content;
  }

  if (dbMessage.tool_call) {
    try {
      toolCalls = JSON.parse(dbMessage.tool_call);
    } catch {
      console.log("Failed to parse tool_call");
    }
  }

  return {
    id: dbMessage.id,
    type: dbMessage.type,
    content,
    ...(toolCalls ? { toolCalls } : {}), // Type assertion as ToolCall might be undefined
    timestamp: dbMessage.timestamp,
  };
}
