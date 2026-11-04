"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useLanguage } from "./language-provider";
import { cleanTranscript, fieldLabels, fieldOrder, parseFieldAnswer, parseFieldCommand, type RequestData, type RequestField } from "./voice-form-utils";
import { deleteVoiceRecord, loadVoiceRecords, saveVoiceRecord, type VoiceRecord } from "./voice-form-records";

type DirectSession = {
  cancelled: boolean;
  recognition: InstanceType<NonNullable<Window["SpeechRecognition"]>> | null;
  recorder: MediaRecorder | null;
  stream: MediaStream | null;
  chunks: Blob[];
  transcript: string[];
  field: RequestField | null;
  handled: Set<RequestField>;
  completed: RequestData | null;
  startedAt: number;
  lastCueMs: number;
  captions: string[];
};

type RecordedClip = { audio: Blob; transcript: string[]; captions: string };

type DirectEntryOptions = {
  enabled: boolean;
  idPrefix: string;
  values: RefObject<RequestData>;
  updateField: (field: RequestField, value: string | string[]) => void;
  validate: () => boolean;
  setStatus: (status: string) => void;
};

function releaseSession(current: DirectSession) {
  current.cancelled = true;
  current.recognition?.abort();
  if (current.recorder && current.recorder.state !== "inactive") {
    current.recorder.stop();
  } else {
    current.stream?.getTracks().forEach((track) => track.stop());
  }
}

function captionTime(milliseconds: number) {
  return new Date(Math.max(0, Math.floor(milliseconds))).toISOString().slice(11, 23);
}

