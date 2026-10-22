import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, Calendar, Eye, Hand, Lock, Mail, MessageCircle, PackageSearch, Pencil, Sparkles } from "lucide-react";
import Chip from "@/components/Chip";
import ReportSuccess from "@/components/ReportSuccess";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { campusSpots, categories, suggestedQuestions } from "@/data/reportOptions";
import { createItem } from "@/lib/api";
import { cn } from "@/lib/utils";

const isoDate = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
};

const modes = {
  lost: {
    label: "I lost something",
    hint: "Let finders reach you",
    icon: PackageSearch,
    title: "What did you lose?",
    subtitle: "Takes about a minute. Let's get it back to you.",
    cta: "Post lost item",
  },
  found: {
    label: "I found something",
    hint: "Help the owner claim it",
    icon: Hand,
    title: "What did you find?",
    subtitle: "Takes about a minute. The owner will thank you.",
    cta: "Post found item",
  },
};

const contactMethods = {
  whatsapp: { label: "WhatsApp", icon: MessageCircle, type: "tel", placeholder: "+250 788 123 456" },
  email: { label: "Email", icon: Mail, type: "email", placeholder: "you@example.com" },
};

function validate(form) {
  const errors = {};
  if (!form.category) errors.category = "Choose a category";
  if (!form.title.trim()) errors.title = "Enter the item name";
  if (!form.location.trim()) errors.location = "Choose or enter a location";
  if (!form.date) errors.date = "Pick a date";
  if (form.status === "found") {
    if (!form.question.trim()) errors.question = "Add a question only the owner can answer";
    if (!form.answer.trim()) errors.answer = "Enter the answer";
  }
  const contact = form.contact.trim();
  if (form.contactMethod === "email" && !/^\S+@\S+\.\S+$/.test(contact)) errors.contact = "Enter a valid email";
  if (form.contactMethod === "whatsapp" && contact.replace(/\D/g, "").length < 9) errors.contact = "Enter a valid phone number";
  return errors;
}

function Field({ label, hint, error, htmlFor, children }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label}
        {hint && <span className="font-normal text-muted-foreground">· {hint}</span>}
      </Label>
      {children}
      {[error].flat().filter(Boolean).map((msg) => (
        <p key={msg} className="text-sm text-destructive">
          {msg}
        </p>
      ))}
    </div>
  );
}

