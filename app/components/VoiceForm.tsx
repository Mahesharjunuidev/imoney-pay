"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "./language-provider";
import { bankBranches, entityTypes, matchOption, parseServices, parseSpokenDate, serviceOptions } from "./voice-form-utils";

type RequestData = {
  entityName: string;
  entityType: string;
  tsp: string;
  services: string[];
  bankName: string;
  branchName: string;
  assignedBy: string;
  requestDate: string;
};
type Field = keyof RequestData;
type RecognitionEvent = { results: ArrayLike<{ isFinal: boolean; [index: number]: { transcript: string } }> };
type Recognition = {
  lang: string;
  interimResults: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
};
type RecognitionConstructor = new () => Recognition;
declare global {
  interface Window {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  }
}

const emptyForm: RequestData = {
  entityName: "", entityType: "", tsp: "", services: [],
  bankName: "", branchName: "", assignedBy: "", requestDate: "",
};
const fieldLabels: Record<Field, string> = {
  entityName: "Entity Name", entityType: "Entity Type", tsp: "TSP", services: "Services",
  bankName: "Bank Name", branchName: "Branch Name", assignedBy: "Task Assigned By", requestDate: "Date",
};
const fieldOrder = Object.keys(fieldLabels) as Field[];

export default function VoiceForm() {
  const { language, t } = useLanguage();
  const id = useId();
  const [form, setForm] = useState<RequestData>(emptyForm);
  const formRef = useRef(form);
  const [status, setStatus] = useState("");
  const [activeField, setActiveField] = useState<Field | "confirmation" | null>(null);
  const [retryFields, setRetryFields] = useState<Field[]>([]);
  const [retryConfirmation, setRetryConfirmation] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitted, setSubmitted] = useState<RequestData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const successDialog = useRef<HTMLDialogElement | null>(null);
  const session = useRef<{ recognition: Recognition | null; cancelled: boolean } | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (session.current) {
        session.current.cancelled = true;
        session.current.recognition?.abort();
        session.current = null;
      }
      if (utteranceRef.current) {
        window.speechSynthesis?.cancel();
        utteranceRef.current = null;
      }
      setActiveField(null);
      setRetryFields([]);
      setRetryConfirmation(false);
      setStatus("");
    };
  }, [language]);

  useEffect(() => {
    if (showSuccess) successDialog.current?.showModal();
    else successDialog.current?.close();
  }, [showSuccess]);

  function updateField(field: Field, value: string | string[]) {
    const next = { ...formRef.current, [field]: value } as RequestData;
    if (field === "bankName" && value !== formRef.current.bankName) next.branchName = "";
    formRef.current = next;
    setForm(next);
    setSubmitted(null);
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function stopVoice(message = t("Voice entry stopped.")) {
    if (session.current) {
      session.current.cancelled = true;
      session.current.recognition?.abort();
      session.current = null;
    }
    if (utteranceRef.current) {
      window.speechSynthesis?.cancel();
      utteranceRef.current = null;
    }
    setActiveField(null);
    setStatus(message);
  }

  function startVoice(fields: Field[]) {
    stopVoice("");
    setRetryFields([]);
    setRetryConfirmation(false);
    const Constructor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Constructor) {
      setStatus(t("Speech recognition is unavailable. Please use Chrome or type your answers."));
      return;
    }
    const currentSession = { recognition: null as Recognition | null, cancelled: false };
    session.current = currentSession;
    const isCurrent = () => !currentSession.cancelled && session.current === currentSession;

    function confirmSubmission() {
      if (!isCurrent()) return;
      if (!validateForm()) {
        stopVoice(t("Please complete the required fields before submitting."));
        return;
      }
      const prompt = t("All required fields are filled. Can I submit the form? Say yes to submit, or no to review.");
      setActiveField("confirmation");
      setStatus(prompt);

      function failConfirmation(message: string) {
        if (!isCurrent()) return;
        stopVoice(message);
        setRetryConfirmation(true);
      }

      let listening = false;
      function listenForConfirmation() {
        if (!isCurrent() || listening) return;
        listening = true;
        utteranceRef.current = null;
        const recognition = new Constructor!();
        currentSession.recognition = recognition;
        recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
        recognition.interimResults = false;
        let answered = false;
        recognition.onresult = (event) => {
          if (!isCurrent() || answered) return;
          const answer = (event.results[0]?.[0]?.transcript ?? "").toLowerCase().replace(/[.!?,]/g, "").trim();
          if (/^(yes|yes please|yes submit|yes submit it|yes submit the form|confirm|confirm submission|\u0939\u093e\u0901|\u0939\u093e\u0902)$/.test(answer)) {
            answered = true;
            stopVoice("");
            submitRequest(true);
          } else if (/^(no|no thanks|no thank you|stop|cancel|review|\u0928\u0939\u0940\u0902)$/.test(answer)) {
            answered = true;
            stopVoice(t("Submission cancelled. You can review or edit your answers."));
          } else {
            failConfirmation(t("No confirmation received. Say yes or no using Retry confirmation, or submit manually."));
          }
        };
        recognition.onerror = (event) => {
          failConfirmation(event.error === "not-allowed" || event.error === "service-not-allowed"
            ? t("Microphone access was denied. Allow microphone access in your browser or submit manually.")
            : t("I couldn't hear your confirmation. Please retry or submit manually."));
        };
        recognition.onend = () => {
          if (!isCurrent() || answered) return;
          currentSession.recognition = null;
          failConfirmation(t("I couldn't hear your confirmation. Please retry or submit manually."));
        };
        try { recognition.start(); }
        catch { failConfirmation(t("Could not start the microphone. Please retry or submit manually.")); }
      }

      if (!window.speechSynthesis) { listenForConfirmation(); return; }
      const utterance = new SpeechSynthesisUtterance(prompt);
      utteranceRef.current = utterance;
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      utterance.onend = listenForConfirmation;
      utterance.onerror = () => { if (isCurrent()) listenForConfirmation(); };
      window.speechSynthesis.speak(utterance);
    }

    function ask(index: number) {
      if (!isCurrent()) return;
      if (index >= fields.length) {
        if (validateForm()) {
          confirmSubmission();
          return;
        }
        session.current = null;
        setActiveField(null);
        setStatus(t("Voice entry complete. Review your answers before submitting."));
        return;
      }
      const field = fields[index];
      if (field === "branchName" && !formRef.current.bankName) {
        ask(index + 1);
        return;
      }
      const options = field === "entityType" ? entityTypes
        : field === "bankName" ? Object.keys(bankBranches)
        : field === "branchName" ? bankBranches[formRef.current.bankName] ?? []
        : field === "services" ? serviceOptions : [];
      const optional = field === "tsp" || field === "branchName";
      const prompt = `${t("Please say")} ${t(fieldLabels[field])}. ${options.map(t).join(", ")}${field === "requestDate" ? t("For example, 3 November 2026, or today.") : ""}${optional ? ` ${t("Say skip to leave this blank.")}` : ""}`;
      setActiveField(field);
      setStatus(prompt);
      document.getElementById(`${id}-${field}`)?.focus();

      function fail(message: string) {
        if (!isCurrent()) return;
        setRetryFields(fields.slice(index));
        stopVoice(message);
      }

      let listening = false;
      function listen() {
        if (!isCurrent() || listening) return;
        listening = true;
        utteranceRef.current = null;
        const recognition = new Constructor!();
        currentSession.recognition = recognition;
        recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
        recognition.interimResults = false;
        let accepted = false;
        recognition.onresult = (event) => {
          if (!isCurrent() || accepted) return;
          const answer = event.results[0]?.[0]?.transcript.trim() ?? "";
          if (/^(stop|cancel)$/i.test(answer)) {
            stopVoice();
            return;
          }
          if (!answer) return;
          if (answer.length > 150) {
            fail(t("Answer is too long. Please keep it under 150 characters."));
            return;
          }
          let value: string | string[] | null = answer;
          if (optional && /^skip$/i.test(answer)) value = "";
          else if (field === "requestDate") value = parseSpokenDate(answer);
          else if (field === "services") {
            value = parseServices(answer);
            if (!value.length) value = null;
          } else if (options.length) {
            const alias = field === "bankName" && /^s\s*\.?b\s*\.?i\.?$/i.test(answer) ? "State Bank of India" : answer;
            value = matchOption(alias, options) ?? options.find((option) => matchOption(answer, [t(option)])) ?? null;
          }
          if (value === null) {
            fail(field === "requestDate"
              ? t("Date not recognised. Say a day, month and year, or type the date.")
              : `${t("Please choose a listed option:")} ${options.map(t).join(", ")}.`);
            return;
          }
          accepted = true;
          updateField(field, value);
          setStatus(`${t(fieldLabels[field])}: ${Array.isArray(value) ? value.join(", ") : value || t("Skipped")}`);
        };
        recognition.onerror = (event) => {
          fail(event.error === "not-allowed" || event.error === "service-not-allowed"
            ? t("Microphone access was denied. Allow microphone access in your browser or type your answers.")
            : t("I couldn't hear that. Please try again or type your answer."));
        };
        recognition.onend = () => {
          if (!isCurrent()) return;
          currentSession.recognition = null;
          if (accepted) ask(index + 1);
          else fail(t("I couldn't hear that. Please try again or type your answer."));
        };
        try { recognition.start(); }
        catch { fail(t("Could not start the microphone. Please try again or type your answers.")); }
      }

      if (!window.speechSynthesis) { listen(); return; }
      const utterance = new SpeechSynthesisUtterance(prompt);
      utteranceRef.current = utterance;
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      utterance.onend = listen;
      utterance.onerror = () => { if (isCurrent()) listen(); };
      window.speechSynthesis.speak(utterance);
    }
    ask(0);
  }

  function validateForm() {
    const values = formRef.current;
    const missing: Partial<Record<Field, string>> = {};
    for (const field of ["entityName", "entityType", "bankName", "assignedBy", "requestDate"] as const) {
      if (!values[field].trim()) missing[field] = t("This field is required.");
    }
    if (!values.services.length) missing.services = t("Select at least one service.");
    if (values.requestDate && !parseSpokenDate(values.requestDate)) missing.requestDate = t("Enter a valid date.");
    setErrors(missing);
    const firstError = fieldOrder.find((field) => missing[field]);
    if (firstError) {
      document.getElementById(`${id}-${firstError}`)?.focus();
      setStatus(t("Please complete the required fields."));
      return false;
    }
    return true;
  }

  function submitRequest(voiceConfirmed = false) {
    if (!validateForm()) return;
    if (!voiceConfirmed && !window.confirm(t("Submit this form? Please make sure the answers are correct."))) return;
    const values = formRef.current;
    setSubmitted({ ...values, services: [...values.services] });
    setRetryFields([]);
    setRetryConfirmation(false);
    setShowSuccess(true);
    setStatus(t("Request submitted locally. It has not been sent to a server."));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    stopVoice("");
    submitRequest();
  }

  function renderField(field: Exclude<Field, "services">, required = false) {
    const options = field === "entityType" ? entityTypes : field === "bankName" ? Object.keys(bankBranches)
      : field === "branchName" ? bankBranches[form.bankName] ?? [] : null;
    const suggestions = field === "tsp" ? ["Other"]
      : field === "assignedBy" ? ["Self", "Relationship Manager", "Operations Team"] : null;
    const branchDisabled = field === "branchName" && !form.bankName;
    const disabled = branchDisabled || activeField === "confirmation";
    const inputProps = {
      id: `${id}-${field}`, name: field, value: form[field], disabled,
      "aria-required": required, "aria-invalid": !!errors[field],
      "aria-describedby": errors[field] ? `${id}-${field}-error` : branchDisabled ? `${id}-branch-hint` : undefined,
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => updateField(field, event.target.value),
    };
    return (
      <div className={`voice-request__field ${activeField === field ? "voice-request__field--active" : ""}`} key={field}>
        <div className="voice-request__label-row">
          <label htmlFor={inputProps.id}>{t(fieldLabels[field])}{required && <span className="voice-request__required"> *</span>}</label>
        </div>
        {options ? <select {...inputProps}><option value="">{t("Select an option")}</option>{options.map((option) => <option key={option} value={option}>{t(option)}</option>)}</select>
          : <input {...inputProps} list={suggestions ? `${id}-${field}-options` : undefined} type={field === "requestDate" ? "date" : "text"} maxLength={field === "requestDate" ? undefined : 150} placeholder={field === "entityName" ? t("Enter entity name") : undefined} />}
        {suggestions && <datalist id={`${id}-${field}-options`}>{suggestions.map((option) => <option key={option} value={t(option)} />)}</datalist>}
        {field === "bankName" && <p className="voice-request__hint">{t("Sample bank and branch data")}</p>}
        {branchDisabled && <p id={`${id}-branch-hint`} className="voice-request__hint">{t("Branch options load once a bank is selected.")}</p>}
        {errors[field] && <p id={`${id}-${field}-error`} className="voice-request__error">{errors[field]}</p>}
      </div>
    );
  }

  return (
    <section className="voice-request" aria-labelledby={`${id}-title`}>
      <div className="voice-request__brand" aria-label={t("Voice Form")}>
        <span aria-hidden="true">VF</span>
        <h1>{t("Voice Form")}</h1>
      </div>
      <header className="voice-request__header">
        <div><h2 id={`${id}-title`}>{t("Add New Request")}</h2><p>{t("Entity, bank and assignment details")}</p></div>
        <div className="voice-request__voice-actions">
          {activeField !== null ? <button type="button" className="voice-request__button voice-request__button--secondary" onClick={() => stopVoice()}>{t("Stop voice entry")}</button>
            : <button type="button" className="voice-request__button voice-request__button--primary" onClick={() => startVoice(fieldOrder)}>{t("Start voice entry")}</button>}
          {retryFields.length > 0 && activeField === null && <button type="button" className="voice-request__button voice-request__button--secondary" onClick={() => startVoice(retryFields)}>{t("Retry voice entry")}</button>}
          {retryConfirmation && activeField === null && <button type="button" className="voice-request__button voice-request__button--secondary" onClick={() => startVoice([])}>{t("Retry confirmation")}</button>}
        </div>
      </header>
      <p role="status" className="voice-request__status">{status}</p>
      <form noValidate onSubmit={handleSubmit} className="voice-request__form">
        <section className="voice-request__section" aria-labelledby={`${id}-entity-title`}>
          <h3 id={`${id}-entity-title`} className="voice-request__section-title">
            <span>1</span>{t("Entity Information")}
          </h3>
          <div className="voice-request__grid">
            {renderField("entityName", true)}
            {renderField("entityType", true)}
          </div>
          <div className="voice-request__grid">
            {renderField("tsp")}
            <div className={`voice-request__field ${activeField === "services" ? "voice-request__field--active" : ""}`}>
              <div className="voice-request__label-row"><span id={`${id}-services-label`}>{t("Services")}<span className="voice-request__required"> *</span></span></div>
              <div id={`${id}-services`} role="group" tabIndex={-1} aria-labelledby={`${id}-services-label`} aria-describedby={errors.services ? `${id}-services-error` : undefined} aria-invalid={!!errors.services} className="voice-request__services">
                {serviceOptions.map((service) => <label key={service}><input type="checkbox" name="services" value={service} disabled={activeField === "confirmation"} checked={form.services.includes(service)} onChange={(event) => updateField("services", event.target.checked ? [...form.services, service] : form.services.filter((value) => value !== service))} />{t(service)}</label>)}
              </div>
              {errors.services && <p id={`${id}-services-error`} className="voice-request__error">{errors.services}</p>}
            </div>
          </div>
        </section>
        <section className="voice-request__section" aria-labelledby={`${id}-bank-title`}>
          <h3 id={`${id}-bank-title`} className="voice-request__section-title">
            <span>2</span>{t("Bank Information")}
          </h3>
          <div className="voice-request__grid">
            {renderField("bankName", true)}
            {renderField("branchName")}
          </div>
        </section>
        <section className="voice-request__section" aria-labelledby={`${id}-assignment-title`}>
          <h3 id={`${id}-assignment-title`} className="voice-request__section-title">
            <span>3</span>{t("Assignment Information")}
          </h3>
          <div className="voice-request__grid">
            {renderField("assignedBy", true)}
            {renderField("requestDate", true)}
          </div>
        </section>
        <div className="voice-request__actions">
          <button type="button" className="voice-request__button voice-request__button--secondary" onClick={() => { stopVoice(""); formRef.current = emptyForm; setForm(emptyForm); setErrors({}); setSubmitted(null); setRetryFields([]); setRetryConfirmation(false); setShowSuccess(false); }}>{t("Cancel")}</button>
          <button type="submit" className="voice-request__button voice-request__button--primary" disabled={activeField !== null}>{t("Submit Request")}</button>
        </div>
      </form>
      <dialog ref={successDialog} className="voice-request__success-dialog" aria-labelledby={`${id}-success-title`} aria-describedby={`${id}-success-detail`} onClose={() => setShowSuccess(false)} onCancel={() => setShowSuccess(false)}>
        <div className="voice-request__success-mark" aria-hidden="true">OK</div>
        <h3 id={`${id}-success-title`}>{t("Form submitted successfully")}</h3>
        <p id={`${id}-success-detail`}>{t("Your request has been recorded in this page. It has not been sent to a server.")}</p>
        <button type="button" className="voice-request__button voice-request__button--primary" onClick={() => setShowSuccess(false)} autoFocus>{t("Done")}</button>
      </dialog>
      {submitted && <section className="voice-request__summary" aria-labelledby={`${id}-summary`}><h3 id={`${id}-summary`}>{t("Request preview")}</h3><dl>{fieldOrder.map((field) => <div key={field}><dt>{t(fieldLabels[field])}</dt><dd>{Array.isArray(submitted[field]) ? submitted[field].map(t).join(", ") : submitted[field] || t("Not provided")}</dd></div>)}</dl></section>}
    </section>
  );
}
