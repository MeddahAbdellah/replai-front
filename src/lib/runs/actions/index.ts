import { DbRun } from "../model";
import { fetchAgent } from "@/lib/agents";

export const fetchRuns = async (agentId: string): Promise<DbRun[]> => {
  const agent = await fetchAgent(agentId);
  const response = await fetch(`${agent?.url}/runs`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
