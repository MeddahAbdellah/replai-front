import { DbAgent, AgentProtocol, Agent, AgentSource } from "../model";

export async function toAgent(dbAgent: DbAgent): Promise<Agent> {
  return {
    id: dbAgent.id,
    name: dbAgent.name,
    protocol: dbAgent.protocol as AgentProtocol,
    source: dbAgent.source as AgentSource,
    url: dbAgent.url,
    createdAt: new Date(dbAgent.createdAt),
  };
}
