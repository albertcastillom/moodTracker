import { getJournalEntries, createJournalEntry } from "../api.js";

export function wireJournalUI(outlet) {
  const form = outlet.querySelector("#journalForm");
  const input = outlet.querySelector("#journalEntry");
  const list = outlet.querySelector("#journalEntryList");

  async function refreshJournal() {
    const journal = await getJournalEntries();
    render(journal);
  }

  function render(journal) {
    list.innerHTML = "";
    journal.forEach((entry) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = entry.entry;

      li.appendChild(span);
      list.appendChild(li);
    });
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const entry = input.value.trim();
    if (!entry) return;

    await createJournalEntry({ entry });
    input.value = "";
    await refreshJournal();
  });

  refreshJournal();
}
