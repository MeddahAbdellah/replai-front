export interface DbRun {
  id: number;
  status: string;
  task_status: string;
  timestamp: string;
}

export const runStatus = {
  scheduled: "scheduled",
  running: "running",
  done: "done",
  failed: "failed",
} as const;

export type RunStatus = (typeof runStatus)[keyof typeof runStatus];

export interface Run {
  id: number;
  status: RunStatus;
  taskStatus: string;
  timestamp: string;
}
