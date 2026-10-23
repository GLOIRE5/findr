import { useState } from "react";
import { Link } from "react-router";
import { Check, Copy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportSuccess({ item, onReset }) {
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}/items/${item.id}`;
  const message =
    item.status === "found"
      ? `Found: ${item.title} (${item.location}). Is it yours? Claim it on Findr: ${url}`
      : `Lost: ${item.title} (${item.location}). Seen it? Help return it on Findr: ${url}`;

  const copyLink = () =>
    navigator.clipboard.writeText(url).then(
      () => setCopied(true),
      () => {}
    );

  return (
    <div className="rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-8">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-navy text-white animate-in zoom-in-50 duration-300">
        <Check className="size-7" strokeWidth={2.5} />
      </div>
      <p className="mt-4 text-lg font-semibold">{item.title}</p>
      <p className="text-sm text-muted-foreground">
        Posted as {item.status} · {item.location}
      </p>

      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <Button size="lg" className="h-10 px-4" asChild>
          <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">
            <MessageCircle /> Share to WhatsApp
          </a>
        </Button>
        <Button size="lg" variant="outline" className="h-10 px-4" onClick={copyLink}>
          {copied ? <Check /> : <Copy />} {copied ? "Link copied" : "Copy link"}
        </Button>
      </div>

      <div className="mt-6 flex justify-center gap-6 border-t pt-5 text-sm">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          Back to items
        </Link>
        <Link to={`/items/${item.id}`} className="text-muted-foreground hover:text-foreground">
          View your post
        </Link>
        <button type="button" onClick={onReset} className="text-muted-foreground hover:text-foreground">
          Report another
        </button>
      </div>
    </div>
  );
}
