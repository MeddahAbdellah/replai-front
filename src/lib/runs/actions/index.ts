import { toRun } from "../mappers/toRun";
import { Run } from "../model";
import { fetchAgent } from "@/lib/agents";

export const fetchRuns = async (agentId: string): Promise<Run[]> => {
  const agent = await fetchAgent(agentId);
  const response = await fetch(`${agent?.url}/runs`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const dbRuns = await response.json();

  return dbRuns.map(toRun);
};
