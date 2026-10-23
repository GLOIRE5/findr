import { useState } from "react";
import { CircleCheck, CircleHelp, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { claimItem, markReturned } from "@/lib/api";

// Contact is either an email or a phone number (WhatsApp)
function contactLink(contact, title) {
  if (contact.includes("@")) return { href: `mailto:${contact}`, label: "Send an email", icon: Mail };
  const text = encodeURIComponent(`Hi! I think the ${title} you found on Findr is mine.`);
  return { href: `https://wa.me/${contact.replace(/\D/g, "")}?text=${text}`, label: "Message on WhatsApp", icon: MessageCircle };
}

export default function ClaimForm({ item, onReturned }) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [contact, setContact] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return setError("Enter your answer");

    setBusy(true);
    try {
      setContact((await claimItem(item.id, answer)).contact);
    } catch (err) {
      const left = err.attemptsLeft;
      setError(left === undefined ? err.message : `${err.message}. ${left} ${left === 1 ? "try" : "tries"} left.`);
      setLocked(err.status === 429 || left === 0);
    } finally {
      setBusy(false);
    }
  };

  const handleReturned = async () => {
    setBusy(true);
    try {
      onReturned(await markReturned(item.id));
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (contact) {
    const link = contactLink(contact, item.title);
    return (
      <div className="space-y-4">
        <p className="flex items-center gap-2 font-medium">
          <CircleCheck className="size-5" /> That's right! Here's the finder's contact.
        </p>
        <div className="rounded-xl bg-secondary p-4 text-lg font-semibold break-all">{contact}</div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button size="lg" className="h-10 px-4" asChild>
            <a href={link.href} target="_blank" rel="noreferrer">
              <link.icon /> {link.label}
            </a>
          </Button>
          <Button size="lg" variant="outline" className="h-10 px-4" onClick={handleReturned} disabled={busy}>
            I got it back
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-3">
      <p className="font-medium">The finder's question</p>
      <p className="flex items-start gap-2 rounded-xl bg-secondary p-4">
        <CircleHelp className="mt-0.5 size-5 shrink-0" /> {item.question}
      </p>
      <Input
        aria-label="Your answer"
        className="h-10 bg-white"
        placeholder="Your answer"
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value);
          setError("");
        }}
        disabled={locked}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="lg" className="h-10 w-full" disabled={busy || locked}>
        {busy ? "Checking…" : "Check answer"}
      </Button>
    </form>
  );
}
