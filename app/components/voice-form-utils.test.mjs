import assert from "node:assert/strict";
import { it } from "node:test";
import { cleanTranscript, fieldLabels, parseFieldAnswer, parseFieldCommand } from "./voice-form-utils.ts";

const values = {
  entityName: "", entityType: "", tsp: "", services: [], bankName: "HDFC Bank",
  branchName: "", assignedBy: "", requestDate: "",
};

it("each displayed field name selects that field without supplying an answer", () => {
  for (const [field, label] of Object.entries(fieldLabels)) {
    assert.deepEqual(parseFieldCommand(`${label}.`), { field, answer: null });
  }
});

it("combined field names and answers accept spaces, colons, and commas", () => {
  for (const transcript of ["Entity Name Test", "Entity Name: Test", "Entity Name, Test."]) {
    assert.deepEqual(parseFieldCommand(transcript), { field: "entityName", answer: "Test" });
  }
  assert.deepEqual(parseFieldCommand("Entity Type Trust"), { field: "entityType", answer: "Trust" });
});

it("plain answers are not mistaken for field selections", () => {
  for (const transcript of ["Test", "Trust", "HDFC Bank", "Mumbai Main", "Datewood Ltd"]) {
    assert.equal(parseFieldCommand(transcript), null);
  }
});

it("free text is retained while empty or oversized answers are rejected", () => {
  assert.equal(parseFieldAnswer("entityName", "Test Private Limited.", values), "Test Private Limited");
  assert.equal(parseFieldAnswer("assignedBy", "Priya Malhotra", values), "Priya Malhotra");
  assert.equal(parseFieldAnswer("entityName", "", values), null);
  assert.equal(parseFieldAnswer("entityName", "long".repeat(40), values), null);
});

it("dropdown answers match listed values and common bank acronyms", () => {
  assert.equal(parseFieldAnswer("entityType", "trust", values), "Trust");
  assert.equal(parseFieldAnswer("entityType", "Unknown", values), null);
  assert.equal(parseFieldAnswer("bankName", "H D F C", values), "HDFC Bank");
  assert.equal(parseFieldAnswer("bankName", "S.B.I.", values), "State Bank of India");
  assert.equal(parseFieldAnswer("bankName", "ICICI", values), "ICICI Bank");
  assert.equal(parseFieldAnswer("bankName", "Unknown", values), null);
});

it("service selection accepts multiple services but rejects partial unknown selections", () => {
  assert.deepEqual(parseFieldAnswer("services", "A P I and payments", values), ["API", "Payments"]);
  assert.deepEqual(parseFieldAnswer("services", "all", values), ["API", "CBS", "Payments"]);
  assert.equal(parseFieldAnswer("services", "API and something else", values), null);
});

it("branch matching depends on the selected bank and optional fields can be skipped", () => {
  assert.equal(parseFieldAnswer("branchName", "Mumbai Main", values), "Mumbai Main");
  assert.equal(parseFieldAnswer("branchName", "Mumbai Main", { ...values, bankName: "" }), null);
  assert.equal(parseFieldAnswer("branchName", "skip", values), "");
  assert.equal(parseFieldAnswer("tsp", "not applicable", values), "");
});

it("dates become input-compatible ISO dates and impossible dates are rejected", () => {
  assert.equal(parseFieldAnswer("requestDate", "4 November 2026.", values), "2026-11-04");
  assert.equal(parseFieldAnswer("requestDate", "04/11/2026", values), "2026-11-04");
  assert.equal(parseFieldAnswer("requestDate", "31 February 2026", values), null);
  assert.equal(parseFieldAnswer("requestDate", "skip", values), null);
});

it("trailing speech punctuation is stripped without damaging interior punctuation", () => {
  assert.equal(cleanTranscript(" A.B. Company?! "), "A.B. Company");
  assert.equal(cleanTranscript(""), "");
});