export type SnackSeverity = "error" | "success" | "info";

export type SnackNotice = {
  message: string;
  severity: SnackSeverity;
};

type SnackHandler = (notice: SnackNotice) => void;

let handler: SnackHandler | null = null;

export function bindSnackbar(next: SnackHandler | null) {
  handler = next;
}

export function notify(message: string, severity: SnackSeverity = "error") {
  const text = message?.trim();
  if (!text || !handler) return;
  handler({message: text, severity});
}

export function notifyError(message: string) {
  notify(message, "error");
}

export function notifySuccess(message: string) {
  notify(message, "success");
}

export function errorMessageFromUnknown(err: unknown, fallback = "요청에 실패했습니다") {
  const anyErr = err as {response?: {data?: unknown}; message?: string};
  const data = anyErr?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as {message?: unknown}).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  if (typeof anyErr?.message === "string" && anyErr.message.trim()) return anyErr.message;
  return fallback;
}
