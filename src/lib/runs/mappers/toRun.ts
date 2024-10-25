import { DbRun, Run, RunStatus } from "../model";

export function toRun(dbRun: DbRun): Run {
  return {
    id: dbRun.id,
    status: dbRun.status as RunStatus,
    taskStatus: dbRun.task_status,
    reason: dbRun.reason,
    timestamp: dbRun.timestamp,
  };
}
