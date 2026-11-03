export const entityTypes = ["Company", "Partnership", "Sole Proprietorship", "Trust", "NGO"];
export const serviceOptions = ["API", "CBS", "Payments"];
export const bankBranches: Record<string, string[]> = {
  "State Bank of India": ["Mumbai Main", "New Delhi Main", "Bengaluru Main"],
  "HDFC Bank": ["Mumbai Main", "New Delhi Main", "Bengaluru Main"],
  "ICICI Bank": ["Mumbai Main", "New Delhi Main", "Bengaluru Main"],
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

export function matchOption(answer: string, options: readonly string[]): string | null {
  const normalized = normalize(answer);
  if (!normalized) return null;
  return options.find((option) => normalize(option) === normalized) ?? null;
}

export function parseServices(answer: string): string[] {
  const normalized = normalize(answer.replace(/\b(and|plus)\b/gi, ""));
  if (["all", "allservices", "allthree"].includes(normalized)) return [...serviceOptions];
  if (!/^(api|cbs|payments)+$/.test(normalized)) return [];
  const spoken = normalized.match(/api|cbs|payments/g) ?? [];
  return serviceOptions.filter((option) => spoken.includes(normalize(option)));
}

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseSpokenDate(answer: string, now = new Date()): string | null {
  const text = answer.toLowerCase().trim().replace(/(\d)(st|nd|rd|th)\b/g, "$1").replaceAll(",", "");
  if (text === "today" || text === "tomorrow") {
    const date = new Date(now);
    if (text === "tomorrow") date.setDate(date.getDate() + 1);
    return localDate(date);
  }
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text);
  const numeric = /^(\d{1,2})[/. -](\d{1,2})[/. -](\d{4})$/.exec(text);
  const named = /^(?:(\d{1,2})\s+([a-z]+)|([a-z]+)\s+(\d{1,2}))\s+(\d{4})$/.exec(text);
  let year: number;
  let month: number;
  let day: number;
  if (iso) {
    [, year, month, day] = iso.map(Number);
  } else if (numeric) {
    [, day, month, year] = numeric.map(Number);
  } else if (named) {
    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const monthName = named[2] || named[3];
    month = months.findIndex((name) => name === monthName || name.slice(0, 3) === monthName) + 1;
    day = Number(named[1] || named[4]);
    year = Number(named[5]);
  } else {
    return null;
  }
  const date = new Date(year, month - 1, day);
  if (year < 1900 || year > 9999 || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return localDate(date);
}