import { Agent, DbAgent } from "../model";

export function toDbAgent(agent: Agent): DbAgent {
  return {
    id: agent.id,
    name: agent.name,
    status: agent.status,
    protocol: agent.protocol,
    storedAt: agent.storedAt,
    url: agent.url,
    createdAt: agent.createdAt.toISOString(),
  };
}
