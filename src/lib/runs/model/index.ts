export interface DbRun {
  id: number;
  status: string;
  task_status: string;
  timestamp: string;
}

export interface Pagination {
  page: number;
  limit: number;
}

export type Order = "asc" | "desc";

export interface Filters {
  status: string;
  taskStatus: string;
}

export interface GetRunsResponse {
  runs: Run[];
  pagination: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
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
