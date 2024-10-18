export interface ToolCall {
  name: string;
  args: { input: string | { [key: string]: string } };
}

export type Content =
  | string
  | (
      | string
      | { type: "image_url"; image_url: { url: string } }
      | { type: "text"; text: string }
    )[];

export interface Message {
  id: string;
  runId: string;
  type: string;
  content?: Content;
  toolCalls?: ToolCall[];
  timestamp: number;
}
