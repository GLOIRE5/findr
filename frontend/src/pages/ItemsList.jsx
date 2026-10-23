import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getItems } from "@/lib/api";

const categories = ["electronics", "documents", "accessories", "clothing", "other"];

// Wait this long after the last key press before searching
const SEARCH_DELAY_MS = 300;

export default function ItemsList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Cancels the old request when filters change, so an older,
    // slower response cannot replace newer results
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      getItems({ q: search.trim(), status, category, returned: false }, { signal: controller.signal })
        .then((data) => {
          setItems(data);
          setError("");
        })
        .catch((err) => {
          if (err.name !== "AbortError") setError(err.message);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, SEARCH_DELAY_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, status, category]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="bg-navy px-4 pt-10 pb-16 text-white sm:pt-14 sm:pb-20">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Lost something?<br />We'll help you find it.
          </h1>
          <p className="mt-3 text-sm text-white/75 sm:text-base">
            Report lost or found items and reconnect your campus community with their belongings.
          </p>

          <div className="mt-8">
            <Input
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full bg-white text-foreground placeholder:text-muted-foreground shadow-sm"
            />
          </div>

          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Select value={status || "all"} onValueChange={(val) => setStatus(val === "all" ? "" : val)}>
              <SelectTrigger className="h-10 w-full bg-white text-foreground sm:w-44">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="found">Found</SelectItem>
              </SelectContent>
            </Select>

            <Select value={category || "all"} onValueChange={(val) => setCategory(val === "all" ? "" : val)}>
              <SelectTrigger className="h-10 w-full bg-white text-foreground capitalize sm:w-48">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <main id="items" className="mx-auto w-full max-w-[1120px] flex-1 scroll-mt-16 px-4 py-8 sm:px-6 sm:py-12">
        {error ? (
          <div role="alert" className="rounded-2xl border border-destructive/40 bg-card p-12 text-center text-sm text-destructive">
            {error}
          </div>
        ) : loading && items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            Loading items...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No items match your search.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.id} className="flex">
                <Card className="flex w-full flex-col justify-between border bg-card transition-colors hover:border-navy/40">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={item.status === "lost" ? "destructive" : "secondary"} className="capitalize">
                        {item.status}
                      </Badge>
                    </div>
                    <CardTitle className="pt-1 text-base font-semibold text-card-foreground">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="size-3.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {item.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="size-3.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                          <line x1="16" x2="16" y1="2" y2="6" />
                          <line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                        {item.date}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Badge variant="outline" className="font-normal capitalize text-muted-foreground">
                      {item.category}
                    </Badge>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}