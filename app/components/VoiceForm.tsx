"use client";

import { useState } from "react";
import { useLanguage } from "./language-provider";

type FormData = {
  name: string;
  requestDate: string;
  category: string;
  description: string;
};

type SpeechRecognitionResult = {
  isFinal: boolean;
  [index: number]: { transcript: string };
};

type SpeechRecognitionEvent = {
  results: SpeechRecognitionResult[];
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const emptyForm: FormData = {
  name: "",
  requestDate: "",
  category: "",
  description: "",
};

export default function VoiceForm() {
  const { language, t } = useLanguage();
  const [form, setForm] = useState<FormData>(emptyForm);
  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState<FormData | null>(null);

  function updateField(field: keyof FormData, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startVoiceForm() {
    const SpeechRecognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus(
        t(
          "Speech recognition is unavailable. Please use Chrome or type your answers.",
        ),
      );
      return;
    }

    const questions: { field: keyof FormData; prompt: string }[] = [
      { field: "name", prompt: t("Please say your name.") },
      { field: "requestDate", prompt: t("Please say the request date.") },
      {
        field: "category",
        prompt: t("Please say a category: Access, Hardware, or Software."),
      },
      { field: "description", prompt: t("Please describe your request.") },
    ];

    const ask = (index: number) => {
      if (index >= questions.length) {
        setStatus(
          t("Voice entry complete. Review your answers before submitting."),
        );
        return;
      }

      const question = questions[index];
      setStatus(question.prompt);

      const utterance = new SpeechSynthesisUtterance(question.prompt);
      utterance.lang = language === "hi" ? "hi-IN" : "en-US";
      utterance.onend = () => {
        const recognition = new SpeechRecognition();
        recognition.lang = language === "hi" ? "hi-IN" : "en-US";
        recognition.interimResults = false;

        recognition.onresult = (event) => {
          const answer = event.results[0]?.[0]?.transcript?.trim() ?? "";
          if (answer) updateField(question.field, answer);
        };

        recognition.onerror = () => {
          setStatus(
            t("I couldn't hear that. Please try again or type your answer."),
          );
        };

        recognition.onend = () => {
          window.setTimeout(() => ask(index + 1), 300);
        };

        recognition.start();
      };

      window.speechSynthesis.speak(utterance);
    };

    ask(0);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !window.confirm(
        t("Submit this form? Please make sure the answers are correct."),
      )
    ) {
      return;
    }

    setSubmitted(form);
    setStatus(t("Form submitted successfully."));
  }

  return (
    <main className="mx-auto w-full max-w-xl p-6">
      <h1 className="mb-2 text-2xl font-bold">{t("Voice Request Form")}</h1>
      <p className="mb-5 text-gray-600">
        {t(
          "Use voice entry or fill in the fields manually. Review your answers before submitting.",
        )}
      </p>

      <button
        type="button"
        onClick={startVoiceForm}
        className="mb-4 rounded bg-blue-700 px-4 py-2 text-white"
      >
        {t("Start voice entry")}
      </button>

      <p aria-live="polite" className="mb-4 min-h-6 text-sm text-gray-700">
        {status}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block font-medium">{t("Name *")}</span>
          <input
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full rounded border p-2"
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-medium">{t("Request date *")}</span>
          <input
            required
            type="date"
            value={form.requestDate}
            onChange={(event) => updateField("requestDate", event.target.value)}
            className="w-full rounded border p-2"
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-medium">{t("Category *")}</span>
          <select
            required
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="w-full rounded border p-2"
          >
            <option value="">{t("Select a category")}</option>
            <option value="Access">{t("Access")}</option>
            <option value="Hardware">{t("Hardware")}</option>
            <option value="Software">{t("Software")}</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block font-medium">{t("Description *")}</span>
          <textarea
            required
            minLength={5}
            maxLength={500}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            className="w-full rounded border p-2"
            rows={4}
          />
        </label>

        <button
          type="submit"
          className="rounded bg-green-700 px-4 py-2 text-white"
        >
          {t("Review and submit")}
        </button>
      </form>

      {submitted && (
        <section
          className="mt-6 rounded border bg-gray-50 p-4"
          aria-live="polite"
        >
          <h2 className="mb-2 font-bold">{t("Submitted form")}</h2>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
}
