import { cn } from "@/lib/utils";

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function toPlainParagraphs(value: string) {
  return value
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function RichTextContent({
  value,
  className,
}: {
  value?: string | null;
  className?: string;
}) {
  const content = value?.trim();
  if (!content) {
    return <p className={cn("text-sm text-[#94A3B8]", className)}>Not provided.</p>;
  }

  if (looksLikeHtml(content)) {
    return (
      <div
        className={cn(
          "prose prose-sm max-w-none leading-relaxed text-[#173740] [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className={cn("space-y-2 leading-relaxed text-[#173740]", className)}>
      {toPlainParagraphs(content).map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </div>
  );
}

export function formatCareerStageLabel(stage: string) {
  if (!stage) return "Career stage";
  const label = stage.charAt(0).toUpperCase() + stage.slice(1);
  return `${label} stage`;
}

export function formatDurationLabel(duration?: string | null) {
  const value = duration?.trim();
  if (!value) return null;
  if (/week/i.test(value)) return value;
  return `${value} weeks duration`;
}
