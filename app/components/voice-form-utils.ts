export type RequestData = {
  entityName: string;
  entityType: string;
  tsp: string;
  services: string[];
  bankName: string;
  branchName: string;
  assignedBy: string;
  requestDate: string;
};
export type RequestField = keyof RequestData;
export const fieldLabels: Record<RequestField, string> = {
  entityName: "Entity Name", entityType: "Entity Type", tsp: "TSP", services: "Services",
  bankName: "Bank Name", branchName: "Branch Name", assignedBy: "Task Assigned By", requestDate: "Date",
};
export const fieldOrder = Object.keys(fieldLabels) as RequestField[];

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

const fieldAliases: [RequestField, string[]][] = [
  ["entityName", ["entity name"]],
  ["entityType", ["entity type"]],
  ["tsp", ["tsp", "t s p", "technical service provider"]],
  ["services", ["services", "service"]],
  ["bankName", ["bank name", "bank"]],
  ["branchName", ["branch name", "branch"]],
  ["assignedBy", ["task assigned by", "assigned by"]],
  ["requestDate", ["request date", "date"]],
];

export function cleanTranscript(transcript: string): string {
  const text = transcript.trim();
  let end = text.length;
  while (end > 0 && ".!?".includes(text[end - 1])) end -= 1;
  return text.slice(0, end).trim();
}

export function parseFieldCommand(transcript: string): { field: RequestField; answer: string | null } | null {
  const text = cleanTranscript(transcript);
  for (const [field, aliases] of fieldAliases) {
    for (const alias of aliases) {
      if (normalize(text) === normalize(alias)) return { field, answer: null };
      const fieldPattern = alias.replaceAll(" ", String.raw`\s+`);
      const pattern = new RegExp(String.raw`^${fieldPattern}(?:\s*[:,]\s*|\s+)(.+)$`, "i");
      const match = pattern.exec(text);
      if (match) return { field, answer: match[1].trim() };
    }
  }
  return null;
}

export function parseFieldAnswer(field: RequestField, transcript: string, values: RequestData): string | string[] | null {
  const answer = cleanTranscript(transcript);
  if (!answer || answer.length > 150) return null;
  if ((field === "tsp" || field === "branchName") && /^(skip|none|not applicable)$/i.test(answer)) return "";
  if (field === "requestDate") return parseSpokenDate(answer);
  if (field === "services") {
    const services = parseServices(answer);
    return services.length ? services : null;
  }
  if (field === "entityType") return matchOption(answer, entityTypes);
  if (field === "bankName") {
    const aliases: Record<string, string> = { sbi: "State Bank of India", hdfc: "HDFC Bank", icici: "ICICI Bank" };
    const bank = aliases[normalize(answer)] ?? answer;
    return matchOption(bank, Object.keys(bankBranches));
  }
  if (field === "branchName") return matchOption(answer, bankBranches[values.bankName] ?? []);
  return answer;
}

export function parseServices(answer: string): string[] {
  const normalized = normalize(answer.replace(/\b(and|plus)\b/gi, ""));
  if (["all", "allservices", "allthree"].includes(normalized)) return [...serviceOptions];
  if (!/^(api|cbs|payments)+$/.test(normalized)) return [];
  const spoken: readonly string[] = normalized.match(/api|cbs|payments/g) ?? [];
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