import { Outlet, Link } from "react-router-dom";
import { Home, LineChart, Package2, Settings, Users2 } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { Badge } from "@/components/ui/badge";

const Sidebar = () => {
  return (
    <aside className="relative hidden w-14 flex-col border-r bg-background sm:flex transition-all duration-500">
      <nav className="absolute flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          to="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/home"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <Badge className="shadow-lg">Home</Badge>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/agents"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Users2 className="h-5 w-5" />
              <span className="sr-only">Agents</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <Badge className="shadow-lg">Agents</Badge>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/analytics"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <LineChart className="h-5 w-5" />
              <span className="sr-only">Analytics</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <Badge className="shadow-lg">Analytics</Badge>
          </TooltipContent>
        </Tooltip>
      </nav>
      <nav className="absolute bottom-0 flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/settings"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <Badge className="shadow-lg">Settings</Badge>
          </TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
};

export function Shell() {
  return (
    <div className="flex min-h-screen max-h-screen w-full">
      <Sidebar />
      <main className="flex min-h-screen max-h-screen border-box flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
}

// ... existing code ...
