import { type Location } from "react-router-dom";

export const runsTabs = {
  all: "All",
  scheduled: "Scheduled",
  running: "Running",
  failed: "Failed",
  done: "Done",
  taskSuccess: "Task Successful",
  taskFailed: "Task Failed",
} as const;
type RunsTabs = keyof typeof runsTabs;

export const createLinkToTab = (location: Location, tab: RunsTabs) => {
  const searchParamsByTabMap: Record<RunsTabs, () => string> = {
    all: () => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete("status");
      searchParams.delete("taskStatus");
      return `${location.pathname}?${searchParams.toString()}`;
    },
    scheduled: () => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("status", "scheduled");
      searchParams.delete("taskStatus");
      return `${location.pathname}?${searchParams.toString()}`;
    },
    running: () => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("status", "running");
      searchParams.delete("taskStatus");
      return `${location.pathname}?${searchParams.toString()}`;
    },
    failed: () => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("status", "failed");
      searchParams.delete("taskStatus");
      return `${location.pathname}?${searchParams.toString()}`;
    },
    done: () => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("status", "done");
      searchParams.delete("taskStatus");
      return `${location.pathname}?${searchParams.toString()}`;
    },
    taskSuccess: () => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("taskStatus", "success");
      searchParams.delete("status");
      return `${location.pathname}?${searchParams.toString()}`;
    },
    taskFailed: () => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("taskStatus", "failed");
      searchParams.delete("status");
      return `${location.pathname}?${searchParams.toString()}`;
    },
  } as const;

  return searchParamsByTabMap[tab]();
};
