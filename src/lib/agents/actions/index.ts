import { DbAgent } from "../model";

export const fetchAgents = async (): Promise<DbAgent[]> => {
  const agents = localStorage.getItem("agents");
  return agents ? JSON.parse(agents) : [];
};

export const fetchAgent = async (
  agentId: string
): Promise<DbAgent | undefined> => {
  const agents = localStorage.getItem("agents");
  return agents
    ? JSON.parse(agents).find((agent: DbAgent) => agent.id === agentId)
    : undefined;
};

export const addAgent = async (agent: DbAgent) => {
  const agents = localStorage.getItem("agents");
  if (!agents) {
    localStorage.setItem("agents", JSON.stringify([agent]));
  } else {
    const parsed = JSON.parse(agents);
    localStorage.setItem("agents", JSON.stringify([...parsed, agent]));
  }
};
