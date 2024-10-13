export interface DbAgent {
  id: string;
  name: string;
  status: string;
  protocol: string;
  storedAt: string;
  url: string;
  createdAt: string;
}

export const agentStatus = {
  online: "online",
  offline: "offline",
} as const;

export type AgentStatus = (typeof agentStatus)[keyof typeof agentStatus];

export const agentProtocol = {
  http: "http",
  https: "https",
  webSocket: "webSocket",
  protobuff: "protobuff",
} as const;

export type AgentProtocol = (typeof agentProtocol)[keyof typeof agentProtocol];

export const agentStoredAt = {
  local: "local",
};

export type AgentStoredAt = (typeof agentStoredAt)[keyof typeof agentStoredAt];

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  protocol: AgentProtocol;
  storedAt: AgentStoredAt;
  url: string;
  createdAt: Date;
}
