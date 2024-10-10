import { Outlet, Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { HomeIcon, UsersIcon } from "lucide-react"

export function Shell() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold">Langreplay</h1>
            <nav>
              <ul className="flex space-x-2">
                <li>
                  <Button variant="ghost" asChild>
                    <Link to="/" className="flex items-center">
                      <HomeIcon className="mr-2 h-4 w-4" />
                      Home
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" asChild>
                    <Link to="/agents" className="flex items-center">
                      <UsersIcon className="mr-2 h-4 w-4" />
                      Agents
                    </Link>
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Outlet />
      </main>
    </div>
  )
}

// ... existing code ...