const API_BASE = "http://localhost:3000/api"; // adjust to your backend port

export async function getMoodsByDate(date) {
  const res = await fetch(`${API_BASE}/moods?date=${encodeURIComponent(date)}`);
  if (!res.ok) throw new Error("Failed to fetch moods");
  return res.json();
}

export async function createMood(mood) {
  const res = await fetch(`${API_BASE}/moods`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mood),
  });
  if (!res.ok) throw new Error("Failed to create mood");
  return res.json();
}

// add habits / journal helpers later