export default function ReportItem() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    status: params.get("type") === "lost" ? "lost" : "found",
    category: "",
    title: "",
    location: "",
    date: isoDate(),
    question: "",
    answer: "",
    contactMethod: "whatsapp",
    contact: "",
  });
  const [errors, setErrors] = useState({});
  const [customSpot, setCustomSpot] = useState(false);
  const [customDate, setCustomDate] = useState(false);
  const [created, setCreated] = useState(null);

  const mode = modes[form.status];
  const contact = contactMethods[form.contactMethod];

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    if (Object.keys(found).length) return setErrors(found);

    const { status, category, title, location, date, question, answer } = form;
    const item = { status, category, title: title.trim(), location: location.trim(), date, contact: form.contact.trim() };
    if (status === "found") Object.assign(item, { question: question.trim(), answer: answer.trim() });

    setCreated(await createItem(item));
    window.scrollTo(0, 0);
  };

  const reset = () => {
    setForm((f) => ({ ...f, category: "", title: "", location: "", question: "", answer: "" }));
    setCustomSpot(false);
    setCreated(null);
  };

  return (
    <main className="pb-20">
      <section className="bg-navy px-4 pt-8 pb-24 text-white">
        <div className="mx-auto max-w-xl">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="size-4" /> Back to items
          </Link>
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {created ? "It's on the board" : mode.title}
          </h1>
          <p className="mt-2 text-center text-white/75">
            {created ? "Share it with your cohort so it gets seen faster." : mode.subtitle}
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-16 max-w-xl px-4">
        {created ? (
          <ReportSuccess item={created} onReset={reset} />
        ) : (
          <form noValidate onSubmit={handleSubmit} className="space-y-7 rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(modes).map(([value, { label, hint, icon: Icon }]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={form.status === value}
                  onClick={() => set("status", value)}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-colors hover:border-navy/40",
                    form.status === value && "border-navy bg-secondary hover:border-navy"
                  )}
                >
                  <Icon className="size-5" />
                  <p className="mt-2 font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{hint}</p>
                </button>
              ))}
            </div>

            <Field label="What is it?" error={[errors.category, errors.title]} htmlFor="title">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {categories.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={form.category === value}
                    onClick={() => set("category", value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border bg-white py-3 text-xs transition-colors hover:border-navy/40",
                      form.category === value && "border-navy bg-navy text-white hover:border-navy"
                    )}
                  >
                    <Icon className="size-5" />
                    {label}
                  </button>
                ))}
              </div>
              <Input
                id="title"
                className="h-10 bg-white"
                placeholder="Item name, e.g. Black iPhone 12"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                aria-invalid={!!errors.title}
              />
            </Field>

            <Field label="Where?" error={errors.location}>
              <div className="flex flex-wrap gap-2">
                {campusSpots.map((spot) => (
                  <Chip
                    key={spot}
                    selected={!customSpot && form.location === spot}
                    onClick={() => {
                      setCustomSpot(false);
                      set("location", spot);
                    }}
                  >
                    {spot}
                  </Chip>
                ))}
                <Chip
                  selected={customSpot}
                  onClick={() => {
                    setCustomSpot(true);
                    set("location", "");
                  }}
                >
                  <Pencil /> Somewhere else
                </Chip>
              </div>
              {customSpot && (
                <Input
                  autoFocus
                  className="h-10 bg-white"
                  placeholder="Where exactly?"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  aria-invalid={!!errors.location}
                />
              )}
            </Field>

            <Field label="When?" error={errors.date}>
              <div className="flex flex-wrap gap-2">
                {["Today", "Yesterday"].map((label, daysAgo) => (
                  <Chip
                    key={label}
                    selected={!customDate && form.date === isoDate(daysAgo)}
                    onClick={() => {
                      setCustomDate(false);
                      set("date", isoDate(daysAgo));
                    }}
                  >
                    {label}
                  </Chip>
                ))}
                <Chip selected={customDate} onClick={() => setCustomDate(true)}>
                  <Calendar /> Pick a date
                </Chip>
              </div>
              {customDate && (
                <Input
                  type="date"
                  className="h-10 w-auto bg-white"
                  max={isoDate()}
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  aria-invalid={!!errors.date}
                />
              )}
            </Field>

            {form.status === "found" && (
              <Field label="Secret question" hint="only the owner should know" htmlFor="question" error={[errors.question, errors.answer]}>
                {form.category && (
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions[form.category].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => set("question", q)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-xs transition-colors hover:bg-secondary"
                      >
                        <Sparkles className="size-3" /> {q}
                      </button>
                    ))}
                  </div>
                )}
                <Input
                  id="question"
                  className="h-10 bg-white"
                  placeholder="Write your own question"
                  value={form.question}
                  onChange={(e) => set("question", e.target.value)}
                  aria-invalid={!!errors.question}
                />
                <Input
                  aria-label="Answer"
                  className="h-10 bg-white"
                  placeholder="Answer"
                  value={form.answer}
                  onChange={(e) => set("answer", e.target.value)}
                  aria-invalid={!!errors.answer}
                />              </Field>
            )}

            <Field label="How should they reach you?" htmlFor="contact" error={errors.contact}>
              <div className="flex gap-2">
                {Object.entries(contactMethods).map(([value, { label, icon: Icon }]) => (
                  <Chip
                    key={value}
                    selected={form.contactMethod === value}
                    onClick={() => {
                      set("contactMethod", value);
                      set("contact", "");
                    }}
                  >
                    <Icon /> {label}
                  </Chip>
                ))}
              </div>
              <Input
                id="contact"
                type={contact.type}
                className="h-10 bg-white"
                placeholder={contact.placeholder}
                value={form.contact}
                onChange={(e) => set("contact", e.target.value)}
                aria-invalid={!!errors.contact}
              />
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                {form.status === "found" ? (
                  <>
                    <Lock className="mt-px size-3.5 shrink-0" /> Only shown to someone who answers your question correctly.
                  </>
                ) : (
                  <>
                    <Eye className="mt-px size-3.5 shrink-0" /> Shown on your post. Use email if you'd rather keep your number private.
                  </>
                )}
              </p>
            </Field>

            <Button type="submit" size="lg" className="h-11 w-full text-base">
              {mode.cta}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