export function useDirectVoiceEntry({ enabled, idPrefix, values, updateField, validate, setStatus }: DirectEntryOptions) {
  const { language, t } = useLanguage();
  const [records, setRecords] = useState<VoiceRecord[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedField, setSelectedField] = useState<RequestField | null>(null);
  const [storageError, setStorageError] = useState("");
  const currentSession = useRef<DirectSession | null>(null);
  const pendingRecording = useRef<Promise<RecordedClip | null> | null>(null);
  const mounted = useRef(false);
  const saving = useRef(false);
  const sessionOnlyIds = useRef(new Set<string>());
  const deletedIds = useRef(new Set<string>());

  useEffect(() => {
    mounted.current = true;
    let active = true;
    if (enabled) {
      loadVoiceRecords().then((stored) => {
        if (active) setRecords((current) => [...new Map([...stored, ...current].map((record) => [record.id, record])).values()].filter((record) => !deletedIds.current.has(record.id)).sort((first, second) => second.createdAt.localeCompare(first.createdAt)));
      }).catch(() => {
        if (active) setStorageError(t("Browser storage is unavailable. New records will be available only for this session."));
      });
    }
    return () => {
      active = false;
      mounted.current = false;
      if (currentSession.current) {
        releaseSession(currentSession.current);
        currentSession.current = null;
      }
    };
  }, [enabled, language, t]);

  async function store(answers: RequestData, transcript: string[], audio: Blob | null, captions = "WEBVTT\n\n") {
    const record: VoiceRecord = {
      id: crypto.randomUUID(), createdAt: new Date().toISOString(), answers, transcript, audio, captions,
    };
    let persisted = true;
    try { await saveVoiceRecord(record); }
    catch { persisted = false; sessionOnlyIds.current.add(record.id); }
    saving.current = false;
    if (!mounted.current) return;
    setRecords((current) => [record, ...current]);
    setIsSaving(false);
    let message = t("Answers are available below for this session only. Browser storage could not save the recording.");
    if (persisted) message = audio ? t("Answers and recording saved in this browser. They are available below.") : t("Answers saved in this browser. No recording was captured.");
    setStatus(message);
    if (!persisted) setStorageError(t("Browser storage is unavailable. Download this record before leaving the page."));
  }

  async function removeRecord(id: string) {
    if (!sessionOnlyIds.current.has(id)) await deleteVoiceRecord(id);
    deletedIds.current.add(id);
    sessionOnlyIds.current.delete(id);
    if (!mounted.current) return;
    setRecords((current) => current.filter((record) => record.id !== id));
    setStatus(t("Saved output and its recording deleted."));
  }

  function stop(message = t("Recording stopped. Your voice recording is ready to save with the form.")) {
    const current = currentSession.current;
    currentSession.current = null;
    if (current) releaseSession(current);
    setIsStarting(false);
    setIsRecording(false);
    setSelectedField(null);
    setStatus(message);
  }

  function discard() {
    stop("");
    pendingRecording.current = null;
  }

  function finish() {
    if (saving.current || isStarting || !validate()) return;
    saving.current = true;
    setIsSaving(true);
    const snapshot = { ...values.current, services: [...values.current.services] };
    const current = currentSession.current;
    if (!current) {
      const recording = pendingRecording.current;
      pendingRecording.current = null;
      setStatus(t("Saving answers and recording..."));
      void (recording ?? Promise.resolve(null)).then((clip) => store(snapshot, clip?.transcript ?? [], clip?.audio ?? null, clip?.captions));
      return;
    }
    current.completed = snapshot;
    currentSession.current = null;
    releaseSession(current);
    setIsRecording(false);
    setSelectedField(null);
    setStatus(t("Saving answers and recording..."));
  }

  async function start() {
    if (currentSession.current || saving.current) return;
    const Constructor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Constructor || !navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setStatus(t("Voice recording is unavailable. Use Chrome or Edge on HTTPS or localhost, or fill the form manually."));
      return;
    }
    const current: DirectSession = {
      cancelled: false, recognition: null, recorder: null, stream: null, chunks: [], transcript: [],
      field: null, handled: new Set(fieldOrder.filter((field) => values.current[field].length > 0)), completed: null,
      startedAt: 0, lastCueMs: 0, captions: [],
    };
    pendingRecording.current = null;
    currentSession.current = current;
    const isCurrent = () => !current.cancelled && currentSession.current === current;
    setIsStarting(true);
    setStatus(t("Waiting for microphone permission..."));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!isCurrent()) { stream.getTracks().forEach((track) => track.stop()); return; }
      current.stream = stream;
      const mimeType = ["audio/webm;codecs=opus", "audio/ogg;codecs=opus", "audio/mp4"].find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      current.recorder = recorder;
      let resolveRecording: (clip: RecordedClip | null) => void = () => {};
      pendingRecording.current = new Promise((resolve) => { resolveRecording = resolve; });
      let recordingFailed = false;
      recorder.ondataavailable = (event) => { if (event.data.size) current.chunks.push(event.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const audio = new Blob(current.chunks, { type: recorder.mimeType || current.chunks[0]?.type || "audio/webm" });
        const clip = audio.size && !recordingFailed ? {
          audio, transcript: [...current.transcript], captions: `WEBVTT\n\n${current.captions.join("\n\n")}\n`,
        } : null;
        resolveRecording(clip);
        if (!current.completed) {
          if (isCurrent()) stop(t("The recording was interrupted. Your answers remain in the form."));
          return;
        }
        pendingRecording.current = null;
        void store(current.completed, clip?.transcript ?? [], clip?.audio ?? null, clip?.captions);
      };
      recorder.onerror = () => {
        recordingFailed = true;
        resolveRecording(null);
        if (isCurrent()) stop(t("The recording failed. Your answers remain in the form; please start again."));
      };
      const recognition = new Constructor();
      current.recognition = recognition;
      recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
      recognition.continuous = true;
      recognition.interimResults = false;
      function applyAnswer(field: RequestField, transcript: string) {
        const answer = parseFieldAnswer(field, transcript, values.current);
        if (answer === null) {
          setStatus(`${t(fieldLabels[field])}: ${t("Answer not recognised. The field has not changed.")}`);
          return;
        }
        if (field === "bankName" && answer !== values.current.bankName) current.handled.delete("branchName");
        updateField(field, answer);
        current.handled.add(field);
        current.field = null;
        setSelectedField(null);
        setStatus(`${t(fieldLabels[field])}: ${Array.isArray(answer) ? answer.join(", ") : answer || t("Skipped")}`);
        if (fieldOrder.every((fieldName) => current.handled.has(fieldName))) finish();
      }

      function handleTranscript(transcript: string) {
        current.transcript.push(transcript);
        const elapsed = Math.max(current.lastCueMs + 1, performance.now() - current.startedAt);
        current.captions.push(`${captionTime(current.lastCueMs)} --> ${captionTime(elapsed)}\n${transcript}`);
        current.lastCueMs = elapsed;
        const commandText = cleanTranscript(transcript).toLowerCase();
        if (commandText === "stop" || commandText === "cancel") { stop(); return; }
        if (commandText === "finish" || commandText === "save" || commandText === "submit") { finish(); return; }
        const command = parseFieldCommand(transcript);
        if (command) {
          current.field = command.field;
          setSelectedField(command.field);
          document.getElementById(`${idPrefix}-${command.field}`)?.focus();
          if (!command.answer) {
            setStatus(`${t(fieldLabels[command.field])}: ${t("Listening")}`);
            return;
          }
        }
        if (!current.field) {
          setStatus(t("No field selected. The answer has not been applied."));
          return;
        }
        applyAnswer(current.field, command?.answer ?? transcript);
      }

      recognition.onresult = (event) => {
        if (!isCurrent()) return;
        for (let index = event.resultIndex ?? 0; index < event.results.length; index += 1) {
          if (!isCurrent()) break;
          const result = event.results[index];
          if (!result.isFinal) continue;
          const transcript = result[0]?.transcript.trim();
          if (!transcript) continue;
          handleTranscript(transcript);
        }
      };
      recognition.onerror = (event) => {
        if (!isCurrent() || event.error === "no-speech") return;
        stop(event.error === "not-allowed" || event.error === "service-not-allowed"
          ? t("Microphone permission was denied. Allow access in your browser and try again.")
          : t("Speech recognition stopped. Your answers remain in the form; please start again."));
      };
      recognition.onend = () => {
        if (!isCurrent()) return;
        try { recognition.start(); }
        catch { stop(t("Speech recognition stopped. Your answers remain in the form; please start again.")); }
      };
      current.startedAt = performance.now();
      recorder.start(1000);
      recognition.start();
      setIsStarting(false);
      setIsRecording(true);
      setStatus(t("Listening. Voice recording is in progress."));
    } catch {
      if (isCurrent()) {
        pendingRecording.current = null;
        stop(t("Could not access the microphone. Check browser permissions and try again."));
      }
    }
  }

  return { start, stop, discard, finish, removeRecord, isStarting, isRecording, isSaving, selectedField, records, storageError };
}

