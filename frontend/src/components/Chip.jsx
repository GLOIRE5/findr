import { cn } from "@/lib/utils";

export default function Chip({ selected = false, className, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border bg-white px-3 text-sm transition-colors hover:border-navy/40 [&_svg]:size-3.5",
        selected && "border-navy bg-navy text-white hover:border-navy",
        className
      )}
      {...props}
    />
  );
}
