const API_BASE = "/api"; // proxied by webpack devServer to localhost:3000

async function jsonFetch(path, options = {}) {
  const res = await fetch(path, options);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }

  // Optional safety check (helps catch SPA fallback HTML issues)
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Expected JSON but got ${contentType}. Body: ${text.slice(0, 120)}`,
    );
  }

  return res.json();
}

// ---- Current endpoints (matching the backend you’re using now) ----
export function fetchAverage() {
  return jsonFetch(`${API_BASE}/moods/average`);
}

export function submitMoodRating(rating) {
  return jsonFetch(`${API_BASE}/moods/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating }),
  });
}

// ---- Next step endpoints (for "all moods for a day") ----
// Once you add these routes on the backend, these will work:
export function getMoodsByDate(date) {
  return jsonFetch(`${API_BASE}/moods?date=${encodeURIComponent(date)}`);
}

export function createMood(mood) {
  return jsonFetch(`${API_BASE}/moods`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mood),
  });
}

///api for habits
export function getHabits() {
  return jsonFetch(`${API_BASE}/habits`);
}

export function createHabit(habit) {
  return jsonFetch(`${API_BASE}/habits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(habit),
  });
}

export function toggleHabitDone(habitId, completed) {
  return jsonFetch(`${API_BASE}/habits/${encodeURIComponent(habitId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
}

/////api for journal entries
export function getJournalEntries() {
  return jsonFetch(`${API_BASE}/journal`);
}

export function createJournalEntry(entry) {
  return jsonFetch(`${API_BASE}/journal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
}
