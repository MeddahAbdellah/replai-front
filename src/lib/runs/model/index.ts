export interface DbRun {
  id: number;
  status: string;
  task_status: string;
  created_at: string;
}

export const runStatus = {
  scheduled: "scheduled",
  running: "running",
  success: "success",
  failed: "failed",
} as const;

export type RunStatus = (typeof runStatus)[keyof typeof runStatus];

export interface Run {
  id: number;
  status: RunStatus;
  taskStatus: string;
  createdAt: string;
}
