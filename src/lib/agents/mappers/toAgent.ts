import {
  DbAgent,
  AgentProtocol,
  AgentStatus,
  Agent,
  AgentStoredAt,
} from "../model";

export function toAgent(dbAgent: DbAgent): Agent {
  return {
    id: dbAgent.id,
    name: dbAgent.name,
    status: dbAgent.status as AgentStatus,
    protocol: dbAgent.protocol as AgentProtocol,
    storedAt: dbAgent.storedAt as AgentStoredAt,
    url: dbAgent.url,
    createdAt: new Date(dbAgent.createdAt),
  };
}
