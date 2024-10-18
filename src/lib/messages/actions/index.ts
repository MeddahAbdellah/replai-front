import { fetchAgent } from "@/lib/agents";
import { Message } from "../model";

export const fetchMessages = async (
  agentId: string,
  runId: string
): Promise<Message[]> => {
  const agent = await fetchAgent(agentId);
  const response = await fetch(`${agent?.url}/runs/${runId}/messages`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
