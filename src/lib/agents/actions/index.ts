import { toAgent } from "../mappers/toAgent";
import { toDbAgent } from "../mappers/toDbAgent";
import { Agent, DbAgent } from "../model";

export const fetchAgents = async (): Promise<Agent[]> => {
  const agentsInLocalStorage = localStorage.getItem("agents");
  let agents: Agent[] = [];

  try {
    const storedAgents = agentsInLocalStorage
      ? JSON.parse(agentsInLocalStorage)
      : [];
    for (const storedAgent of storedAgents) {
      const agent = await toAgent(storedAgent);
      agents = [...agents, agent];
    }
  } catch (error) {
    console.error("Failed to parse agents from localStorage", error);
  }
  return agents;
};

export const fetchAgent = async (
  agentId: string
): Promise<Agent | undefined> => {
  const agents = await fetchAgents();
  return agents
    ? agents.find((agent: Agent) => agent.id === agentId)
    : undefined;
};

export const deleteAgent = async (agentId: string) => {
  const agents = localStorage.getItem("agents");
  if (!agents) {
    return;
  }
  const parsed = JSON.parse(agents);
  const updated = parsed.filter((agent: DbAgent) => agent.id !== agentId);
  localStorage.setItem("agents", JSON.stringify(updated));
  return { id: agentId };
};

export const addAgent = async (agent: Agent) => {
  const dbAgent = toDbAgent(agent);
  const agents = localStorage.getItem("agents");
  if (!agents) {
    localStorage.setItem("agents", JSON.stringify([dbAgent]));
  } else {
    const parsed = JSON.parse(agents);
    localStorage.setItem("agents", JSON.stringify([...parsed, dbAgent]));
  }
};

export function createNewRun(
  agentId: string,
  parameters: Record<string, unknown>
) {
  const agents = localStorage.getItem("agents");
  if (!agents) {
    throw new Error("No agents found in localStorage");
  }
  const agent: DbAgent = JSON.parse(agents)
    .map(toAgent)
    .find((agent: DbAgent) => agent.id === agentId);
  if (!agent) {
    throw new Error("Agent not found");
  }
  return fetch(`${agent.url}/runs`, {
    method: "POST",
    body: JSON.stringify({ parameters, includeConfigMessages: true }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}
