const DATE_ONLY_OPTIONS = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
};

export function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", DATE_ONLY_OPTIONS);
}

export function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// "2026-10-25T00:00:00.000Z" -> "2026-10-25" (for <input type="date">)
export function toInputDate(value) {
  return value ? String(value).slice(0, 10) : "";
}

// Today's date in the user's local timezone as "YYYY-MM-DD"
export function todayInputDate() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export function isOverdue(dueDate, status) {
  if (!dueDate || status === "completed") return false;
  return toInputDate(dueDate) < todayInputDate();
}

export const formatDuration = (minutes = 0) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
};
