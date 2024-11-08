export interface DbAgent {
  id: string;
  name: string;
  protocol: string;
  source: string;
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
} as const;

export type AgentProtocol = (typeof agentProtocol)[keyof typeof agentProtocol];

export const agentSource = {
  local: "local",
};

export type AgentSource = (typeof agentSource)[keyof typeof agentSource];

export interface Agent {
  id: string;
  name: string;
  protocol: AgentProtocol;
  source: AgentSource;
  url: string;
  createdAt: Date;
}

export type AgentInvokeParameters = Record<string, unknown>[];
