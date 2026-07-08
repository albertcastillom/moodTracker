import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_BASE = "/api";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage] = useState("home");

  useEffect(() => {
    apiFetch("/auth/me")
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  if (authLoading) return <Shell loading />;
  if (!user) return <AuthScreen onAuthed={setUser} />;

  return <Shell user={user} page={page} setPage={setPage} onLogout={() => setUser(null)} />;
}

function Shell({ loading = false, user, page, setPage, onLogout }) {
  if (loading) {
    return (
      <main className="app-shell centered">
        <div className="breathing-card">Loading your space...</div>
      </main>
    );
  }

  const views = {
    home: <HomeScreen user={user} setPage={setPage} />,
    habits: <HabitsScreen />,
    journal: <JournalScreen />,
    settings: <SettingsScreen user={user} onLogout={onLogout} />,
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Wellness check-in</p>
          <h1>Mood Tracker</h1>
        </div>
        <nav className="nav-tabs" aria-label="Primary">
          {Object.keys(views).map((key) => (
            <button
              key={key}
              className={page === key ? "active" : ""}
              onClick={() => setPage(key)}
              type="button"
            >
              {key[0].toUpperCase() + key.slice(1)}
            </button>
          ))}
        </nav>
        <p className="sidebar-note">Signed in as {user.displayName}</p>
      </aside>
      <section className="content-panel">{views[page]}</section>
    </main>
  );
}

function AuthScreen({ onAuthed }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", displayName: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setStatus(mode === "login" ? "Signing you in..." : "Creating your account...");
    setError("");
    try {
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;
      const { user } = await apiFetch(`/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      onAuthed(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setStatus("");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <p className="eyebrow">Mood Tracker</p>
        <h1>Check in with yourself, and remember you are not alone.</h1>
        <p>
          Track your mood, keep private journal notes, and see how your city is
          feeling in a privacy-aware way.
        </p>
      </section>
      <form className="auth-card" onSubmit={submit}>
        <div className="segmented">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Login
          </button>
          <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            Register
          </button>
        </div>
        {mode === "register" && (
          <label>
            Display name
            <input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
          </label>
        )}
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
        </label>
        <button className="primary-btn" type="submit">
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
        <Status status={status} error={error} />
      </form>
    </main>
  );
}

function HomeScreen({ user, setPage }) {
  const [location, setLocation] = useState({ city: "", region: "", country: "" });
  const [manualCity, setManualCity] = useState("");
  const [mood, setMood] = useState(null);
  const [rating, setRating] = useState(5);
  const [note, setNote] = useState("");
  const [average, setAverage] = useState(null);
  const [habits, setHabits] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const city = location.city || manualCity.trim();

  useEffect(() => {
    apiFetch("/moods/today")
      .then(({ mood }) => {
        setMood(mood);
        if (mood) {
          setRating(mood.rating);
          setNote(mood.note || "");
          setLocation({ city: mood.city, region: mood.region || "", country: mood.country || "" });
        }
      })
      .catch((err) => setError(err.message));

    apiFetch("/habits/today")
      .then(({ habits }) => setHabits(habits.slice(0, 4)))
      .catch(() => setHabits([]));
  }, []);

  useEffect(() => {
    inferCity().then((nextLocation) => {
      if (nextLocation?.city) setLocation(nextLocation);
    });
  }, []);

  useEffect(() => {
    if (!city) return;
    apiFetch(`/moods/city-average?city=${encodeURIComponent(city)}`)
      .then(setAverage)
      .catch(() => setAverage(null));
  }, [city]);

  async function submitMood(e) {
    e.preventDefault();
    setStatus("Saving today's mood...");
    setError("");
    try {
      const payload = {
        rating,
        note,
        city,
        region: location.region,
        country: location.country,
      };
      const { mood } = await apiFetch("/moods/today", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setMood(mood);
      setStatus("Mood saved for today.");
      const avg = await apiFetch(`/moods/city-average?city=${encodeURIComponent(city)}`);
      setAverage(avg);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="screen-grid">
      <section className="hero-card">
        <p className="eyebrow">Hi {user.displayName}</p>
        <h2>How are you feeling today?</h2>
        <form onSubmit={submitMood} className="mood-form">
          <div className="mood-score">{rating}</div>
          <input type="range" min="1" max="10" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
          <textarea placeholder="Optional note for yourself" value={note} onChange={(e) => setNote(e.target.value)} />
          {!location.city && (
            <input placeholder="Enter your city" value={manualCity} onChange={(e) => setManualCity(e.target.value)} required />
          )}
          <button className="primary-btn" disabled={!city} type="submit">
            {mood ? "Update today's mood" : "Save today's mood"}
          </button>
          <Status status={status} error={error} />
        </form>
      </section>

      <section className="stat-card">
        <p className="eyebrow">{city || "City average"}</p>
        <h3>{average?.count ? Number(average.average).toFixed(1) : "--"}</h3>
        <p>
          {average?.count
            ? `${average.count} check-in${average.count === 1 ? "" : "s"} over the last ${average.windowDays} days.`
            : "Share your city to see how people nearby are feeling."}
        </p>
      </section>

      <section className="soft-card">
        <div className="card-heading">
          <h3>Today’s habits</h3>
          <button type="button" onClick={() => setPage("habits")}>Manage</button>
        </div>
        {habits.length ? (
          <ul className="mini-list">
            {habits.map((habit) => (
              <li key={habit.id}>
                <span>{habit.name}</span>
                <strong>{habit.completed ? "Done" : "Open"}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No habits yet. Create one to build your daily rhythm.</p>
        )}
      </section>

      <section className="soft-card prompt-card">
        <h3>Need to unpack the day?</h3>
        <p>A private journal entry is a gentle place to put the extra thoughts down.</p>
        <button className="secondary-btn" type="button" onClick={() => setPage("journal")}>
          Open journal
        </button>
      </section>
    </div>
  );
}

function HabitsScreen() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setStatus("Loading habits...");
    setError("");
    try {
      const data = await apiFetch("/habits/today");
      setHabits(data.habits);
    } catch (err) {
      setError(err.message);
    } finally {
      setStatus("");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addHabit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setStatus("Adding habit...");
    setError("");
    try {
      await apiFetch("/habits", { method: "POST", body: JSON.stringify({ name }) });
      setName("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleHabit(habit) {
    setError("");
    try {
      if (habit.completed) {
        await apiFetch(`/habits/${habit.id}/completions/${todayKey()}`, { method: "DELETE" });
      } else {
        await apiFetch(`/habits/${habit.id}/completions`, {
          method: "POST",
          body: JSON.stringify({ date: todayKey() }),
        });
      }
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteHabit(habit) {
    setError("");
    try {
      await apiFetch(`/habits/${habit.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="stack">
      <header>
        <p className="eyebrow">Daily rhythm</p>
        <h2>Habits</h2>
      </header>
      <form className="inline-form" onSubmit={addHabit}>
        <input placeholder="Add a habit, e.g. Walk 10 minutes" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="primary-btn" type="submit">Add</button>
      </form>
      <Status status={status} error={error} />
      <div className="habit-grid">
        {habits.map((habit) => (
          <article className={habit.completed ? "habit-card completed" : "habit-card"} key={habit.id}>
            <button type="button" onClick={() => toggleHabit(habit)}>
              <span>{habit.completed ? "Completed" : "Mark done"}</span>
              <strong>{habit.name}</strong>
            </button>
            <button className="text-btn" type="button" onClick={() => deleteHabit(habit)}>Archive</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function JournalScreen() {
  const emptyForm = useMemo(() => ({ id: "", title: "", body: "", entryDate: todayKey() }), []);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setStatus("Loading journal entries...");
    setError("");
    try {
      const data = await apiFetch("/journal");
      setEntries(data.entries);
    } catch (err) {
      setError(err.message);
    } finally {
      setStatus("");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveEntry(e) {
    e.preventDefault();
    setStatus("Saving journal entry...");
    setError("");
    try {
      const payload = { title: form.title, body: form.body, entryDate: form.entryDate };
      if (form.id) {
        await apiFetch(`/journal/${form.id}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await apiFetch("/journal", { method: "POST", body: JSON.stringify(payload) });
      }
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteEntry(entry) {
    setError("");
    try {
      await apiFetch(`/journal/${entry.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="journal-layout">
      <form className="journal-editor" onSubmit={saveEntry}>
        <p className="eyebrow">Private journal</p>
        <h2>{form.id ? "Edit entry" : "Write today down"}</h2>
        <input type="date" value={form.entryDate} onChange={(e) => setForm({ ...form, entryDate: e.target.value })} />
        <input placeholder="Optional title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea rows="10" placeholder="What is on your mind?" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
        <button className="primary-btn" type="submit">{form.id ? "Update entry" : "Save entry"}</button>
        <Status status={status} error={error} />
      </form>
      <div className="entry-list">
        {entries.map((entry) => (
          <article className="entry-card" key={entry.id}>
            <div>
              <p>{formatDate(entry.entryDate)}</p>
              <h3>{entry.title || "Untitled entry"}</h3>
              <span>{entry.body}</span>
            </div>
            <div className="entry-actions">
              <button type="button" onClick={() => setForm({
                id: entry.id,
                title: entry.title || "",
                body: entry.body,
                entryDate: entry.entryDate.slice(0, 10),
              })}>Edit</button>
              <button type="button" onClick={() => deleteEntry(entry)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SettingsScreen({ user, onLogout }) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function logout() {
    setStatus("Signing out...");
    setError("");
    try {
      await apiFetch("/auth/logout", { method: "POST" });
      onLogout();
    } catch (err) {
      setError(err.message);
    } finally {
      setStatus("");
    }
  }

  return (
    <section className="settings-card">
      <p className="eyebrow">Profile</p>
      <h2>{user.displayName}</h2>
      <p>{user.email}</p>
      <p className="muted">Mood averages use city-level location only. Coordinates are never sent to the API.</p>
      <button className="secondary-btn" type="button" onClick={logout}>Log out</button>
      <Status status={status} error={error} />
    </section>
  );
}

function Status({ status, error }) {
  if (!status && !error) return null;
  return <p className={error ? "status error" : "status"}>{error || status}</p>;
}

async function inferCity() {
  if (!navigator.geolocation) return null;

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(coords.latitude)}&lon=${encodeURIComponent(coords.longitude)}&format=json`;
          const res = await fetch(url, { headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error("Reverse geocode failed");
          const data = await res.json();
          const address = data.address || {};
          resolve({
            city: address.city || address.town || address.village || address.county || "",
            region: address.state || "",
            country: address.country || "",
          });
        } catch {
          resolve(null);
        }
      },
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 1000 * 60 * 60 },
    );
  });
}

createRoot(document.getElementById("root")).render(<App />);
