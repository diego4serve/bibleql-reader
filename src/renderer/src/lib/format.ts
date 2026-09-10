export interface StrippedContext {
  pre: string;
  hit: string;
  post: string;
}

const MARK_RE = /^([\s\S]*?)<mark>([\s\S]*?)<\/mark>([\s\S]*)$/;

function stripTags(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

// GraphQL concordance context comes back with the matched word wrapped in
// <mark></mark> — split it into the parts around the highlight.
export function stripMarkContext(context: string): StrippedContext {
  const ctx = String(context || "");
  const m = ctx.match(MARK_RE);
  if (!m) return { pre: stripTags(ctx), hit: "", post: "" };
  return { pre: stripTags(m[1]), hit: stripTags(m[2]), post: stripTags(m[3]) };
}

export function fillTemplate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((acc, [key, value]) => acc.replaceAll(`%${key}`, value), template);
}
