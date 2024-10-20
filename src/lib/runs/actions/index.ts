import { Message } from "@/lib/messages/model";
import { toRun } from "../mappers/toRun";
import { Filters, GetRunsResponse, Order, Pagination, Run } from "../model";
import { fetchAgent } from "@/lib/agents";

export const fetchRuns = async (
  agentId: string,
  pagination: Pagination,
  order: Order,
  filters?: Filters
): Promise<GetRunsResponse> => {
  const agent = await fetchAgent(agentId);
  const queryParams = new URLSearchParams({
    page: pagination.page.toString(),
    limit: pagination.limit.toString(),
    order: order,
    ...(filters?.status && { status: filters.status }),
    ...(filters?.taskStatus && { taskStatus: filters.taskStatus }),
  });

  const response = await fetch(`${agent?.url}/runs?${queryParams}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const paginatedResponse = await response.json();

  return {
    runs: paginatedResponse.runs.map(toRun),
    pagination: paginatedResponse.pagination,
  };
};

export const fetchRun = async (
  agentId: string,
  runId: string
): Promise<Run> => {
  const agent = await fetchAgent(agentId);
  const response = await fetch(`${agent?.url}/runs/${runId}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const dbRun = await response.json();

  return toRun(dbRun);
};

export const createRunWithMessages = async (runConfig: {
  agentId: string;
  parameters: Record<string, unknown>;
  replayMessages: Message[];
  toolsOnly: boolean;
  includeConfigMessages: boolean;
}) => {
  const agent = await fetchAgent(runConfig.agentId);
  const response = await fetch(`${agent?.url}/runs`, {
    method: "POST",
    body: JSON.stringify({
      parameters: runConfig.parameters,
      replayMessages: runConfig.replayMessages,
      toolsOnly: runConfig.toolsOnly,
      includeConfigMessages: runConfig.includeConfigMessages,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to create run with messages");
  }
  return response.json();
};
