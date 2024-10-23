import { Agent, DbAgent } from "../model";

export function toDbAgent(agent: Agent): DbAgent {
  return {
    id: agent.id,
    name: agent.name,
    protocol: agent.protocol,
    source: agent.source,
    url: agent.url,
    createdAt: agent.createdAt.toISOString(),
  };
}
