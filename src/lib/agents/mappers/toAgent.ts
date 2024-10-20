import {
  DbAgent,
  AgentProtocol,
  AgentStatus,
  Agent,
  AgentSource,
  agentStatus,
  agentProtocol,
} from "../model";

export async function toAgent(dbAgent: DbAgent): Promise<Agent> {
  let status: AgentStatus = agentStatus.offline;
  if (
    dbAgent.protocol === agentProtocol.http ||
    dbAgent.protocol === agentProtocol.https
  ) {
    const response = await fetch(`${dbAgent.url}/health-check`).catch(() => ({
      ok: false,
    }));
    status = response.ok ? agentStatus.online : agentStatus.offline;
  }
  return {
    id: dbAgent.id,
    name: dbAgent.name,
    status,
    protocol: dbAgent.protocol as AgentProtocol,
    source: dbAgent.source as AgentSource,
    url: dbAgent.url,
    createdAt: new Date(dbAgent.createdAt),
  };
}
