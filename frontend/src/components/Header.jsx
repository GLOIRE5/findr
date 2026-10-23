import { Plus, Search } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-navy text-white">
            <Search className="size-4" strokeWidth={2.5} />
          </span>
          Findr
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="lg" className="hidden px-3 sm:inline-flex" asChild>
            <Link to="/#items">Browse</Link>
          </Button>
          <Button size="lg" className="px-3" asChild>
            <Link to="/report">
              <Plus /> Report item
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