function SavedRecord({ record, onDelete }: { readonly record: VoiceRecord; readonly onDelete: (id: string) => Promise<void> }) {
  const { t } = useLanguage();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const audio = useRef<HTMLAudioElement | null>(null);
  const downloadUrl = useRef<string | null>(null);
  useEffect(() => {
    if (!record.audio) return;
    const url = URL.createObjectURL(record.audio);
    const player = audio.current;
    if (player) player.src = url;
    downloadUrl.current = url;
    return () => {
      if (player) { player.pause(); player.removeAttribute("src"); player.load(); }
      URL.revokeObjectURL(url);
      downloadUrl.current = null;
    };
  }, [record.audio]);
  let extension = "webm";
  if (record.audio?.type.includes("mp4")) extension = "m4a";
  else if (record.audio?.type.includes("ogg")) extension = "ogg";
  function downloadRecording() {
    if (!downloadUrl.current) return;
    const link = document.createElement("a");
    link.href = downloadUrl.current;
    link.download = `voice-form-${record.id}.${extension}`;
    link.click();
  }
  async function deleteOutput() {
    if (isDeleting || !window.confirm(t("Delete this saved output, including its form data, recording and transcript? This cannot be undone."))) return;
    setIsDeleting(true);
    setDeleteError("");
    try { await onDelete(record.id); }
    catch {
      setDeleteError(t("Could not delete this output from browser storage. Please try again."));
      setIsDeleting(false);
    }
  }
  return (
    <article className="voice-request__saved-record">
      <header><h4>{record.answers.entityName}</h4><time dateTime={record.createdAt}>{new Date(record.createdAt).toLocaleString()}</time><button type="button" className="voice-request__button voice-request__button--danger" disabled={isDeleting} onClick={() => { void deleteOutput(); }} aria-label={`${t("Delete output for")} ${record.answers.entityName}`}>{isDeleting ? t("Deleting...") : t("Delete output")}</button></header>
      {deleteError && <p role="alert" className="voice-request__error">{deleteError}</p>}
      <dl>{fieldOrder.map((field) => <div key={field}><dt>{t(fieldLabels[field])}</dt><dd>{Array.isArray(record.answers[field]) ? record.answers[field].join(", ") : record.answers[field] || t("Not provided")}</dd></div>)}</dl>
      <section className="voice-request__audio-output" aria-label={t("Recorded voice")}>
        <h5>{t("Recorded voice")}</h5>
        {record.audio ? <div className="voice-request__recording"><audio ref={audio} controls preload="metadata" aria-label={`${t("Listen to recorded voice for")} ${record.answers.entityName}`}><track kind="captions" label={t("Transcript")} srcLang="en" src={`data:text/vtt;charset=utf-8,${encodeURIComponent(record.captions ?? "WEBVTT\n\n")}`} /></audio><button type="button" className="voice-request__button voice-request__button--primary" onClick={downloadRecording}>{t("Download recorded voice")}</button></div> : <p className="voice-request__hint">{t("No audio was captured for this saved form. Start voice entry to create a new recording.")}</p>}
      </section>
      {record.transcript.length > 0 && <details><summary>{t("Transcript")}</summary><ol>{record.transcript.map((line, index) => <li key={`${index}-${line}`}>{line}</li>)}</ol></details>}
    </article>
  );
}

export function DirectVoiceArchive({ records, storageError, onDelete }: { readonly records: VoiceRecord[]; readonly storageError: string; readonly onDelete: (id: string) => Promise<void> }) {
  const { t } = useLanguage();
  return (
    <section className="voice-request__archive" aria-label={t("Saved answers and recordings")}>
      <h3>{t("Saved answers and recordings")}</h3>
      {storageError && <p role="alert" className="voice-request__error">{storageError}</p>}
      {records.length ? records.map((record) => <SavedRecord key={record.id} record={record} onDelete={onDelete} />) : <p className="voice-request__hint">{t("No saved requests yet.")}</p>}
    </section>
  );
}